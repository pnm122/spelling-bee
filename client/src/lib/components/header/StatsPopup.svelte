<script lang="ts">
  import user from "$lib/stores/user";
	import { pointsToLevel } from "$lib/utils/levels";
	import LevelIndicator from "../shared/LevelIndicator.svelte";
  import PhArrowLeft from '~icons/ph/arrow-left'
  
  export let open: boolean

  const level = $user.loading || !$user.data ? undefined : pointsToLevel($user.data.stats.points)
</script>

{#if !$user.loading && $user.data}
  
<div 
  aria-hidden={!open}
  id="wrapper">
  <div id="title-mobile">
    <button 
      disabled={!open}
      aria-label="Close stats popup"
      title="Close stats popup"
      on:click={() => open = false}
      tabindex="0"
      id="close-mobile" class="icon-button">
      <PhArrowLeft />
    </button>
    <h1>My stats</h1>
  </div>
  <div id="stats-wrapper">
    <div id="player-info">
      <h2>{$user.data.username}</h2>
      <LevelIndicator />
    </div>
    <hr>
    <div id="points-wrapper">
      <h2>{$user.data.stats.points} points</h2>
      <div id="level-progress-wrapper">
        <div 
          id="level-progress"
          role="progressbar"
          aria-valuenow={65}
          aria-valuemin={0}
          aria-valuemax={level?.pointsToNextLevel}
          aria-label='Points to next level'>
          <div 
            id="level-progress-bar"
            style="width: {level ? level.pointsEarnedInLevel * 100 / level.totalPointsInLevel : 0}%"
          />
        </div>
        <span id="points-to-go">{level?.pointsToNextLevel} points to next level</span>
      </div>
    </div>
    <hr>
    <div id="main-stats">
      <div class="stat-box">
        <h3>{$user.data.stats.words_found}</h3>
        <span>words found</span>
      </div>
      <div class="stat-box">
        <h3>{$user.data.stats.pangrams}</h3>
        <span>pangrams</span>
      </div>
      <div class="stat-box">
        <h3>{$user.data.stats.puzzles_played}</h3>
        <span>puzzles played</span>
      </div>
      <div class="stat-box">
        <h3>{$user.data.stats.puzzles_solved}</h3>
        <span>puzzles solved</span>
      </div>
    </div>
    <!-- No need to show the longest word if the user doesn't have one -->
    {#if $user.data.stats.longest_word.word != ''}
      <hr>
      <div id="longest-word-wrapper">
        <h3>{$user.data.stats.longest_word.word}abcdf</h3>
        <span>Longest word found</span>
      </div>
    {/if}
  </div>
</div>
<button 
  disabled={!open}
  aria-label="Close stats popup"
  on:click={() => open = false}
  tabindex="0"
  id="close" 
/>

{/if}

<style>
  #wrapper {
    background-color: var(--bg);
    position: fixed;
    z-index: var(--z-max);
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    transform: translateX(-100%);
    visibility: hidden;
    transition: transform var(--transition-1),
                opacity var(--transition-1),
                visibility var(--transition-1);
  }

  #wrapper[aria-hidden="false"] {
    transform: none;
    opacity: 1;
    visibility: visible;
  }

  #title-mobile {
    display: flex;
    align-items: center;
    justify-content: center;
    height: var(--header-height);
    border-bottom: 1px solid var(--gray);
    position: relative;
  }

  #title-mobile h1 {
    font: var(--h-2xl);
  }

  #close-mobile {
    position: absolute;
    left: 0.25rem;
    top: 50%;
    transform: translateY(-50%);
  }

  #stats-wrapper {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 1rem;
  }

  #close {
    position: fixed;
    cursor: default;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: calc(var(--z-max) - 1);
    transition: opacity var(--transition-1),
                visibility var(--transition-1);
  }

  :global(body[data-theme="dark"]) #close {
    background-color: rgba(0, 0, 0, 0.15);
  }

  :global(body[data-theme="light"]) #close {
    background-color: rgba(0, 0, 0, 0.08);
  }

  #close:disabled {
    opacity: 0;
    visibility: hidden;
  }

  #player-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  #player-info h2 {
    font: var(--h-xl);
  }

  #points-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }

  #points-wrapper h2 {
    font: var(--h-lg);
  }

  #level-progress-wrapper {
    width: 100%;
  }

  #level-progress {
    width: 100%;
    height: 0.375rem;
    background-color: var(--gray);
    border-radius: 999px;
    overflow: hidden;
  }

  #level-progress-bar {
    background-color: var(--primary);
    height: 100%;
  }

  h3 {
    font: var(--h-lg);
  }

  span {
    color: var(--darkgray);
    font: var(--body-sm);
  }

  #main-stats {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .stat-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 3.75rem;
  }

  #longest-word-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  @media screen and (width > 768px) {
    #wrapper {
      border-radius: 0.5rem;
      box-shadow: var(--shadow);
      position: absolute;
      top: 0.25rem;
      left: 0.25rem;
      right: unset;
      bottom: unset;
      width: 100%;
      max-width: 275px;
      transform: translateY(20px);
      opacity: 0;
    }

    #title-mobile {
      display: none;
    }

    #stats-wrapper {
      padding: 0.75rem;
    }
  }
</style>