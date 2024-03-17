<script lang="ts">
  import user from "$lib/stores/user";
	import Skeleton from "./Skeleton.svelte";
</script>

<header>
  {#if $user.loading}
    <Skeleton --height='1.25rem' --width='5rem' />
  {:else if !$user.data}
    <h1>Spelling Bee</h1>
  {:else}
    <h1>{$user.data.username}</h1>
  {/if}
</header>