<script>
	import Header from "$lib/components/Header.svelte";
  
</script>
<!-- A +layout.svelte file applies to every child route, including the sibling +page.svelte (if it exists). You can nest layouts to arbitrary depth. -->
<!-- https://learn.svelte.dev/tutorial/layouts -->

<Header />
<slot />