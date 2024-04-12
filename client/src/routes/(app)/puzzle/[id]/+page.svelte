<script>
	import PuzzlePage from "$lib/components/game/PuzzlePage.svelte";
	import { loadNewPuzzle } from "$lib/stores/currentPuzzle";
	import { onMount } from "svelte";
  import { page } from "$app/stores";
  import gameData from "$lib/stores/gameData";

  onMount(async () => {
    await loadNewPuzzle($page.params.id)
  });
</script>

<svelte:head>
  <title>Spelling Bee | {(!$gameData.loading && $gameData.exists) ? `Daily Puzzle ${$gameData.puzzle.date}` : 'Loading...'}</title>
</svelte:head>

<PuzzlePage />