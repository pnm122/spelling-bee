<script lang="ts">
	import type Puzzle from "$backend_interfaces/Puzzle";
	import { onDestroy, onMount } from "svelte";
  import Hexagon from "./Hexagon.svelte";
  import MaterialSymbolsUndoRounded from '~icons/material-symbols/undo-rounded'
  import PhLightbulb from '~icons/ph/lightbulb'
  import PhShuffle from '~icons/ph/shuffle'
  import { isPangram } from '$lib/utils/points'

  export let pointsFromLastWord: number
  export let wordsFound: string[]
  export let puzzle: Puzzle

  let outsideLetters = puzzle.outsideLetters
  let word = ""
  let pressedKeys: string[] = []
  let isComponentDestroyed = false
  let hintWord = ""
  let notification = ""
  let notificationKey = 0
  let wordIsPangram = false
  
  const setNotification = (n: string) => {
    notification = n
    notificationKey++
  }

  const addLetter = (letter: string) => {
    word = word + letter.toUpperCase()
  }

  const removeLetter = () => {
    if(word.length > 0) word = word.slice(0, -1)
  }

  const showPangramAnimation = () => {
    const DELAY_MS = 100
    const ANIMATION_LENGTH = 3500
    let index = 0
    for(let elem of document.getElementById('word')!.getElementsByTagName('span')) {
      elem.style.animationDelay = `${DELAY_MS * index}ms`
      index++
    }

    setTimeout(() => {
      if(isComponentDestroyed) return
      const star = document.getElementById('pangram-star')!
        star.style.opacity = '0'
        star.style.visibility = 'hidden'
      setTimeout(() => {
        if(isComponentDestroyed) return
        word = ''
        wordIsPangram = false
      }, 1000)
    }, (DELAY_MS * index) + ANIMATION_LENGTH)

    wordIsPangram = true
  }

  const submitWord = () => {
    const validWord = puzzle.wordList.includes(word)
    const alreadyFoundWord = wordsFound.includes(word)
    if(validWord) {
      if(!alreadyFoundWord) {
        wordsFound = [...wordsFound, word]
        if(word == hintWord) hintWord = ''
        if(isPangram(word)) return showPangramAnimation()
      }
      else setNotification("You've already found this word.")
    } else {
      if(word.length < 4) setNotification('Must be at least 4 letters long.')
      else if(!word.includes(puzzle.centerLetter)) setNotification("Must contain center letter.")
      else setNotification("We don't have that word in our dictionary.")
    }

    word = ""
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if(wordIsPangram) return

    const key = e.key.toUpperCase()

    if(key == puzzle.centerLetter || outsideLetters.includes(key)) {
      addLetter(key)
    } else if(key == 'BACKSPACE') {
      removeLetter()
    } else if(key == 'ENTER') {
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

  // Pick an unfound word as the user's hint
  // Hint is first 3 letters of the word
  // If they've already asked for a hint and not found that word, just give them the same hint again
  const getHint = () => {
    (document.activeElement as HTMLElement).blur()

    if(hintWord != '') word = hintWord.slice(0, 3)
    else {
      let availableIndexes: number[] = []
      puzzle.wordList.forEach((w, index) => {
        if(!wordsFound.includes(w)) availableIndexes.push(index)
      })

      const hintIndex = availableIndexes[Math.floor(Math.random() * availableIndexes.length)]
      hintWord = puzzle.wordList[availableIndexes[hintIndex]]

      word = hintWord.slice(0, 3)
    }
  }

  onMount(() => {
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keypress', handleKeyPress)
    document.addEventListener('keyup', handleKeyUp)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('keypress', handleKeyPress)
      document.removeEventListener('keyup', handleKeyUp)
    }
  })

  onDestroy(() => isComponentDestroyed = true)
</script>

<div id="wrapper">
  {#key notificationKey}
    {#if notification != ""}
      <p id="notification">{notification}</p>
    {/if}
  {/key}
  <div id="word-wrapper">
    <h2 
      data-is-pangram={wordIsPangram}
      id="word">
      {#each word as char}
        <span
          data-center-letter={char.toUpperCase() == puzzle.centerLetter.toUpperCase()}>
          {char}
        </span>
      {/each}
      <div id="cursor" />
    </h2>
    <div id="pangram-star">
      <svg width="118" height="116" viewBox="0 0 118 116" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M73.7884 1.14091L69.9369 36.2869L96.8063 13.3062L78.087 43.3006L112.266 34.2539L82.3868 53.1559L117.107 59.835L81.9847 63.9008L110.368 84.9828L76.9605 73.4072L93.386 104.717L68.3091 79.7922L69.5233 115.128L57.7441 81.7912L43.5066 114.154L47.358 79.0082L20.4887 101.989L39.208 71.9946L5.02859 81.0413L34.9082 62.1393L0.188394 55.4602L35.3102 51.3944L6.92673 30.3124L40.3345 41.888L23.909 10.5786L48.9859 35.503L47.7717 0.167435L59.5509 33.504L73.7884 1.14091Z" fill="url(#paint0_radial_260_62)"/>
        <defs>
        <radialGradient id="paint0_radial_260_62" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(58.6475 57.6476) rotate(105) scale(50)">
        <stop stop-color="var(--accent-light)"/>
        <stop offset="1" stop-color="var(--bg)"/>
        </radialGradient>
        </defs>
      </svg>
      <span>Pangram!</span>
    </div>
  </div>
  <div id="main-game">
    <Hexagon 
      width={100} 
      fill='var(--primary)' 
      textColor='var(--dark)'
      class="letter-button"
      id="center"
      pressed={pressedKeys.includes(puzzle.centerLetter)}
      clickHandler={() => addLetter(puzzle.centerLetter)}
      letter="{puzzle.centerLetter}"
    />
    <Hexagon 
      width={100} 
      fill='var(--gray)' 
      class="letter-button"
      id="top-middle"
      pressed={pressedKeys.includes(outsideLetters[0])}
      clickHandler={() => addLetter(outsideLetters[0])}
      letter="{outsideLetters[0]}"
    />
    <Hexagon 
      width={100} 
      fill='var(--gray)' 
      class="letter-button"
      id="top-left"
      pressed={pressedKeys.includes(outsideLetters[1])}
      clickHandler={() => addLetter(outsideLetters[1])}
      letter="{outsideLetters[1]}"
    />
    <Hexagon 
      width={100} 
      fill='var(--gray)' 
      class="letter-button"
      id="top-right"
      pressed={pressedKeys.includes(outsideLetters[2])}
      clickHandler={() => addLetter(outsideLetters[2])}
      letter="{outsideLetters[2]}"
    />
    <Hexagon 
      width={100} 
      fill='var(--gray)' 
      class="letter-button"
      id="bottom-middle"
      pressed={pressedKeys.includes(outsideLetters[3])}
      clickHandler={() => addLetter(outsideLetters[3])}
      letter="{outsideLetters[3]}"
    />
    <Hexagon 
      width={100} 
      fill='var(--gray)' 
      class="letter-button"
      id="bottom-left"
      pressed={pressedKeys.includes(outsideLetters[4])}
      clickHandler={() => addLetter(outsideLetters[4])}
      letter="{outsideLetters[4]}"
    />
    <Hexagon 
      width={100} 
      fill='var(--gray)' 
      class="letter-button"
      id="bottom-right"
      pressed={pressedKeys.includes(outsideLetters[5])}
      clickHandler={() => addLetter(outsideLetters[5])}
      letter="{outsideLetters[5]}"
    />
  </div>
  <div id="game-controls">
    <button 
      disabled={word=='' || wordIsPangram}
      on:click={submitWord}
      id="enter"
      class="btn primary">
      Enter
    </button>
    <div id="game-sub-controls">
      <button
        disabled={word=='' || wordIsPangram}
        on:click={removeLetter}
        class="btn gray"
        title="Delete letter"
        aria-label="Delete letter">
        <MaterialSymbolsUndoRounded />
        Delete
      </button>
      <button
        on:click={getHint || wordIsPangram}
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

<style>
  #wrapper {
    position: relative;
  }

  #main-game {
    position: relative;
    width: 250px;
    height: 275px;
    margin: auto;
  }

  :global(.letter-button) {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }

  :global(#top-middle) {
    transform: translate(-50%, -150%);
  }

  :global(#bottom-middle) {
    transform: translate(-50%, 50%);
  }

  :global(#top-left) {
    transform: translate(-125%, -100%);
  }

  :global(#bottom-left) {
    transform: translate(-125%, 0%);
  }

  :global(#top-right) {
    transform: translate(25%, -100%);
  }

  :global(#bottom-right) {
    transform: translate(25%, 0%);
  }

  #word-wrapper {
    position: relative;
    width: fit-content;
    margin: auto;
  }

  #word {
    text-transform: uppercase;
    font: var(--h-5xl);
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 1rem 0;
    height: 2.75rem;
  }

  #word span {
    display: inline-block;
  }

  #word span[data-center-letter="true"] {
    color: var(--primary);
  }

  #word[data-is-pangram="true"] span {
    animation: pangram 3.5s cubic-bezier(0.455, 0.03, 0.515, 0.955) forwards;
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

  #cursor {
    background-color: var(--primary);
    width: 0.125rem;
    height: 2.75rem;
    margin: 0 0.25rem;
    animation: blink 1.25s infinite;
  }

  #word[data-is-pangram="true"] #cursor {
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
    animation: appear 4s var(--timing-function) forwards;
  }

  @keyframes appear {
    from {
      transform: translate(-50%, 50%);
      opacity: 0;
      visibility: hidden;
    } 25%, 75% {
      transform: translate(-50%, -50%);
      opacity: 1;
      visibility: visible;
    } to {
      transform: translate(-50%, -150%);
      opacity: 0;
      visibility: hidden;
    }
  }

  #word[data-is-pangram="true"] + #pangram-star {
    opacity: 1;
    visibility: visible;
  }

  #pangram-star {
    visibility: hidden;
    opacity: 0;
    position: absolute;
    top: -1rem;
    left: 100%;
    transform: translate(-50%, -50%) rotate(15deg);
    z-index: -1;
    transition: opacity var(--transition-1),
                visibility var(--transition-1);
  }

  #pangram-star span {
    background-color: var(--accent);
    color: var(--light);
    width: fit-content;
    padding: 0.125rem 0.5rem;
    border-radius: 0.25rem;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  #pangram-star svg {
    animation: rotate 12s linear infinite;
  }

  @keyframes rotate {
    to {
      transform: rotate(360deg);
    }
  }
</style>