<script lang="ts">
	import { afterUpdate, onDestroy, onMount } from "svelte";
  import Hexagon from "../shared/Hexagon.svelte";
  import MaterialSymbolsUndoRounded from '~icons/material-symbols/undo-rounded'
  import PhLightbulb from '~icons/ph/lightbulb'
  import PhShuffle from '~icons/ph/shuffle'
  import { isPangram } from '$lib/utils/points'
  import gameData from "$lib/stores/gameData";
	import type Puzzle from "$shared/interfaces/Puzzle";
	import type Score from "$shared/interfaces/Score";
	import { getHint, tryWord } from "$lib/stores/currentScore";

  $: outsideLetters = $gameData.exists
                        ? $gameData.puzzle.outsideLetters
                        : ['', '', '', '', '', ''] 
  let word = ""
  let pressedKeys: string[] = []
  let isComponentDestroyed = false
  let wordIsPangram = false
  let wordIsClearing = false
  let animating = false
  let screenWidth = -1
  $: hexagonSize = screenWidth >= 768 ? 100 : 80

  type NotificationType = "default" | "congrats" | "pangram"
  type Notification = { type: NotificationType, message: string }
  let notification: Notification = {
    type: "default",
    message: ""
  }
  let notificationKey = 0

  const generateRandomCongratsMessage = () => {
    const messages = [
      'Nice!',
      'Well done!',
      'Great word!',
      'Perfect!',
      'Bravo!',
      'Outstanding!',
      'Impressive!',
      'Brilliant!',
      'Fantastic!'
    ]

    return messages[Math.round(Math.random() * (messages.length - 1))]
  }
  
  const setGameNotification = (type: NotificationType, message: string) => {
    notification = { type, message }
    notificationKey++
  }

  const addLetter = (letter: string | undefined) => {
    if(!letter || animating) return
    (document.activeElement as HTMLElement)?.blur()
    word = word + letter.toUpperCase()
  }

  const removeLetter = () => {
    if(animating) return
    (document.activeElement as HTMLElement)?.blur()
    if(word.length > 0) word = word.slice(0, -1)
  }

  const showPangramAnimation = () => {
    const LETTER_ANIMATION_DELAY_MS = 100
    const ANIMATION_LENGTH = 3500
    const HEXAGON_ANIMATION_DELAY_MS = 250
    let letterIndex = 0
    for(let elem of document.getElementById('word')!.getElementsByTagName('span')) {
      elem.style.animationDuration = `${ANIMATION_LENGTH}ms`
      elem.style.animationDelay = `${LETTER_ANIMATION_DELAY_MS * letterIndex}ms`
      letterIndex++
    }

    let hexIndex = 0
    for(let letter of document.getElementById('main-game')!.getElementsByClassName('letter-button') as HTMLCollectionOf<SVGElement>) {
      letter.childNodes.forEach(n => {
        (n as HTMLElement).style.animationDelay = `${HEXAGON_ANIMATION_DELAY_MS * hexIndex}ms`;
        // Maximum animation duration such that each hexagon can animate the whole way through before the word disappears
        (n as HTMLElement).style.animationDuration = `${ANIMATION_LENGTH + (LETTER_ANIMATION_DELAY_MS * letterIndex) - (7 * HEXAGON_ANIMATION_DELAY_MS)}ms`
      })
      
      hexIndex++
    }

    wordIsPangram = true
    animating = true
    setGameNotification('pangram', 'Well done, you found a pangram!')

    setTimeout(() => {
      if(isComponentDestroyed) return
      word = ''
      wordIsPangram = false
      animating = false
    }, (LETTER_ANIMATION_DELAY_MS * letterIndex) + ANIMATION_LENGTH)
  }

  const showClearWordAnimation = () => {
    const START_ANIMATION_DELAY_MS = 750
    const LETTER_ANIMATION_DELAY_MS = 50
    const ANIMATION_LENGTH = 500

    let index = 0
    for(let elem of document.getElementById('word')!.getElementsByTagName('span')) {
      elem.style.animationDelay = `${START_ANIMATION_DELAY_MS + (LETTER_ANIMATION_DELAY_MS * index)}ms`
      index++
    }

    animating = true
    wordIsClearing = true

    setTimeout(() => {
      if(isComponentDestroyed) return

      word = ''
      wordIsClearing = false
      animating = false
    }, START_ANIMATION_DELAY_MS + (LETTER_ANIMATION_DELAY_MS * index) + ANIMATION_LENGTH)
  }

  const submitWord = () => {
    if(animating || word == '') return

    const res = tryWord(word)
    if(!res.success) {
      showClearWordAnimation()
      return setGameNotification("default", res.message)
    }

    if(isPangram(word)) return showPangramAnimation()
    else {
      setGameNotification("congrats", generateRandomCongratsMessage())
      showClearWordAnimation()
    }
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if(!$gameData.exists || animating) return
    const { centerLetter } = $gameData.puzzle

    const key = e.key.toUpperCase()

    if(key == centerLetter || outsideLetters.includes(key)) {
      addLetter(key)
    } else if(key == 'BACKSPACE') {
      removeLetter()
    } else if(key == 'ENTER') {
      console.log('ENTER')
      // Don't override functionality of other buttons
      if(document.activeElement != document.body) return
      submitWord()
    }
  }

  const handleKeyPress = (e: KeyboardEvent) => {
    const key = e.key.toUpperCase()
    if(!pressedKeys.includes(key)) pressedKeys = [...pressedKeys, key]
  }

  const handleKeyUp = (e: KeyboardEvent) => {
    const key = e.key.toUpperCase()
    if(pressedKeys.includes(key)) {
      setTimeout(() => {
        if(!isComponentDestroyed) pressedKeys = pressedKeys.filter(k => k != key)
      }, 100)
    }
  }

  const handleResize = () => {
    screenWidth = innerWidth
  }

  // Shuffle letters by moving them in a closed loop
  // Guarantees that no letter will be in the same spot after shuffling
  // i.e. given A, B, C, D, E, F, the shuffle might look like:
  // A -> C -> F -> B -> E -> D -> A
  const shuffleLetters = () => {
    let openIndexes = [0, 1, 2, 3, 4, 5]
    let currIndex = openIndexes[Math.floor(Math.random() * openIndexes.length)]
    let currLetter = outsideLetters[currIndex]
    let startIndex = currIndex
    openIndexes = openIndexes.filter(i => i != startIndex)
    let i = 0
    while(openIndexes.length > 0) {
      let otherIndex = openIndexes[Math.floor(Math.random() * openIndexes.length)]
      openIndexes = openIndexes.filter(i => i != otherIndex)

      let temp = outsideLetters[otherIndex]
      outsideLetters[otherIndex] = currLetter

      currLetter = temp
      currIndex = otherIndex
      i++
    } 

    outsideLetters[startIndex] = currLetter
  }

  // Callback function for getHint, so the screen always updates when the user tries to get a hint
  const setHintWord = (hint: string) => {
    if(animating) return

    word = hint
  }

  onMount(() => {
    screenWidth = innerWidth

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keypress', handleKeyPress)
    document.addEventListener('keyup', handleKeyUp)
    window.addEventListener('resize', handleResize)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('keypress', handleKeyPress)
      document.removeEventListener('keyup', handleKeyUp)
      window.removeEventListener('resize', handleResize)
    }
  })

  afterUpdate(() => {
    const PSEUDO_PADDING = 16
    const wordElem = document.getElementById('word')
    const gameWrapperElem = document.getElementById('game-wrapper')
    if(!wordElem || !gameWrapperElem) return
    const wordScreenWidth = wordElem.clientWidth + (2 * PSEUDO_PADDING)
    const wordsWidthScreenRatio = wordScreenWidth / gameWrapperElem.clientWidth
    if(wordsWidthScreenRatio > 1) {
      wordElem.style.scale = `${1 / wordsWidthScreenRatio}`
    } else {
      wordElem.style.scale = '1'
    }
  })

  onDestroy(() => isComponentDestroyed = true)
</script>

{#if $gameData.loading}
  <div></div>
{:else if !$gameData.exists}
  <div></div>
{:else}
  <div id="wrapper">
    {#key notificationKey}
      {#if notification.message != ""}
        <p 
          id="notification" 
          data-notification-type={notification.type}>
          {notification.message}
        </p>
      {/if}
    {/key}
    <div class="no-overflow">
      <div id="word-wrapper">
        <h2 
          data-is-clearing={wordIsClearing}
          data-is-pangram={wordIsPangram}
          id="word">
          {#each word as char}
            <span
              data-center-letter={char.toUpperCase() == $gameData.puzzle.centerLetter.toUpperCase()}>
              {char}
            </span>
          {/each}
          <div id="cursor" />
        </h2>
      </div>
    </div>
    <div id="main-game">
      <Hexagon 
        width={hexagonSize} 
        fill='var(--primary)' 
        textColor='var(--dark)'
        class="center-letter-hexagon letter-button {wordIsPangram ? 'pangram' : ''}"
        disabled={animating}
        pressed={pressedKeys.includes($gameData.puzzle.centerLetter)}
        clickHandler={() => {
          if(!$gameData.exists) return
          addLetter($gameData.puzzle.centerLetter)
        }}
        letter="{$gameData.puzzle.centerLetter}"
      />
      <Hexagon 
        width={hexagonSize} 
        fill='var(--gray)' 
        class="top-middle-letter letter-button outside {wordIsPangram ? 'pangram' : ''}"
        disabled={animating}
        pressed={pressedKeys.includes(outsideLetters[0])}
        clickHandler={() => addLetter(outsideLetters[0])}
        letter="{outsideLetters[0]}"
      />
      <Hexagon 
        width={hexagonSize} 
        fill='var(--gray)' 
        class="top-right-letter letter-button outside {wordIsPangram ? 'pangram' : ''}"
        disabled={animating}
        pressed={pressedKeys.includes(outsideLetters[1])}
        clickHandler={() => addLetter(outsideLetters[1])}
        letter="{outsideLetters[1]}"
      />
      <Hexagon 
        width={hexagonSize} 
        fill='var(--gray)' 
        class="bottom-right-letter letter-button outside {wordIsPangram ? 'pangram' : ''}"
        disabled={animating}
        pressed={pressedKeys.includes(outsideLetters[2])}
        clickHandler={() => addLetter(outsideLetters[2])}
        letter="{outsideLetters[2]}"
      />
      <Hexagon 
        width={hexagonSize} 
        fill='var(--gray)' 
        class="bottom-middle-letter letter-button outside {wordIsPangram ? 'pangram' : ''}"
        disabled={animating}
        pressed={pressedKeys.includes(outsideLetters[3])}
        clickHandler={() => addLetter(outsideLetters[3])}
        letter="{outsideLetters[3]}"
      />
      <Hexagon 
        width={hexagonSize} 
        fill='var(--gray)' 
        class="bottom-left-letter letter-button outside {wordIsPangram ? 'pangram' : ''}"
        disabled={animating}
        pressed={pressedKeys.includes(outsideLetters[4])}
        clickHandler={() => addLetter(outsideLetters[4])}
        letter="{outsideLetters[4]}"
      />
      <Hexagon 
        width={hexagonSize} 
        fill='var(--gray)' 
        class="top-left-letter letter-button outside {wordIsPangram ? 'pangram' : ''}"
        disabled={animating}
        pressed={pressedKeys.includes(outsideLetters[5])}
        clickHandler={() => addLetter(outsideLetters[5])}
        letter="{outsideLetters[5]}"
      />
    </div>
    <div id="game-controls">
      <button 
        disabled={word=='' || animating}
        on:click={submitWord}
        id="enter"
        class="btn primary">
        Enter
      </button>
      <div id="game-sub-controls">
        <button
          disabled={word=='' || animating}
          on:click={removeLetter}
          class="btn gray"
          title="Delete letter"
          aria-label="Delete letter">
          <MaterialSymbolsUndoRounded />
          Delete
        </button>
        <button
          on:click={() => getHint(setHintWord)}
          class="btn secondary"
          title="Hint"
          aria-label="Hint">
          <PhLightbulb />
          Hint
        </button>
        <button
          on:click={shuffleLetters}
          class="btn gray"
          title="Shuffle letters"
          aria-label="Shuffle letters">
          <PhShuffle />
          Shuffle
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
  #wrapper {
    position: relative;
    padding-bottom: 1rem;
  }

  #main-game {
    position: relative;
    height: 240px;
    margin: auto;

    @media screen and (width > 768px) {
      height: 275px;
    }
  }

  :global(.outside.pangram polygon) {
    animation: outsideLetterPangram forwards;
  }

  @keyframes outsideLetterPangram {
    10%, 90% {
      fill: var(--accent);
    }
    100% {
      fill: var(--gray);
    }
  }

  :global(.center-letter-hexagon.pangram polygon) {
    animation: centerLetterPangram forwards;
  }

  @keyframes centerLetterPangram {
    10%, 90% {
      fill: var(--accent);
    }
    100% {
      fill: var(--primary);
    }
  }

  :global(.outside.pangram text) {
    animation: outsideLetterTextPangram forwards;
  }

  @keyframes outsideLetterTextPangram {
    10%, 90% {
      fill: var(--light);
    }
    100% {
      fill: var(--heading);
    }
  }

  :global(.center-letter-hexagon.pangram text) {
    animation: centerLetterTextPangram forwards;
  }

  @keyframes centerLetterTextPangram {
    10%, 90% {
      fill: var(--light);
    }
    100% {
      fill: var(--dark);
    }
  }

  #word-wrapper {
    position: relative;
    width: fit-content;
    /* Forces the word wrapper to be in the center of the wrapper */
    /* Without this, #word overflows to the right of the screen, and scaling
       it to fit the word on-screen will not work properly */
    left: 50%;
    transform: translate(-50%);
  }

  #word {
    text-transform: uppercase;
    font: var(--h-4xl);
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 1rem 0;
    height: 2.25rem;
    transform-origin: center;

    @media screen and (width > 768px) {
      font: var(--h-5xl);
      height: 2.75rem;
    }
  }

  #word span {
    display: inline-block;
  }

  #word span[data-center-letter="true"] {
    color: var(--primary);
  }

  #word[data-is-pangram="true"] span {
    animation: pangram cubic-bezier(0.455, 0.03, 0.515, 0.955) forwards;
  }

  @keyframes pangram {
    20%, 80% {
      color: var(--accent);
      opacity: 1;
    } 100% {
      color: var(--accent);
      opacity: 0;
    }
  }

  #word[data-is-clearing="true"] span {
    animation: clearLetter var(--transition-2) forwards;
  }

  @keyframes clearLetter {
    to {
      opacity: 0;
    }
  }

  #cursor {
    background-color: var(--primary);
    width: 0.125rem;
    height: 2.75rem;
    margin: 0 0.25rem;
    position: absolute;
    left: 100%;
    top: 50%;
    transform: translateY(-50%);
    animation: blink 1.25s infinite;
  }

  #word[data-is-pangram="true"] #cursor,
  #word[data-is-clearing="true"] #cursor {
    animation: none;
    opacity: 0 !important;
  }

  @keyframes blink {
    0%, 49.99% {
      opacity: 1;
    }
    50%, 100% {
      opacity: 0;
    }
  }

  #game-controls {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    width: fit-content;
    margin: 1rem auto 0 auto;
  }

  #enter {
    width: 100%;
  }

  #game-sub-controls {
    display: flex;
    gap: 0.5rem;
  }

  #notification {
    position: absolute;
    top: -1.75rem;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
    width: fit-content;
    background-color: var(--gray);
    color: var(--heading);
    padding: 0.125rem 0.375rem;
    border-radius: 0.25rem;
    animation: appear 3s var(--timing-function) forwards;
  }

  :global(body[data-theme="dark"]) #notification[data-notification-type="congrats"] {
    background-color: var(--primary-light);
    color: var(--primary);
  }

  :global(body[data-theme="light"]) #notification[data-notification-type="congrats"] {
    background-color: var(--primary-light);
    color: var(--dark);
  }

  #notification[data-notification-type="pangram"] {
    background-color: var(--accent);
    color: var(--light);
  }

  @keyframes appear {
    from {
      transform: translate(-50%, 0%);
      opacity: 0;
      visibility: hidden;
    } 20%, 80% {
      transform: translate(-50%, -50%);
      opacity: 1;
      visibility: visible;
    } to {
      transform: translate(-50%, -100%);
      opacity: 0;
      visibility: hidden;
    }
  }

  @keyframes rotate {
    to {
      transform: rotate(360deg);
    }
  }
</style>