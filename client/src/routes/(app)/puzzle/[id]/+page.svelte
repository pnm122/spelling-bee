<script>
	import PuzzlePage from "$lib/components/game/PuzzlePage.svelte";
	import { loadNewPuzzle } from "$lib/stores/currentPuzzle";
	import { onMount } from "svelte";
  import { page } from "$app/stores";

  onMount(async () => {
    await loadNewPuzzle($page.params.id)
  });
</script>

<PuzzlePage />