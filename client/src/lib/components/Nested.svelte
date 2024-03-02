<script lang="ts">
  export let name: string
  export let count: number
  export let arr: string[]

  // All props
  console.log($$props)
</script>

<div>
  This is a nested component for {name}
  {#if count > 5}
    <p>Count is high: {count}</p>
  {:else}
    <p>Count is low: {count}</p>
  {/if}

  {#each arr as x, index}
    <p>{index}: {x}</p>
  {/each}
</div>