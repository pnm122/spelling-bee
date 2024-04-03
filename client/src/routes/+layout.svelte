<style global>
  @import "../main.css";
</style>

<script lang="ts">
	import Notification from "$lib/components/layout/Notification.svelte";
	import Popup from "$lib/components/layout/Popup.svelte";
  // Import here so that the code runs no matter which page you're on
  // @ts-ignore
  import theme from "$lib/stores/theme";
</script>

<Popup />
<Notification />
<slot />