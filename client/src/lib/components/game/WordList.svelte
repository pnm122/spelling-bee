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
      class="icon-button"
      id="info">
      <PhInfo />
    </button>
  </div>
  {#if !$currentProgress.loading && $currentProgress.data && !$currentPuzzle.loading && $currentPuzzle.data}
    <div id="words-wrapper">
      <div id="words-found">
        {#if $currentProgress.data.wordsFound.length > 0}
          <!-- Must key the items because the words shift place in the array -->
          {#each $currentProgress.data.wordsFound as word (word)}
            <div class="found-word-wrapper">
              <p class="found-word {isPangram(word) ? 'pangram' : ''}">
                {#each word as letter}
                  <span class={letter == $currentPuzzle.data.centerLetter ? 'center-letter' : ''}>{letter}</span>
                {/each}
              </p>
              <span class="points-from-word">{getPointsFromWord(word)} points</span>
            </div>
          {/each}
        {:else}
          <p id="no-words-yet">You haven't found any words yet.</p>
        {/if}
      </div>
      {#if $isWordPreviewsActive}
        <div id="word-previews">
          <h3 id="word-previews-title">Words to find</h3>
          {#each $currentPuzzle.data.wordList as word}
            <div class="word-preview {isPangram(word) ? 'pangram' : ''}">
              {#if $currentProgress.data.wordsFound.includes(word)}
                <h4 class="crossed-off {isPangram(word) ? 'pangram' : ''}">{word}</h4>
              {:else}
                {#each word as letter}
                  <div class="word-preview-letter {letter == $currentPuzzle.data.centerLetter ? 'center-letter' : ''}"></div>
                {/each}
              {/if}
            </div>
          {/each}
        </div>
      {/if}
    </div>
  {/if}
</div>

<style>
  :global(body) {
    --word-list-side-padding: 1rem;

    @media screen and (width > 768px) {
      --word-list-side-padding: 1.5rem;
    }
  }

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
    padding: 0.5rem var(--word-list-side-padding);
    border-bottom: 1px solid var(--gray);
  }

  #info {
    color: var(--darkgray);
  }

  #info:hover {
    color: var(--heading);
  }

  #words-wrapper {
    overflow: auto;
  }

  #words-found {
    padding: 1rem var(--word-list-side-padding);
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
    background-color: var(--mediumgray);
  }

  .word-preview-letter.center-letter {
    background-color: var(--primary) !important;
  }

  .word-preview.pangram .word-preview-letter {
    background-color: var(--accent);
  }

  #no-words-yet {
    color: var(--darkgray);
  }

  .crossed-off {
    color: var(--darkgray);
    text-decoration: line-through;
  }

  .crossed-off.pangram {
    color: var(--accent);
  }
</style>