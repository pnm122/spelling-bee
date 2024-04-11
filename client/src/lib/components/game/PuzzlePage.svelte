<script lang="ts">
  import gameData from "$lib/stores/gameData"
  import Skeleton from "$lib/components/shared/Skeleton.svelte"
  import convertDate from "$lib/utils/convertDate"
  import { onMount } from 'svelte'
  import { loadDailyPuzzle } from "$lib/stores/currentPuzzle"
	import PuzzlePoints from "$lib/components/game/PuzzlePoints.svelte";
  import PhListChecks from '~icons/ph/list-checks'
  import PhTrophy from '~icons/ph/trophy'
	import gameDrawerStates, { toggleLeaderboardDrawer, toggleWordListDrawer } from "$lib/stores/gameDrawerStates";
	import GameDrawer from "$lib/components/game/GameDrawer.svelte";
	import WordList from "$lib/components/game/WordList.svelte";
	import ExpandableRecentWords from "$lib/components/game/ExpandableRecentWords.svelte";
	import PuzzleComplete from "$lib/components/game/PuzzleComplete.svelte";
	import MainGame from "$lib/components/game/MainGame.svelte";

  

  // onMount(() => {
  //   loadDailyPuzzle()
  // })

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
  <div id="puzzle-header">
      <div id="puzzle-header-inner">
        {#if $gameData.loading}
          <div id="puzzle-title" style="margin: auto;">
            <Skeleton --width="10rem" --height="1.5rem" />
            <Skeleton --width="9rem" --height="1rem" />
          </div>
        {:else if !$gameData.exists}
          <span class="error">Error getting today's puzzle</span>
        {:else}
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
        {/if}
      </div>
  </div>
  <div id="game-wrapper">
    <ExpandableRecentWords />
    <PuzzlePoints />
    {#if $gameData.loading}
      <Skeleton />
    {:else if !$gameData.exists}
      <div></div>
    {:else}
      <PuzzleComplete />
      <MainGame />
    {/if}
  </div>

  <GameDrawer side="right" open={$gameDrawerStates.leaderboard}>
    <h1>Test</h1>
  </GameDrawer>
</div>

<style>
  :global(body) {
    --game-max-width: 600px;
    --game-header-height: 4rem;

    @media screen and (width > 768px) {
      --game-header-height: 5rem;
    }
  }

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
</style>