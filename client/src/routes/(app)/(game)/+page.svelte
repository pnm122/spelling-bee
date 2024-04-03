<script lang="ts">
  import currentPuzzle from "$lib/stores/currentPuzzle"
  import Skeleton from "$lib/components/Skeleton.svelte"
  import convertDate from "$lib/utils/convertDate"
  import Game from "$lib/components/Game.svelte"
  import { onMount } from 'svelte'
  import { loadDailyPuzzle } from "$lib/stores/currentPuzzle"
	import PuzzlePoints from "$lib/components/PuzzlePoints.svelte";
  import PhListChecks from '~icons/ph/list-checks'
  import PhTrophy from '~icons/ph/trophy'
	import gameDrawerStates, { toggleLeaderboardDrawer, toggleWordListDrawer } from "$lib/stores/gameDrawerStates";
	import GameDrawer from "$lib/components/GameDrawer.svelte";
	import WordList from "$lib/components/WordList.svelte";

  onMount(() => {
    loadDailyPuzzle()
  })

</script>

<div id="main">
  <GameDrawer side="left" open={$gameDrawerStates.wordList}>
    <h2 class="drawer-title">Your words</h2>
    <WordList />
  </GameDrawer>
  <!-- <GameDrawer side="right" open={$gameDrawerStates.wordList}>
    <h1>Test</h1>
  </GameDrawer> -->
  <div id="puzzle-header">
      <div id="puzzle-header-inner">
        {#if $currentPuzzle.loading}
          <div id="puzzle-title" style="margin: auto;">
            <Skeleton --width="10rem" --height="1.5rem" />
            <Skeleton --width="9rem" --height="1rem" />
          </div>
        {:else if !$currentPuzzle.data}
          <span class="error">Error getting today's puzzle</span>
        {:else}
          <button 
            on:click={toggleWordListDrawer}
            title="Toggle word list"
            aria-label="Toggle word list"
            aria-pressed={$gameDrawerStates.wordList}
            class="icon-button drawer-toggle">
            <PhListChecks />
          </button>
          <div id="puzzle-title">
            <h1>Today's Puzzle</h1>
            <h2>{convertDate($currentPuzzle.data.date)}</h2>
          </div>
          <button 
            on:click={toggleLeaderboardDrawer}
            title="Toggle puzzle leaderboard"
            aria-label="Toggle puzzle leaderboard"
            aria-pressed={$gameDrawerStates.leaderboard}
            class="icon-button drawer-toggle">
            <PhTrophy />
          </button>
        {/if}
      </div>
  </div>
  <div id="game-wrapper">
    <PuzzlePoints />
    {#if $currentPuzzle.loading}
      <Skeleton />
    {:else if !$currentPuzzle.data}
      <div></div>
    {:else}
      <Game />
    {/if}
  </div>

  <GameDrawer side="right" open={$gameDrawerStates.leaderboard}>
    <h1>Test</h1>
  </GameDrawer>
</div>

<style>
  :global(body) {
    --game-max-width: 600px;
  }

  #main {
    --game-header-height: 5rem;
    min-height: calc(100vh - var(--header-height));
    overflow: hidden;

    @media screen and (width > 1024px) {
      display: grid;
      grid-template-columns: 1fr var(--game-max-width) 1fr;
      grid-template-rows: var(--game-header-height) 1fr;
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
    font: var(--h-2xl);
  }

  #puzzle-header h2 {
    font: var(--h);
    color: var(--darkgray);
  }

  #puzzle-header-inner {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: var(--game-max-width);
    width: 100%;
    padding: 0 0.5rem;
    margin: auto;
  }

  #puzzle-title {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }

  #game-wrapper {
    overflow: auto;
    grid-area: game;
  }

  :global(body[data-theme="dark"]) .drawer-toggle[aria-pressed="true"] {
    color: var(--primary);
    background-color: var(--primary-light);
  }

  :global(body[data-theme="light"]) .drawer-toggle[aria-pressed="true"] {
    color: color-mix(in oklch, var(--primary) 67%, var(--dark));
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
</style>