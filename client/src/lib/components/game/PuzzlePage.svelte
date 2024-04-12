<script lang="ts">
  import gameData from "$lib/stores/gameData"
  import Skeleton from "$lib/components/shared/Skeleton.svelte"
  import convertDate from "$lib/utils/convertDate"
	import PuzzlePoints from "$lib/components/game/PuzzlePoints.svelte";
  import PhListChecks from '~icons/ph/list-checks'
  import PhTrophy from '~icons/ph/trophy'
	import gameDrawerStates, { toggleLeaderboardDrawer, toggleWordListDrawer } from "$lib/stores/gameDrawerStates";
	import GameDrawer from "$lib/components/game/GameDrawer.svelte";
	import WordList from "$lib/components/game/WordList.svelte";
	import ExpandableRecentWords from "$lib/components/game/ExpandableRecentWords.svelte";
	import PuzzleComplete from "$lib/components/game/PuzzleComplete.svelte";
	import MainGame from "$lib/components/game/MainGame.svelte";
	import Hexagon from "../shared/Hexagon.svelte";

  let hexagonSize = 80
</script>

<div id="main">
  <div id="word-list-drawer">
    <GameDrawer side="left" open={$gameDrawerStates.wordList}>
      <h2 class="drawer-title">Your words</h2>
      <WordList />
    </GameDrawer>
  </div>
  <!-- <GameDrawer side="right" open={$gameDrawerStates.wordList}>
    <h1>Test</h1>
  </GameDrawer> -->
  {#if $gameData.loading}
    <div id="puzzle-header">
      <div id="puzzle-header-inner">
        <div id="puzzle-title" style="margin: auto;">
          <Skeleton --width="10rem" --height="1.5rem" />
          <Skeleton --width="9rem" --height="1rem" />
        </div>
      </div>
    </div>
  {:else if !$gameData.exists}
    <div id="error-wrapper">
      <div id="silhouette">
        <Hexagon 
          width={hexagonSize} 
          fill='var(--primary)' 
          class="letter-button center-letter-hexagon"
        />
        <Hexagon 
          width={hexagonSize} 
          fill='var(--gray)' 
          class="letter-button top-middle-letter"
        />
        <Hexagon 
          width={hexagonSize} 
          fill='var(--gray)' 
          class="letter-button top-right-letter"
        />
        <Hexagon 
          width={hexagonSize} 
          fill='var(--gray)' 
          class="letter-button bottom-right-letter"
        />
        <Hexagon 
          width={hexagonSize} 
          fill='var(--gray)' 
          class="letter-button bottom-middle-letter"
        />
        <Hexagon 
          width={hexagonSize} 
          fill='var(--gray)' 
          class="letter-button bottom-left-letter"
        />
        <Hexagon 
          width={hexagonSize} 
          fill='var(--gray)'
          class="letter-button top-left-letter"
        />
      </div>
      {#if $gameData.errors.puzzle == 'no-session'}
        <h1 id="error-title">Please log in to view this puzzle.</h1>
        <a 
          class="btn primary"
          href="/login">
          Login
        </a>
      {:else if $gameData.errors.puzzle == 'invalid-session'}
        <h1 id="error-title">Your session has expired.</h1>
        <a 
          class="btn primary"
          href="/login">
          Login
        </a>
      {:else if $gameData.errors.puzzle == 'no-puzzle'}
        <h1 id="error-title">Whoops! We can't find this puzzle.</h1>
        <a 
          class="btn primary"
          href="/puzzles">
          All Puzzles
        </a>
      {:else}
        <h1 id="error-title">Sorry, something went wrong on our end. Please try again later.</h1>
        <p class="error">Error codes: {$gameData.errors.puzzle} and {$gameData.errors.score}</p>
        <a 
          class="btn primary"
          href="/puzzles">
          All Puzzles
        </a>
      {/if}
    </div>
  {:else}
    <div id="puzzle-header">
      <div id="puzzle-header-inner">
        <button 
          on:click={toggleWordListDrawer}
          title="Toggle word list"
          aria-label="Toggle word list"
          aria-pressed={$gameDrawerStates.wordList}
          id="word-list-toggle"
          class="icon-button drawer-toggle">
          <PhListChecks />
        </button>
        <div id="puzzle-title">
          <h1>Today's Puzzle</h1>
          <h2>{convertDate($gameData.puzzle.date)}</h2>
        </div>
        <button 
          on:click={toggleLeaderboardDrawer}
          title="Toggle puzzle leaderboard"
          aria-label="Toggle puzzle leaderboard"
          aria-pressed={$gameDrawerStates.leaderboard}
          id="leaderboard-toggle"
          class="icon-button drawer-toggle">
          <PhTrophy />
        </button>
      </div>
    </div>
    <div id="game-wrapper">
      <ExpandableRecentWords />
      <PuzzlePoints />
      <PuzzleComplete />
      <MainGame />
    </div>
  {/if}

  <GameDrawer side="right" open={$gameDrawerStates.leaderboard}>
    <h1>Test</h1>
  </GameDrawer>
</div>

<style>
  #main {
    position: relative;
    min-height: calc(100vh - var(--header-height));
    display: grid;
    grid-template-rows: var(--game-header-height) 1fr;
    grid-template-columns: minmax(0, 1fr);
    grid-template-areas:
      "header"
      "game";
    @media screen and (width > 1140px) {
      overflow: hidden;
      grid-template-columns: 1fr var(--game-max-width) 1fr;
      grid-template-areas: 
        "header header header"
        "left   game   right ";
    }
  }

  #puzzle-header {
    grid-area: header;
    border-bottom: 1px solid var(--gray);
    display: flex;
    align-items: center;
    height: var(--game-header-height);
  }

  #puzzle-header h1 {
    font: var(--h-xl);

    @media screen and (width > 768px) {
      font: var(--h-2xl);
    }
  }

  #puzzle-header h2 {
    font: var(--h);
    color: var(--darkgray);
  }

  #puzzle-header-inner {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    padding: 0 0.5rem;
    margin: auto;
    position: relative;

    @media screen and (width > 1140px) {
      max-width: var(--game-max-width);
    }
  }

  #puzzle-title {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;

    @media screen and (width > 768px) {
      gap: 0.5rem;
    }
  }

  #game-wrapper {
    grid-area: game;

    @media screen and (width > 1140px) {
      overflow: auto;
      max-width: var(--game-max-width);
    }
  }

  .drawer-toggle {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    color: var(--darkgray);
  }

  .drawer-toggle:hover {
    color: var(--heading);
  }

  :global(body[data-theme="dark"]) .drawer-toggle[aria-pressed="true"] {
    color: var(--primary);
    background-color: var(--primary-light);
  }

  :global(body[data-theme="light"]) .drawer-toggle[aria-pressed="true"] {
    color: var(--heading);
    background-color: var(--primary-light);
  }

  .drawer-title {
    min-height: var(--game-header-height);
    padding: 0 1.5rem;
    display: flex;
    align-items: center;
    border-bottom: 1px solid var(--gray);
    font: var(--h-xl);
  }

  #word-list-drawer {
    display: none;

    @media screen and (width > 1140px) {
      display: contents;
    }
  }

  #word-list-toggle {
    display: none;
    left: 1rem;

    @media screen and (width > 1140px) {
      display: flex;
    }
  }

  #leaderboard-toggle {
    right: 1rem;
  }

  #error-wrapper {
    grid-row-start: header;
    grid-row-end: game;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 1rem;
    gap: 1rem;
  }

  #error-title {
    font: var(--h-2xl);
    max-width: 600px;

    @media screen and (width > 768px) {
      font: var(--h-3xl);
    }
  }

  #silhouette {
    --hexagon-size: 80px;
    --animation-length: 5s;
    --animation-delay: calc(var(--animation-length) / 6);
    position: relative;
    height: calc(var(--hexagon-size) * 0.875 * 3);

    @media screen and (width > 768px) {
      --hexagon-size: 100px;
    }
  }

  #silhouette :global(.letter-button) {
    width: var(--hexagon-size);
  }

  #silhouette :global(.letter-button:not(.center-letter-hexagon) polygon) {
    animation: n var(--animation-length) linear infinite;
  }

  @keyframes n {
    50% {
      fill: var(--mediumgray);
    }
  }

  #silhouette :global(.letter-button:nth-of-type(3) polygon) {
    animation-delay: var(--animation-delay);
  }

  #silhouette :global(.letter-button:nth-of-type(4) polygon) {
    animation-delay: calc(var(--animation-delay) * 2);
  }

  #silhouette :global(.letter-button:nth-of-type(5) polygon) {
    animation-delay: calc(var(--animation-delay) * 3);
  }

  #silhouette :global(.letter-button:nth-of-type(6) polygon) {
    animation-delay: calc(var(--animation-delay) * 4);
  }

  #silhouette :global(.letter-button:nth-of-type(7) polygon) {
    animation-delay: calc(var(--animation-delay) * 5);
  }
</style>