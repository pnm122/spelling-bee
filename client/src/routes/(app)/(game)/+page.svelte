<script>
	import PuzzlePage from "$lib/components/game/PuzzlePage.svelte";
	import { loadDailyPuzzle } from "$lib/stores/currentPuzzle";
	import { onMount } from "svelte";

  onMount(async () => {
    await loadDailyPuzzle()
  });
</script>

<PuzzlePage />