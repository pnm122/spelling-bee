<script lang="ts">
  import user from "$lib/stores/user";
  import currentPuzzle from "$lib/stores/currentPuzzle"
  import Skeleton from "$lib/components/Skeleton.svelte"
  import convertDate from "$lib/utils/convertDate"
  import Game from "$lib/components/Game.svelte"
	import { getTotalPoints } from "$lib/utils/points";
  import { onMount } from 'svelte'
  import { loadDailyPuzzle } from "$lib/stores/currentPuzzle"
	import PuzzlePoints from "$lib/components/PuzzlePoints.svelte";

  onMount(() => {
    loadDailyPuzzle()
  })

</script>

<div id="puzzle-header">
  {#if $currentPuzzle.loading}
    <Skeleton --width="10rem" --height="1.5rem" />
    <Skeleton --width="9rem" --height="1rem" />
  {:else if $currentPuzzle.data}
    <h1>Today's Puzzle</h1>
    <h2>{convertDate($currentPuzzle.data.date)}</h2>
  {:else}
    <span class="error">Error getting today's puzzle</span>
  {/if}
</div>
<div id="main">
  <PuzzlePoints />
  {#if $currentPuzzle.loading}
    <Skeleton />
  {:else if !$currentPuzzle.data}
    <h2>Today's puzzle not found.</h2>
  {:else}
    <Game />
  {/if}
</div>

<style>
  #puzzle-header {
    padding: 1rem;
    border-bottom: 1px solid var(--gray);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }

  #puzzle-header h1 {
    font: var(--h-2xl);
  }

  #puzzle-header h2 {
    font: var(--h);
    color: var(--darkgray);
  }

  #main {
    width: 100%;
    max-width: 600px;
    margin: auto;
    overflow: hidden;
  }
</style>