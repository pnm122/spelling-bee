<script lang="ts">
  import theme from "$lib/stores/theme";
  import PhSunBold from '~icons/ph/sun-bold'
  import PhMoonFill from '~icons/ph/moon-fill'

  const switchTheme = () => {
    theme.set($theme == 'dark' ? 'light' : 'dark')
  }
</script>

<button
  on:click={switchTheme}
  role="switch"
  aria-checked={$theme == 'dark'}
  aria-label="Switch theme"
  title="Switch theme">
  <div 
    id="theme-icon">
    {#if $theme == 'light'}
      <PhSunBold class='icon light' />
    {:else}
      <PhMoonFill class='icon' />
    {/if}
  </div>
</button>

<style>
  button {
    --circle-size: 1.125rem;
    --padding: 0.125rem;
    background-color: var(--gray);
    width: calc(2 * var(--circle-size) + (2 * var(--padding)));
    height: calc(var(--circle-size) + (2 * var(--padding)));
    padding: 0.125rem;
    border-radius: 999px;
    outline: 1px solid var(--mediumgray);
  }

  button:focus {
    outline: 2px solid var(--heading);
  }

  #theme-icon {
    height: var(--circle-size);
    aspect-ratio: 1;
    border-radius: 999px;
    background-color: var(--primary);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform var(--transition-0);
  }

  button[aria-checked="true"] #theme-icon {
    transform: translateX(100%);
  }

  #theme-icon :global(.icon) {
    color: var(--dark);
    width: 1rem;
    height: 1rem;
  }

  #theme-icon :global(.icon.light) {
    width: 0.75rem;
    height: 0.75rem;
  }
</style>