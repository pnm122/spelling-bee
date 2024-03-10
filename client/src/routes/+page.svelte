<script lang='ts'>
	import Nested from "$lib/components/Nested.svelte";

  let name: string = 'Pierce'
  let h = '<span>Testing</span>'

  let count = 0
  // Reacts to changes in count
  $: doubled = count * 2

  let secondValue = 0

  const handleSubmit = (e: SubmitEvent) => {
    count += 1
  }

  // Any statement can be used reactively like this!
  $: console.log(`${count} | ${secondValue}`)

  let arr: string[] = ['a', 'b', 'c']
</script>

<h1>Hello {name}</h1>
<p>{@html h}</p>
<form on:submit={handleSubmit}>
  <p>{count} * 2 = {doubled}</p>
  <p>{secondValue}</p>
  <button type='submit'>Increment top</button>
</form>
<button 
  type='button' 
  on:click|once={() => secondValue++}>
  Increment bottom (only works once)
</button>
<p>{arr}</p>
<button
  on:click={() => arr.push('d')}>
  Add to array (doesn't update)
</button>
<button
  on:click={() => arr = [...arr, 'd']}>
  Add to array (updates)
</button>
<Nested {name} {count} {arr} />

<style>
  h1 {
    font-family: sans-serif;
    text-decoration: underline;
    color: oklch(45% 0.26 264);
  }
</style>