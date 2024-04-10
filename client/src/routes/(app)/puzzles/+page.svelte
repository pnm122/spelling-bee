<script lang="ts">
  import { onMount } from "svelte"
  import { type PuzzlePreview } from "$backend_interfaces/Puzzle"
  import getAllPuzzles from "$lib/utils/requests/puzzle/getAllPuzzles"
  import type Loadable from "$lib/types/loadable"
	import PuzzlePreviewComponent from "$lib/components/puzzles/PuzzlePreviewComponent.svelte";
	import Skeleton from "$lib/components/shared/Skeleton.svelte";

  let puzzles: Loadable<PuzzlePreview[]> = { loading: true, data: undefined }
  let errorMessage = ''

  onMount(async () => {
    const res = await getAllPuzzles()
    if(!res.success) {
      if(res.message == 'unknown-error') errorMessage = 'An unknown error occurred.'
      else errorMessage = 'Please log in to see all puzzles.'
      puzzles = { loading: false, data: undefined }
      return
    }

    puzzles = { loading: false, data: res.data.puzzles }
  })
</script>

<div class="container" id="wrapper">
  <h1 id="title">Past Puzzles</h1>
  {#if puzzles.loading}
    <div id="past-puzzles">
      <Skeleton
        --width='100%'
        --height='5.5rem'
      />
      <Skeleton
        --width='100%'
        --height='5.5rem'
      />
      <Skeleton
        --width='100%'
        --height='5.5rem'
      />
      <Skeleton
        --width='100%'
        --height='5.5rem'
      />
      <Skeleton
        --width='100%'
        --height='5.5rem'
      />
      <Skeleton
        --width='100%'
        --height='5.5rem'
      />
      <Skeleton
        --width='100%'
        --height='5.5rem'
      />
      <Skeleton
        --width='100%'
        --height='5.5rem'
      />
      <Skeleton
        --width='100%'
        --height='5.5rem'
      />
      <Skeleton
        --width='100%'
        --height='5.5rem'
      />
    </div>
  {:else if !puzzles.data}
    <div>
      <p>{errorMessage}</p>
    </div>
  {:else}
    <div id="past-puzzles">
      {#each puzzles.data as puzzle}
        <PuzzlePreviewComponent puzzle={puzzle} />
      {/each}
    </div>
  {/if}
</div>

<style>
  #wrapper {
    padding-top: 2rem;
  }

  #title {
    font: var(--h-4xl);
  }

  #past-puzzles {
    display: grid;
    grid-template-columns: repeat(1, minmax(0, 1fr));
    row-gap: 2rem;
    column-gap: 1rem;
    margin-top: 2rem;

    @media screen and (width > 768px) {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    @media screen and (width > 1024px) {
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }
  }
</style>