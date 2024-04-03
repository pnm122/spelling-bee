<script lang="ts">
  import currentProgress from "$lib/stores/currentProgress";
  import currentPuzzle from "$lib/stores/currentPuzzle";
  import isWordPreviewsActive, { activateWordPreviews } from "$lib/stores/isWordPreviewsActive";
	import { openPopup } from "$lib/stores/popup";
	import { getPointsFromWord, isPangram } from "$lib/utils/points";
  import PhInfo from '~icons/ph/info'

  let wordsToFind: string[] = []

  // Grossly inefficient, might be better to just store this in progress
  $: wordsToFind = $currentPuzzle.data?.wordList.filter(w => !$currentProgress.data?.wordsFound.includes(w)) ?? []
</script>

<div id="word-list">
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
  {#if !$currentProgress.loading && $currentProgress.data && !$currentPuzzle.loading && $currentPuzzle.data}
    <div id="words-wrapper">
      <div id="words-found">
        <!-- Gross, but the goal is to reverse the words so that the recent words are at the top -->
        {#each [...$currentProgress.data.wordsFound].reverse() as word (word)}
          <div class="found-word-wrapper">
            <p class="found-word {isPangram(word) ? 'pangram' : ''}">
              {#each word as letter}
                <span class={letter == $currentPuzzle.data.centerLetter ? 'center-letter' : ''}>{letter}</span>
              {/each}
            </p>
            <span class="points-from-word">{getPointsFromWord(word)} points</span>
          </div>
        {/each}
      </div>
      {#if $isWordPreviewsActive}
        <div id="word-previews">
          <h3 id="word-previews-title">Words to find</h3>
          {#each wordsToFind as word}
            <div class="word-preview">
              {#each word as letter}
                <div class="word-preview-letter {letter == $currentPuzzle.data.centerLetter ? 'center-letter' : ''}"></div>
              {/each}
            </div>
          {/each}
        </div>
      {/if}
    </div>
  {/if}
</div>

<style>
  #word-list {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: hidden;
  }

  #word-previews-wrapper {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.5rem;
    padding: 1rem 1.5rem;
    border-bottom: 1px solid var(--gray);
  }

  #words-wrapper {
    overflow: auto;
  }

  #words-found {
    padding: 1rem 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .found-word-wrapper {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    animation: appear var(--transition-1) forwards;
  }

  @keyframes appear {
    from {
      opacity: 0;
      transform: translateY(0.5rem);
    } to {
      opacity: 1;
      transform: none;
    }
  }

  .found-word {
    font: var(--h-xl);
  }

  .found-word.pangram {
    color: var(--accent);
  }

  .found-word span {
    display: inline-block;
  }

  .found-word:not(.pangram) .center-letter {
    color: var(--primary);
  }

  .points-from-word {
    color: var(--darkgray);
    font: var(--label-sm);
  }

  #word-previews {
    padding: 1rem 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  #word-previews-title {
    font: var(--h-lg);
  }

  .word-preview {
    display: flex;
    gap: 0.25rem;
    flex-wrap: wrap;
  }

  .word-preview-letter {
    width: 1rem;
    aspect-ratio: 1;
    border-radius: 0.125rem;
    background-color: var(--gray);
  }

  .word-preview-letter.center-letter {
    background-color: var(--primary);
  }
</style>