<script>
  import currentPuzzle from "$lib/stores/currentPuzzle"
  import puzzleAndUser from "$lib/stores/puzzleAndUser";
  import currentScore from "$lib/stores/currentScore";
	import Header from "$lib/components/layout/Header.svelte";
  
</script>
<!-- A +layout.svelte file applies to every child route, including the sibling +page.svelte (if it exists). You can nest layouts to arbitrary depth. -->
<!-- https://learn.svelte.dev/tutorial/layouts -->

<div id="wrapper">
  <Header />
  <slot />
</div>

<style>
  #wrapper {
    display: grid;
    grid-template-rows: var(--header-height) calc(100vh - var(--header-height));
  }
</style>