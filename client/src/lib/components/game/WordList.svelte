<script lang="ts">
  import { activateWordPreviews } from "$lib/stores/currentScore";
  import gameData from "$lib/stores/gameData";
	import { openPopup } from "$lib/stores/popup";
	import { isPangram } from "$lib/utils/points";
  import PhInfo from '~icons/ph/info'
	import WordPreviewsAlert from "../layout/popup/content/WordPreviewsAlert.svelte";
	import PointsCalculation from "../layout/popup/content/PointsCalculation.svelte";
	import WordPreviewsInfo from "../layout/popup/content/WordPreviewsInfo.svelte";

  $: wordPreviewsOn = $gameData.exists ? $gameData.score.wordPreviewsOn : false

  const handleClickWordPreviews = () => {
    const showWordPreviewsAlertString = window.localStorage.getItem("show-word-previews-alert")

    const showWordPreviewsAlert = (showWordPreviewsAlertString == null) || (showWordPreviewsAlertString === "true")

    if(showWordPreviewsAlert) {
      openPopup(WordPreviewsAlert)
    } else {
      activateWordPreviews()
    }
  }
</script>

<div id="word-list">
  {#if $gameData.exists}
    <div id="word-previews-wrapper">
      <button 
        disabled={wordPreviewsOn}
        on:click={() => handleClickWordPreviews()}
        class="btn secondary small">
        {wordPreviewsOn ? 'Word previews on' : 'Turn on word previews'}
      </button>
      <!-- Keep this here so that users can perform the same action without being scared of activating it before they're ready -->
      <button
        on:click={() => openPopup(WordPreviewsInfo)}
        title="Word preview information"
        aria-label="Word preview information"
        class="icon-button"
        id="info">
        <PhInfo />
      </button>
    </div>
    <div id="words-wrapper">
      <div id="words-found">
        <button
          on:click={() => openPopup(PointsCalculation)}
          id="points-calculated-button"
          aria-label="How are my points calculated?">
          <PhInfo />
          <span>
            How are my points calculated?
          </span>
        </button>
        {#if $gameData.score.wordsFound.length > 0}
          <!-- Must key the items because the words shift place in the array -->
          {#each $gameData.score.wordsFound as data (data.word)}
            <div class="found-word-wrapper">
              <p class="found-word {isPangram(data.word) ? 'pangram' : ''}">
                {#each data.word as letter}
                  <span class={letter == $gameData.puzzle.centerLetter ? 'center-letter' : ''}>{letter}</span>
                {/each}
              </p>
              <span class="points-from-word">{data.points} points</span>
            </div>
          {/each}
        {:else}
          <p id="no-words-yet">You haven't found any words yet.</p>
        {/if}
      </div>
      {#if wordPreviewsOn}
        <div id="word-previews">
          <h3 id="word-previews-title">Words to find</h3>
          {#each $gameData.puzzle.wordList as word}
            <div class="word-preview {isPangram(word) ? 'pangram' : ''}">
              {#if $gameData.score.wordsFound.find(w => w.word == word)}
                <h4 class="crossed-off {isPangram(word) ? 'pangram' : ''}">{word}</h4>
              {:else}
                {#each word as letter}
                  <div class="word-preview-letter {letter == $gameData.puzzle.centerLetter ? 'center-letter' : ''}"></div>
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

  #points-calculated-button {
    width: fit-content;
    font: var(--label-sm);
    color: var(--darkgray);
    padding: 0.375rem 0.5rem;
    transform: translateX(-0.5rem);
    margin-bottom: 0.5rem;
    border-radius: 0.25rem;
    display: flex;
    align-items: center;
    gap: 0.25rem;
    text-align: left;
    /* Centers text with icon, maybe a better solution than this? */
    line-height: 0;
  }

  #points-calculated-button:hover {
    background-color: var(--gray);
    color: var(--heading);
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