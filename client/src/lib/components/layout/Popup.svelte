<script lang="ts">
  import popup, { closePopup } from "$lib/stores/popup";
  import PhX from '~icons/ph/x'

  const handleClick = (e: MouseEvent) => {
    if(e.target != document.getElementById('popup-wrapper')) return

    closePopup()
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    console.log(e.key)
    if(e.key == 'ESCAPE') closePopup()
  }

  $: console.log($popup.open)
</script>

<div 
  on:click={handleClick}
  on:keydown={handleKeyDown}
  role="button"
  tabindex="0"
  id="popup-wrapper"
  class={$popup.open ? 'open' : 'closed'}>
  <div
    id="popup"
    role="dialog">
    <button
      class="icon-button"
      id="close-popup"
      title="Close popup"
      aria-label="Close popup"
      on:click={closePopup}>
      <PhX />
    </button>
    <p>{$popup.message}</p>
  </div>
</div>

<style>
  #popup-wrapper {
    display: none;
    z-index: var(--z-max);
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.25);
    align-items: center;
    justify-content: center;
    padding: 1rem;
  }

  #popup-wrapper.open {
    display: flex;
  }

  #popup {
    display: flex;
    width: 100%;
    max-width: 400px;
    padding: 1rem 3rem 1rem 1rem;
    border-radius: 0.5rem;
    background-color: var(--gray);
    box-shadow: var(--shadow);
    position: relative;
  }

  #close-popup {
    position: absolute;
    right: 0.125rem;
    top: 0.125rem;
  }

  #close-popup:hover {
    background-color: var(--mediumgray);
  }
</style>