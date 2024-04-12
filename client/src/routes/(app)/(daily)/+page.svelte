<script>
	import PuzzlePage from "$lib/components/game/PuzzlePage.svelte";
	import { loadDailyPuzzle } from "$lib/stores/currentPuzzle";
	import { onMount } from "svelte";

  onMount(async () => {
    await loadDailyPuzzle()
  });
</script>

<svelte:head>
  <title>Spelling Bee | Today's Puzzle</title>
</svelte:head>

<PuzzlePage />