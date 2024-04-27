<script lang="ts">
  import user from "$lib/stores/user";
	import { pointsToLevel, levelToColors } from "$lib/utils/levels";
	import Hexagon from "./Hexagon.svelte";

  $: level = $user.loading || !$user.data ? undefined : pointsToLevel($user.data.stats.points)
  $: colors = levelToColors(level ? level.level : -1)
</script>

{#if !$user.loading && $user.data}

<div>
  <Hexagon 
    width={26} 
    fill={colors.bgColor}
  />
  <span style="color: {colors.textColor}">{level?.level}</span>
</div>

{/if}

<style>
  div {
    width: 26px;
    height: 26px;
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