<script lang="ts">
  import currentProgress from "$lib/stores/currentProgress";
  import currentPuzzle from "$lib/stores/currentPuzzle";
  import isWordPreviewsActive, { activateWordPreviews } from "$lib/stores/isWordPreviewsActive";
	import { openPopup } from "$lib/stores/popup";
  import PhInfo from '~icons/ph/info'
</script>

<div id="word-previews-wrapper">
  <button 
    disabled={$isWordPreviewsActive}
    on:click={activateWordPreviews}
    class="btn secondary small">
    {$isWordPreviewsActive ? 'Word previews on' : 'Turn on word previews'}
  </button>
  <button
    on:click={() => openPopup(`
      Turning on word previews shows a list of all words you haven't found yet, with their letters hidden. 
      The center letter is marked with a yellow background. Any words found after turning on word previews will have their points reduced by 20%.
    `)}
    title="Word preview information"
    aria-label="Word preview information"
    class="icon-button">
    <PhInfo />
  </button>
</div>

<style>
  #word-previews-wrapper {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem 1.5rem;
    border-bottom: 1px solid var(--gray);
  }
</style>