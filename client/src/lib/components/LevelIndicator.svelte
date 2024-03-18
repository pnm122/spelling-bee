<script lang="ts">
  import user from "$lib/stores/user";
	import levelToColors from "$lib/utils/levelToColors";
	import pointsToLevel from "$lib/utils/pointsToLevel";
	import Hexagon from "./Hexagon.svelte";

  $: level = $user.loading || !$user.data ? -1 : pointsToLevel($user.data.stats.points)
  $: colors = levelToColors(level ?? -1)
</script>

{#if !$user.loading && $user.data}

<div>
  <Hexagon 
    width={24} 
    fill={colors.bgColor}
  />
  <span style="color: {colors.textColor}">{level}</span>
</div>

{/if}

<style>
  div {
    width: 24px;
    height: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
  }

  div span {
    font: var(--h-sm);
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>