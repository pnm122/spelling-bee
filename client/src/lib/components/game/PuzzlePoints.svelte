<script lang="ts">
  import gameData from "$lib/stores/gameData";

  export let isGameComplete = false

  interface SkillLevel {
    name: string,
    percent: number
  }
  const skillLevels: SkillLevel[] = [{
    name: "Novice",
    percent: 0
  }, {
    name: "Savvy",
    percent: 12.5
  }, {
    name: "Wordsmith",
    percent: 25
  }, {
    name: "Prodigy",
    percent: 40
  }, {
    name: "Expert",
    percent: 60
  }, {
    name: "Genius",
    percent: 80
  }, {
    name: "Spelling Bee",
    percent: 100
  }]

  $: puzzleProgressPct = 
    $gameData.exists
      ? $gameData.score.points * 100 / $gameData.puzzle.maxPoints
      : 0
  $: currentLevel = skillLevels.findLast(s => puzzleProgressPct >= s.percent)!
</script>

{#if $gameData.loading}
  <div></div>
{:else if !$gameData.exists}
  <div></div>
{:else}
  <div id="progress-outer-wrapper">
    <div 
      id="progress-inner-wrapper"
      style="transform: translate(-{Math.min(currentLevel.percent, skillLevels[skillLevels.length - 3].percent)}%)"
      data-perfect-score={puzzleProgressPct == 100}
      data-game-complete={isGameComplete}>
      <!-- ^ Moves the progress bar on mobile depending on which skill level the user has achieved -->
      <!-- Using this idea since the whole bar can't fit on mobile -->
      <!-- TODO: Accessibility? -->
      <div id="skill-levels">
        {#each skillLevels as skillLevel}
          <span 
            class="skill-level"
            style="left: {skillLevel.percent}%"
            data-passed="{puzzleProgressPct >= skillLevel.percent}">
            {skillLevel.name}
          </span>
        {/each}
      </div>
      <div 
        id="progress"
        role="progressbar"
        aria-valuenow={puzzleProgressPct}
        aria-valuemin={$gameData.score.points}
        aria-valuemax={$gameData.puzzle.maxPoints}
        aria-label="Points earned from today's puzzle">
        <div 
          id="progress-bar"
          style="width: {puzzleProgressPct}%"
        />
        <div
          id="points"
          style="left: {puzzleProgressPct}%;">
          <span>{$gameData.score.points} points</span>
          <!-- Force points from last word to rerender every time points changes, causing the animation -->
          {#key $gameData.score.points}
            {#if $gameData.score.wordsFound[0] && $gameData.score.wordsFound[0].points > 0}
              <span id="points-from-last-word">+{$gameData.score.wordsFound[0].points}</span>
            {/if}
          {/key}
        </div>
      </div>
    </div>
  </div>
{/if}

<style>

  #progress-outer-wrapper {
    --bar-height: 0.125rem;
    padding: 2rem 3rem 3rem 3rem;
    overflow: hidden;
  }

  #progress-inner-wrapper {
    --highlight-color: var(--primary);
    --on-highlight: var(--dark);
    --bar-color: var(--gray);
    --default-text-color: var(--mediumgray);
    --highlight-text-color: var(--heading);

    position: relative;
    min-width: 450px;
    transition: transform var(--transition-2);
  }

  #progress-inner-wrapper[data-perfect-score="true"] {
    --highlight-color: var(--accent);
    --on-highlight: var(--light);
  }

  #progress-inner-wrapper[data-game-complete="true"] {
    --highlight-color: var(--dark);
    --on-highlight: var(--primary);
    --bar-color: color-mix(in oklch, var(--dark) 50%, var(--primary));
    --default-text-color: color-mix(in oklch, var(--dark) 75%, var(--primary));
    --highlight-text-color: var(--dark);
  }

  @media screen and (width > 550px) {
    #progress-inner-wrapper {
      transform: none !important;
    }
  }

  #progress {
    width: 100%;
    height: var(--bar-height);
    background-color: var(--bar-color);
  }

  #progress-bar {
    height: 100%;
    background-color: var(--highlight-color);
    transition: width var(--transition-2),
                background-color var(--transition-2);
  }

  #skill-levels {
    --dot-gap: 0.25rem;
    --dot-size: 0.625rem;
    position: absolute;
    width: 100%;
    left: 0;
    top: 0;
  }

  .skill-level {
    width: fit-content;
    color: var(--default-text-color);
    position: absolute;
    transform: translateX(-50%);
    font: var(--label-xs);
    white-space: nowrap;
    /* gap between text and dot + half of dot size, then subtract half of bar height to center vertically on the bar */
    bottom: calc(var(--dot-gap) + (var(--dot-size) / 2) - (var(--bar-height) / 2));
    transition: color var(--transition-2);
  }

  .skill-level::after {
    content: "";
    position: absolute;
    top: calc(100% + var(--dot-gap));
    left: 50%;
    transform: translateX(-50%);
    width: var(--dot-size);
    aspect-ratio: 1;
    border-radius: 999px;
    background-color: var(--bar-color);
    transition: background-color var(--transition-2);
  }

  .skill-level[data-passed="true"] {
    color: var(--highlight-text-color);
  }

  .skill-level[data-passed="true"]::after {
    background-color: var(--highlight-color);
  }

  #points {
    font: var(--label-sm);
    padding: 0.375rem;
    border-radius: 0.25rem;
    background-color: var(--highlight-color);
    color: var(--on-highlight);
    width: fit-content;
    margin-top: 0.75rem;
    position: relative;
    transform: translateX(-50%);
    transition: left var(--transition-2),
                color var(--transition-2),
                background-color var(--transition-2);
  }

  #points::before {
    content: "";
    position: absolute;
    display: block;
    left: 50%;
    bottom: 100%;
    border-width: 0 4px 4px 4px;
    border-bottom-color: var(--highlight-color);
    border-left-color: transparent;
    border-right-color: transparent;
    border-style: solid;
    transform: translateX(-50%);
    transition: border-color var(--transition-2);
  }

  #points-from-last-word {
    position: absolute;
    left: 100%;
    top: 50%;
    
    margin-left: 0.5rem;
    color: var(--darkgray);
    white-space: nowrap;
    font: var(--label-xs);
    animation: appear 4s var(--timing-function) forwards;
  }

  @keyframes appear {
    from {
      transform: translateY(50%);
      opacity: 0;
      visibility: hidden;
    } 25%, 75% {
      transform: translateY(-50%);
      opacity: 1;
      visibility: visible;
    } to {
      transform: translateY(-150%);
      opacity: 0;
      visibility: hidden;
    }
  }
</style>