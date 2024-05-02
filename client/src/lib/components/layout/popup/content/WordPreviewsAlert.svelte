<script lang="ts">
	import gameData from '$lib/stores/gameData';
	import { activateWordPreviews } from './../../../../stores/currentScore';
  import { closePopup } from '$lib/stores/popup';
	import WordPreviewsInfo from './WordPreviewsInfo.svelte';
</script>

<div id="wrapper">
  <WordPreviewsInfo />
  <div id="buttons">
    <button
      class="btn gray"
      on:click={() => closePopup() }>
      Cancel
    </button>
    <button
      class="btn primary"
      disabled={$gameData.exists ? $gameData.score.wordPreviewsOn : true}
      on:click={() => { closePopup(); activateWordPreviews() } }>
      Enable
    </button>
  </div>
</div>

<style>
  #wrapper {
    display: flex;
    flex-direction: column;
  }

  #buttons {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    gap: 0.5rem;
    margin-top: 0.5rem;
  }

  #buttons button {
    font-size: 1rem;
  }
</style>