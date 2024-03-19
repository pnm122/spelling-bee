<script lang="ts">
	import type Puzzle from "$backend_interfaces/Puzzle";
	import { onMount } from "svelte";
  import Hexagon from "./Hexagon.svelte";

  export let pointsFromLastWord: number
  export let wordsFound: string[]
  export let puzzle: Puzzle

  let outsideLetters = puzzle.outsideLetters
  let word = ""

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
      if(!alreadyFoundWord) wordsFound = [...wordsFound, word]
      else console.log("You've already found this word.")
    } else {
      if(word.length < 4) console.log('Must be at least 4 letters long.')
      else if(!word.includes(puzzle.centerLetter)) console.log("Must contain center letter.")
      else console.log("We don't have that word in our dictionary.")
    }

    word = ""
  }

  const addLetterFromKey = (e: KeyboardEvent) => {
    const key = e.key.toUpperCase()

    if(key == puzzle.centerLetter || outsideLetters.includes(key)) {
      addLetter(key)
    } else if(key == 'BACKSPACE') {
      removeLetter()
    } else if(key == 'ENTER') {
      submitWord()
    }
  }

  onMount(() => {
    document.addEventListener('keydown', addLetterFromKey)

    return () => {
      document.removeEventListener('keydown', addLetterFromKey)
    }
  })
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
      clickHandler={() => addLetter(puzzle.centerLetter)}
      letter="{puzzle.centerLetter}"
    />
    <Hexagon 
      width={100} 
      fill='var(--gray)' 
      class="letter-button"
      id="top-middle"
      clickHandler={() => addLetter(outsideLetters[0])}
      letter="{outsideLetters[0]}"
    />
    <Hexagon 
      width={100} 
      fill='var(--gray)' 
      class="letter-button"
      id="top-left"
      clickHandler={() => addLetter(outsideLetters[1])}
      letter="{outsideLetters[1]}"
    />
    <Hexagon 
      width={100} 
      fill='var(--gray)' 
      class="letter-button"
      id="top-right"
      clickHandler={() => addLetter(outsideLetters[2])}
      letter="{outsideLetters[2]}"
    />
    <Hexagon 
      width={100} 
      fill='var(--gray)' 
      class="letter-button"
      id="bottom-middle"
      clickHandler={() => addLetter(outsideLetters[3])}
      letter="{outsideLetters[3]}"
    />
    <Hexagon 
      width={100} 
      fill='var(--gray)' 
      class="letter-button"
      id="bottom-left"
      clickHandler={() => addLetter(outsideLetters[4])}
      letter="{outsideLetters[4]}"
    />
    <Hexagon 
      width={100} 
      fill='var(--gray)' 
      class="letter-button"
      id="bottom-right"
      clickHandler={() => addLetter(outsideLetters[5])}
      letter="{outsideLetters[5]}"
    />
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
    margin: 1.5rem 0;
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
</style>