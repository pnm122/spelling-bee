<script lang="ts">
  import gameData from "$lib/stores/gameData"
  import PhArrowRight from '~icons/ph/arrow-right'
  import Hexagon from '$lib/components/shared/Hexagon.svelte'
  import PuzzlePoints from '$lib/components/game/PuzzlePoints.svelte'

  $: isGameComplete = $gameData.exists && $gameData.puzzle.wordList.length == $gameData.score.wordsFound.length
</script>

<div 
  id="wrapper"
  data-game-complete={isGameComplete}>
  <div id="puzzle-complete">
    {#if $gameData.exists}
      <PuzzlePoints />
      <div id="puzzle-letters">
        <Hexagon
          width={60}
          textColor='var(--primary)'
          fill='var(--dark)'
          letter={$gameData.puzzle.centerLetter}
          class='letter-button center-letter-hexagon'
        />
        <Hexagon
          width={60}
          textColor='var(--primary)'
          fill='var(--dark)'
          letter={$gameData.puzzle.outsideLetters[0]}
          class='letter-button top-middle-letter'
        />
        <Hexagon
          width={60}
          textColor='var(--primary)'
          fill='var(--dark)'
          letter={$gameData.puzzle.outsideLetters[1]}
          class='letter-button top-right-letter'
        />
        <Hexagon
          width={60}
          textColor='var(--primary)'
          fill='var(--dark)'
          letter={$gameData.puzzle.outsideLetters[2]}
          class='letter-button bottom-right-letter'
        />
        <Hexagon
          width={60}
          textColor='var(--primary)'
          fill='var(--dark)'
          letter={$gameData.puzzle.outsideLetters[3]}
          class='letter-button bottom-middle-letter'
        />
        <Hexagon
          width={60}
          textColor='var(--primary)'
          fill='var(--dark)'
          letter={$gameData.puzzle.outsideLetters[4]}
          class='letter-button bottom-left-letter'
        />
        <Hexagon
          width={60}
          textColor='var(--primary)'
          fill='var(--dark)'
          letter={$gameData.puzzle.outsideLetters[5]}
          class='letter-button top-left-letter'
        />
      </div>
    {/if}
    <h2 id="title">Well done!</h2>
    <p id="subtitle">You found all the words in the puzzle.</p>
    <a 
      id="btn"
      class="btn primary"
      href="/puzzles">
      More puzzles
      <PhArrowRight />
    </a>
  </div>
</div>

<style>
  #wrapper {
    position: absolute;
    inset: 0;
    top: var(--game-header-height);
    z-index: var(--z-puzzle-complete);
    overflow: hidden;
    visibility: hidden;
    transition: var(--transition-2);
  }

  #wrapper[data-game-complete="true"] {
    visibility: visible;
  }

  #puzzle-complete {
    background-color: var(--primary);
    color: var(--dark);
    padding: 1rem 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    gap: 1rem;
    position: absolute;
    inset: 0;
    transform: translateY(-100%);
    transition: var(--transition-2);
  }

  #wrapper[data-game-complete="true"] #puzzle-complete {
    transform: none;
  }

  #puzzle-letters {
    position: relative;
    /* 3 hexagon heights */
    height: calc(52.58px * 3);
    width: 100%;
  }

  #title {
    color: var(--dark);
    font: var(--h-5xl);
  }

  #btn {
    --btn-color: var(--dark);
    --btn-shadow-color: color-mix(in oklch, var(--dark) 50%, var(--primary));
    color: var(--primary);
  }
</style>