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
  }

  #progress-outer-wrapper {
    --bar-height: 0.125rem;
    padding: 2rem 3rem 3rem 3rem;
    overflow: hidden;
  }

  #progress-inner-wrapper {
    --highlight-color: var(--primary);
    --on-highlight: var(--dark);

    position: relative;
    min-width: 450px;
    transition: transform var(--transition-2);
  }

  #progress-inner-wrapper[data-puzzle-solved="true"] {
    --highlight-color: var(--accent);
    --on-highlight: var(--light);
  }

  @media screen and (width > 550px) {
    #progress-inner-wrapper {
      transform: none !important;
    }
  }

  #progress {
    width: 100%;
    height: var(--bar-height);
    background-color: var(--gray);
  }

  #progress-bar {
    height: 100%;
    background-color: var(--highlight-color);
    transition: width var(--transition-2),
                background-color var(--transition-2);
  }

  #skill-levels {
    --dot-gap: 0.25rem;
    --dot-size: 0.625rem;
    position: absolute;
    width: 100%;
    left: 0;
    top: 0;
  }

  .skill-level {
    width: fit-content;
    color: var(--mediumgray);
    position: absolute;
    transform: translateX(-50%);
    font: var(--label-xs);
    white-space: nowrap;
    /* gap between text and dot + half of dot size, then subtract half of bar height to center vertically on the bar */
    bottom: calc(var(--dot-gap) + (var(--dot-size) / 2) - (var(--bar-height) / 2));
    transition: color var(--transition-2);
  }

  .skill-level::after {
    content: "";
    position: absolute;
    top: calc(100% + var(--dot-gap));
    left: 50%;
    transform: translateX(-50%);
    width: var(--dot-size);
    aspect-ratio: 1;
    border-radius: 999px;
    background-color: var(--gray);
    transition: background-color var(--transition-2);
  }

  .skill-level[data-passed="true"] {
    color: var(--heading);
  }

  .skill-level[data-passed="true"]::after {
    background-color: var(--highlight-color);
  }

  .skill-level:nth-of-type(2) {
    left: 20%;
  }

  .skill-level:nth-of-type(3) {
    left: 40%;
  }

  .skill-level:nth-of-type(4) {
    left: 60%;
  }

  .skill-level:nth-of-type(5) {
    left: 80%;
  }

  .skill-level:nth-of-type(6) {
    left: 100%;
  }

  #points {
    font: var(--label-sm);
    padding: 0.375rem;
    border-radius: 0.25rem;
    background-color: var(--highlight-color);
    color: var(--on-highlight);
    width: fit-content;
    margin-top: 0.75rem;
    position: relative;
    transform: translateX(-50%);
    transition: left var(--transition-2),
                color var(--transition-2),
                background-color var(--transition-2);
  }

  #points::before {
    content: "";
    position: absolute;
    display: block;
    left: 50%;
    bottom: 100%;
    border-width: 0 4px 4px 4px;
    border-bottom-color: var(--highlight-color);
    border-left-color: transparent;
    border-right-color: transparent;
    border-style: solid;
    transform: translateX(-50%);
    transition: border-color var(--transition-2);
  }

  #points-from-last-word {
    position: absolute;
    left: 100%;
    top: 50%;
    
    margin-left: 0.5rem;
    color: var(--darkgray);
    white-space: nowrap;
    font: var(--label-xs);
    animation: appear 4s var(--timing-function) forwards;
  }

  @keyframes appear {
    from {
      transform: translateY(50%);
      opacity: 0;
      visibility: hidden;
    } 25%, 75% {
      transform: translateY(-50%);
      opacity: 1;
      visibility: visible;
    } to {
      transform: translateY(-150%);
      opacity: 0;
      visibility: hidden;
    }
  }
</style>