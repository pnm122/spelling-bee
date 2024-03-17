<script lang="ts">
	import notificationState from "$lib/stores/notification";
  import PhMinus from '~icons/ph/minus'
  import BiPatchExclamationFill from '~icons/bi/patch-exclamation-fill'
	import { onDestroy } from "svelte";

  let state = $notificationState
  let expanded = false

  const unsubscribe = notificationState.subscribe(s => {
    state = s
  })

  const closeNotification = () => {
    notificationState.set({ ...$notificationState, open: false })
  }

  onDestroy(() => unsubscribe())
</script>

<div 
  role="button"
  tabindex="0"
  title='Expand notification'
  on:click={() => expanded = !expanded}
  id='notification'
  aria-hidden="{!state.open}"
  data-type={state.type}
  data-expanded={expanded}>
  <div id='notification-top'>
    <h1>
      <BiPatchExclamationFill id='error-icon' />
      {state.title}
    </h1>
    <button 
      id='close'
      title='Close notification'
      on:click|stopPropagation={closeNotification}>
      <PhMinus />
    </button>
  </div>
  <p>{state.message}</p>
</div>

<style>
  #notification {
    position: fixed;
    bottom: 0;
    right: 0;
    z-index: 999;
    width: calc(100% - 2rem);
    max-width: 350px;
    max-height: 300px;
    overflow: auto;
    background-color: var(--heading);
    padding: 1rem;
    border-radius: 0.5rem;
    margin: 0 1rem 1rem 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    cursor: pointer;
    box-shadow: var(--shadow);
    transition: transform 0.5s cubic-bezier(.88,-0.95,.12,1.95),
                visibility 0.5s;
  }

  #notification[aria-hidden="true"] {
    transform: translateY(calc(100% + 2rem));
  }

  #notification[data-type="error"] {
    background-color: var(--error);
  }

  #notification[data-type="error"] * {
    color: var(--error-light);
  }

  #notification-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
  }

  #close {
    width: 2.25rem;
    height: 2.25rem;
    border-radius: 999px;
    position: absolute;
    top: 50%;
    right: 0;
    z-index: 1;
    transform: translate(0.5rem, -50%);
  }

  #close:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }

  #notification * {
    color: var(--bg);
  }

  #notification h1 {
    font: var(--h-lg);
    display: flex;
    gap: 0.25rem;
    align-items: center;
    max-width: 85%;
  }

  :global(#error-icon) {
    width: 1.125rem;
    height: 1.125rem;
    min-width: 1.125rem;
    min-height: 1.125rem;
  }

  #notification p {
    opacity: 0.75;
  }

  #notification:not([data-expanded="true"]) p {
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2; /* number of lines to show */
            line-clamp: 2; 
    -webkit-box-orient: vertical;
  }
</style>