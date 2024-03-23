<script lang="ts">
	import type Puzzle from "$backend_interfaces/Puzzle";
	import { onDestroy, onMount } from "svelte";
  import Hexagon from "./Hexagon.svelte";
  import MaterialSymbolsUndoRounded from '~icons/material-symbols/undo-rounded'
  import PhLightbulb from '~icons/ph/lightbulb'
  import PhShuffle from '~icons/ph/shuffle'

  export let pointsFromLastWord: number
  export let wordsFound: string[]
  export let puzzle: Puzzle

  let outsideLetters = puzzle.outsideLetters
  let word = ""
  let pressedKeys: string[] = []
  let isComponentDestroyed = false
  let hintWord = ""

  const addLetter = (letter: string) => {
    word = word + letter.toUpperCase()
  }

  const removeLetter = () => {
    if(word.length > 0) word = word.slice(0, -1)
  }

  const submitWord = () => {
    const validWord = puzzle.wordList.includes(word)
    const alreadyFoundWord = wordsFound.includes(word)
    if(validWord) {
      if(!alreadyFoundWord) {
        wordsFound = [...wordsFound, word]
        if(word == hintWord) hintWord = ''
      }
      else console.log("You've already found this word.")
    } else {
      if(word.length < 4) console.log('Must be at least 4 letters long.')
      else if(!word.includes(puzzle.centerLetter)) console.log("Must contain center letter.")
      else console.log("We don't have that word in our dictionary.")
    }

    word = ""
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    const key = e.key.toUpperCase()

    if(key == puzzle.centerLetter || outsideLetters.includes(key)) {
      addLetter(key)
    } else if(key == 'BACKSPACE') {
      removeLetter()
    } else if(key == 'ENTER') {
      console.log(document.activeElement)
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
  <div id="word-wrapper">
    <h2 id="word">
      {#each word as char}
        <span
          data-center-letter={char.toUpperCase() == puzzle.centerLetter.toUpperCase()}>
          {char}
        </span>
      {/each}
      <div id="cursor" />
    </h2>
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
      disabled={word==''}
      on:click={submitWord}
      id="enter"
      class="btn primary">
      Enter
    </button>
    <div id="game-sub-controls">
      <button
        disabled={word==''}
        on:click={removeLetter}
        class="btn gray"
        title="Delete letter"
        aria-label="Delete letter">
        <MaterialSymbolsUndoRounded />
        Delete
      </button>
      <button
        on:click={getHint}
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

  #cursor {
    background-color: var(--primary);
    width: 0.125rem;
    height: 2.75rem;
    margin: 0 0.25rem;
    animation: blink 1.25s infinite;
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
</style>