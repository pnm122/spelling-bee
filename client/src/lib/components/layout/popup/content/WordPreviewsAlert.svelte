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

<div id="popup-inner-wrapper">
  <WordPreviewsInfo />
  <div id="popup-buttons">
    <div class="checkbox-wrapper">
      <button
        id="dont-show"
        class="checkbox"
        role="checkbox"
        aria-checked={dontShowAlertAgain}
        on:click={() => dontShowAlertAgain = !dontShowAlertAgain}>
      </button>
      <label
        class="checkbox-label"
        for="dont-show">
        Don't show this alert again
      </label>
    </div>
    <div id="popup-buttons-right">
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