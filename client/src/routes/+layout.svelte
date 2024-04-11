<style global>
  @import "../main.css";
</style>

<script lang="ts">
	import Notification from "$lib/components/layout/Notification.svelte";
	import Popup from "$lib/components/layout/Popup.svelte";
	import Header from "$lib/components/layout/header/Header.svelte";
  // Import here so that the code runs no matter which page you're on
  // @ts-ignore
  import theme from "$lib/stores/theme";
  import currentPuzzle from "$lib/stores/currentPuzzle"
  import puzzleAndUser from "$lib/stores/puzzleAndUser";
  import currentScore from "$lib/stores/currentScore";  
</script>

<Popup />
<Notification />

<div id="page-wrapper">
  <Header />
  <slot />
</div>