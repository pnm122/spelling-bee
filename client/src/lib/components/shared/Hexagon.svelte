<script lang="ts">
  export let width: number
  export let fill: string
  export let textColor: string = "var(--heading)"
  export let clickHandler: (() => void) | undefined = undefined
  export let letter: string | undefined = undefined
  export let id = ""
  export let pressed = false
  export let disabled = false
  export let largeText = false
  let classes: string = ""

  export {classes as class}
</script>

<svg class={classes} id={id} width="{width}" viewBox="-5 -5 130 113.92304845413263">
  <polygon
    aria-disabled={clickHandler ? disabled : undefined}
    data-pressed={pressed}
    data-clickable={clickHandler != undefined}
    role={clickHandler == undefined ? undefined : "button"}
    tabindex={clickHandler == undefined ? undefined : 0}
    on:click={clickHandler}
    fill={fill}
    points="0,51.96152422706631 30,0 90,0 120,51.96152422706631 90,103.92304845413263 30,103.92304845413263">
  </polygon>
  {#if letter}
    <text
      data-large={largeText}
      fill={textColor}
      x="50%" y="50%" dx="-0.1em" dy="-0.05em" dominant-baseline="middle" text-anchor="middle">
      {letter}
    </text>
  {/if}
</svg>

<style>
  polygon {
    outline: none;
    transform-origin: center;
    transition: transform var(--transition-0);
  }

  polygon[data-clickable="true"] {
    cursor: pointer;
  }

  polygon:not([aria-disabled="true"])[data-clickable="true"]:active,
  polygon:not([aria-disabled="true"])[data-pressed="true"] {
    transform: scale(0.85);
  }

  text {
    text-anchor: middle;
    text-transform: uppercase;
    pointer-events: none;
    font: var(--h-3xl);
    user-select: none;
  }

  text[data-large="true"] {
    font: var(--h-6xl);
  }
</style>