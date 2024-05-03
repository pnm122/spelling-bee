<script lang="ts">
	import { closePopup } from "$lib/stores/popup";
  import gameData from "$lib/stores/gameData";
	import { onMount } from "svelte";
	import { getHint } from "$lib/stores/currentScore";

  let dontShowAlertAgain = false

  onMount(() => {
    let showAlertAgainString = window.localStorage.getItem("show-hint-alert")
    if(showAlertAgainString == null) return

    dontShowAlertAgain = showAlertAgainString !== "true"
  })
  
  const handleUseHint = () => {
    window.localStorage.setItem("show-hint-alert", (!dontShowAlertAgain).toString())
    closePopup()
    getHint()
  }

</script>

<div id="popup-inner-wrapper">
  <p>
    Using a hint will give you 3 letters of a word you haven't found yet, at the cost of losing one point once you find the word.
    The hint will stay until you find a word beginning with the given letters.
  </p>
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
        disabled={$gameData.exists ? $gameData.score.hint != undefined : true}
        on:click={() => handleUseHint() }>
        Use Hint
      </button>
    </div>
  </div>
</div>