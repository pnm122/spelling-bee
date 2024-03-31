<script lang="ts">
	import { getTotalPoints } from "$lib/utils/points";
  import currentProgress from "$lib/stores/currentProgress";

  $: puzzleProgressPct = $currentProgress.data ? $currentProgress.data!.points * 100 / $currentProgress.data!.maxPoints : 0

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
</script>

{#if $currentProgress.loading}
  <div></div>
{:else if $currentProgress.data == undefined}
  <div></div>
{:else}
  <div id="progress-outer-wrapper">
    <div 
      id="progress-inner-wrapper"
      style="transform: translate(-{Math.min(Math.floor(puzzleProgressPct / 20)*20, 60)}%)"
      data-puzzle-solved={puzzleProgressPct == 100}>
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
        aria-valuemin={$currentProgress.data.points}
        aria-valuemax={$currentProgress.data.maxPoints}
        aria-label="Points earned from today's puzzle">
        <div 
          id="progress-bar"
          style="width: {puzzleProgressPct}%"
        />
        <div
          id="points"
          style="left: {puzzleProgressPct}%;">
          <span>{$currentProgress.data.points} points</span>
          <!-- Force points from last word to rerender every time points changes, causing the animation -->
          {#key $currentProgress.data.points}
            {#if $currentProgress.data.pointsFromLastWord > 0}
              <span id="points-from-last-word">+{$currentProgress.data.pointsFromLastWord}</span>
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

    position: relative;
    min-width: 450px;
    transition: transform var(--transition-2);
  }

  #progress-inner-wrapper[data-puzzle-solved="true"] {
    --highlight-color: var(--accent);
    --on-highlight: var(--light);
  }

  @media screen and (width > 550px) {
    #progress-inner-wrapper {
      transform: none !important;
    }
  }

  #progress {
    width: 100%;
    height: var(--bar-height);
    background-color: var(--gray);
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
    color: var(--mediumgray);
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
    background-color: var(--gray);
    transition: background-color var(--transition-2);
  }

  .skill-level[data-passed="true"] {
    color: var(--heading);
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