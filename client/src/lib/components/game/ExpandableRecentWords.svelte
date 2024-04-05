<script lang="ts">
  import currentScore from "$lib/stores/currentScore";
  import currentPuzzle from "$lib/stores/currentPuzzle";
  import MaterialSymbolsKeyboardArrowDownRounded from '~icons/material-symbols/keyboard-arrow-down-rounded'
	import { isPangram } from "$lib/utils/points";
	import WordList from "./WordList.svelte";
  import PhXBold from '~icons/ph/x-bold'

  let expanded = false
</script>

<div id="wrapper">
  <button
    id="recent-words-button"
    aria-pressed={expanded}
    on:click={() => expanded = true}>
    <div id="recent-words">
      {#if !$currentScore.loading && $currentScore.data && !$currentPuzzle.loading && $currentPuzzle.data}
        {#if $currentScore.data.wordsFound.length > 0}
          {#each $currentScore.data.wordsFound as data (data.word)}
          <span class="recent-word {isPangram(data.word) ? 'pangram' : ''}">
            {#each data.word as letter}
            <span class="recent-word-letter {letter == $currentPuzzle.data.centerLetter ? 'center-letter' : ''}">
              {letter}
            </span>
            {/each}
          </span>
          {/each}
        {:else}
          <span id="no-words-yet">You haven't found any words yet.</span>
        {/if}
      {/if}
    </div>
    <MaterialSymbolsKeyboardArrowDownRounded id="recent-words-arrow" />
  </button>
  <div 
    id="word-list-wrapper"
    aria-expanded={expanded}>
    <div id="word-list-header">
      <h2 id="word-list-title">Your words</h2>
      <button
        class="icon-button"
        title="Close word list"
        aria-label="Close word list"
        on:click={() => expanded = false}>
        <PhXBold />
      </button>
    </div>
    <WordList />
  </div>
</div>

<style>
  #wrapper {
    --recent-words-margin-top: 0.5rem;
    margin: var(--recent-words-margin-top) 1rem;
    position: relative;

    @media screen and (width > 1140px) {
      display: none;
    }
  }

  #recent-words-button {
    padding: 0.75rem;
    border-radius: 0.25rem;
    background-color: var(--bg-secondary);
    width: 100%;
    border: 1px solid var(--gray);
    display: flex;
    align-items: center;
  }

  #no-words-yet {
    color: var(--darkgray);
    font: var(--body-sm);
    line-height: 1em !important;

    @media screen and (width > 768px) {
      font: var(--body);
    }
  }

  #recent-words {
    display: flex;
    gap: 0.75rem;
    overflow: hidden;
    flex: 1;
    position: relative;
  }

  #recent-words::after {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    width: 1.5rem;
    background: linear-gradient(to right, transparent, var(--bg-secondary));
  }

  .recent-word {
    font: var(--label-sm);
    white-space: nowrap;
    animation: appear var(--transition-1) forwards;

    @media screen and (width > 768px) {
      font: var(--label);
    }
  }

  @keyframes appear {
    from {
      opacity: 0;
      transform: translateX(-100%);
    }
  }

  .recent-word.pangram {
    color: var(--accent);
  }

  .recent-word-letter {
    display: inline-block;
  }

  .recent-word:not(.pangram) .recent-word-letter.center-letter {
    color: var(--primary);
  }

  :global(#recent-words-arrow) {
    transition: transform var(--transition-1);
  }

  #recent-words-button[aria-pressed="true"] :global(#recent-words-arrow) {
    transform: rotate(180deg);
  }

  #word-list-wrapper {
    --top-offset: calc(var(--header-height) + var(--game-header-height) + var(--recent-words-margin-top));
    --bottom-margin: 1rem;
    /* Flex is necessary to get scrollbar overflow from word list */
    display: flex;
    flex-direction: column;
    background-color: var(--bg-secondary);
    border-radius: 0.25rem;
    border: 1px solid var(--gray);
    overflow: hidden;
    visibility: hidden;
    height: 0;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 2;
    transition: height var(--transition-2),
                visibility var(--transition-2);
  }

  #word-list-wrapper[aria-expanded="true"] {
    /* Intended to guarantee that the word list doesn't go offscreen */
    /* Setting an explicit height also lets you animate between 0 and this height */
    height: calc(100vh - var(--top-offset) - var(--bottom-margin));
    visibility: visible;
  }

  #word-list-header {
    padding: 0.5rem var(--word-list-side-padding);
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid var(--gray);
  }

  #word-list-title {
    font: var(--h-lg);
  }
</style>