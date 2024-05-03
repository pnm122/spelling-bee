<script lang="ts">
	import gameData from '$lib/stores/gameData';
	import { activateWordPreviews } from './../../../../stores/currentScore';
  import { closePopup } from '$lib/stores/popup';
	import WordPreviewsInfo from './WordPreviewsInfo.svelte';
	import { onMount } from 'svelte';

  let dontShowAlertAgain = false

  onMount(() => {
    let showAlertAgainString = window.localStorage.getItem("show-word-previews-alert")
    if(showAlertAgainString == null) return

    dontShowAlertAgain = showAlertAgainString !== "true"
  })

  // Only set local storage when the user confirms they want to enable word previews
  // Hopefully should protect against accidentally clicking the button
  const handleEnable = () => {
    window.localStorage.setItem("show-word-previews-alert", (!dontShowAlertAgain).toString())
    closePopup()
    activateWordPreviews()
  }
</script>

<div id="wrapper">
  <WordPreviewsInfo />
  <div id="buttons">
    <div id="checkbox-wrapper">
      <button
        id="dont-show"
        role="checkbox"
        aria-checked={dontShowAlertAgain}
        on:click={() => dontShowAlertAgain = !dontShowAlertAgain}>
      </button>
      <label
        id="dont-show-label"
        for="dont-show">
        Don't show this alert again
      </label>
    </div>
    <div id="buttons-right">
      <button
        class="btn gray"
        on:click={() => closePopup() }>
        Cancel
      </button>
      <button
        class="btn primary"
        disabled={$gameData.exists ? $gameData.score.wordPreviewsOn : true}
        on:click={() => handleEnable() }>
        Enable
      </button>
    </div>
  </div>
</div>

<style>
  #wrapper {
    display: flex;
    flex-direction: column;
  }

  #buttons {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 0.5rem;
  }

  #buttons-right {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
  }

  #buttons button {
    font-size: 1rem;
  }

  #checkbox-wrapper {
    display: flex;
    align-items: center;
    gap: 0.375rem;
  }

  #dont-show {
    min-width: 1rem;
    min-height: 1rem;
    border-radius: 0.125rem;
    background-color: var(--mediumgray);
    border: 1px solid var(--darkgray);
  }

  #dont-show[aria-checked="true"] {
    background-color: var(--primary);
    border-color: var(--primary);
    position: relative;
  }

  #dont-show[aria-checked="true"]::after {
    content: "";
    border-color: var(--dark);
    border-style: solid;
    border-width: 0 0.125rem 0.125rem 0;
    width: 0.3rem;
    height: 0.575rem;
    position: absolute;
    z-index: 1;
    left: 50%;
    top: 50%;
    transform: translate(-50%, calc(-50% - 0.05rem)) rotate(45deg);
  }

  #dont-show-label {
    cursor: pointer;
    font: var(--body-sm);
    color: color-mix(in oklch, var(--heading), var(--darkgray));
  }
</style>