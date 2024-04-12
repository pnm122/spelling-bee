<script lang="ts">
  import { onMount } from "svelte"
  import { type PuzzlePreview } from "$shared/interfaces/Puzzle"
  import getAllPuzzles from "$lib/utils/requests/puzzle/getAllPuzzles"
  import type Loadable from "$lib/types/loadable"
	import PuzzlePreviewComponent from "$lib/components/puzzles/PuzzlePreviewComponent.svelte";
	import Skeleton from "$lib/components/shared/Skeleton.svelte";
  import getTodaysDate from '$shared/utils/getTodaysDate'
  import getTodaysPuzzle from "$lib/utils/requests/puzzle/getTodaysPuzzle"
  import type Puzzle from "$shared/interfaces/Puzzle"

  type PuzzleData = {
    daily: Puzzle,
    past: PuzzlePreview[]
  }

  let puzzles: Loadable<PuzzleData, string> = { loading: true, data: undefined }

  onMount(async () => {
    const allPuzzlesRes = await getAllPuzzles()
    if(!allPuzzlesRes.success) {
      if(allPuzzlesRes.message == 'unknown-error') {
        puzzles = { 
          loading: false, 
          data: undefined, 
          error: 'An unknown error occurred. Please refresh the page.' 
        }
      }
      else {
        puzzles = { 
          loading: false, 
          data: undefined, 
          error: 'Please log in to see all puzzles.'
        }
      }
      return
    }

    const dailyPuzzleRes = await getTodaysPuzzle()
    if(!dailyPuzzleRes.success) {
      puzzles = { 
        loading: false, 
        data: undefined, 
        error: 'An unknown error occurred. Please refresh the page.' 
      }
      return
    }

    puzzles = { 
      loading: false, 
      data: {
        daily: dailyPuzzleRes.data.puzzle,
        past: allPuzzlesRes.data.puzzles
      }
    }
  })
</script>

<div class="container">
  <div id="wrapper">
    {#if !puzzles.loading && !puzzles.data }
      <p class="error" role="alert">{puzzles.error}</p>
    {:else}
      <section>
        <h1 class="title">Today's Puzzle</h1>
        {#if puzzles.loading || !puzzles.data }
          <div class="puzzles-wrapper">
            <Skeleton
              classes="preview-skeleton"
            />
          </div>
        {:else}
          <div class="puzzles-wrapper">
            <PuzzlePreviewComponent puzzle={puzzles.data.daily} />
          </div>
        {/if}
      </section>
      <section>
        <h1 class="title">Past Puzzles</h1>
        {#if puzzles.loading || !puzzles.data }
          <div class="puzzles-wrapper">
            <Skeleton
              classes="preview-skeleton"
            />
            <Skeleton
              classes="preview-skeleton"
            />
            <Skeleton
              classes="preview-skeleton"
            />
            <Skeleton
              classes="preview-skeleton"
            />
            <Skeleton
              classes="preview-skeleton"
            />
            <Skeleton
              classes="preview-skeleton"
            />
            <Skeleton
              classes="preview-skeleton"
            />
            <Skeleton
              classes="preview-skeleton"
            />
            <Skeleton
              classes="preview-skeleton"
            />
            <Skeleton
              classes="preview-skeleton"
            />
          </div>
        {:else}
          <div class="puzzles-wrapper">
            {#each puzzles.data.past as puzzle}
              <!-- Today's puzzle goes in daily puzzle section -->
              {#if puzzle.date != getTodaysDate()}
                <PuzzlePreviewComponent puzzle={puzzle} />
              {/if}
            {/each}
          </div>
        {/if}
      </section>
    {/if}
  </div>
</div>

<style>
  #wrapper {
    padding-top: 2rem;
    padding-bottom: 2rem;
    display: flex;
    flex-direction: column;
    gap: 3rem;
  }

  .title {
    font: var(--h-2xl);
  }

  .puzzles-wrapper {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1rem;

    @media screen and (width > 600px) {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }

    @media screen and (width > 768px) {
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }

    @media screen and (width > 1024px) {
      grid-template-columns: repeat(6, minmax(0, 1fr));
    }
  }

  section {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  :global(.preview-skeleton) {
    width: 100%;
    aspect-ratio: 1;
  }
</style>