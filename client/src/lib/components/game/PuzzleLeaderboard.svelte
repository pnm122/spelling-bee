<script lang="ts">
	import PhXBold from '~icons/ph/x-bold';
  import currentLeaderboard, { refreshLeaderboard } from "$lib/stores/currentLeaderboard";
	import TablerReload from '~icons/tabler/reload'
	import gameDrawerStates, { toggleLeaderboardDrawer } from "$lib/stores/gameDrawerStates";
	import Skeleton from '../shared/Skeleton.svelte';
	import user from '$lib/stores/user';
	import gameData from '$lib/stores/gameData';
	import { onMount } from 'svelte';

  $: leaderboard = $currentLeaderboard.data

  // Keep leaderboard updated with current user's score
  gameData.subscribe(d => {
    if(!d.exists || !leaderboard) return

    const currentUserScoreIndex = leaderboard.findIndex(s => s.userId == $user.data?.id)
    if(currentUserScoreIndex == -1) return

    const currentUserPoints = d.score.points

    leaderboard[currentUserScoreIndex].points = currentUserPoints

    if(currentUserScoreIndex == 0) return

    const nextPlacePoints = leaderboard[currentUserScoreIndex - 1].points
    if(currentUserPoints > nextPlacePoints) {
      const temp = leaderboard[currentUserScoreIndex]
      leaderboard[currentUserScoreIndex] = leaderboard[currentUserScoreIndex - 1]
      leaderboard[currentUserScoreIndex - 1] = temp
    }
  })

  onMount(() => {
    // Load the leaderboard when the drawer opens
    const unsubscribe = gameDrawerStates.subscribe(s => {
      if(s.leaderboard) refreshLeaderboard()
    })

    return () => {
      unsubscribe()
    }
  })

</script>

<div class="drawer-title">
  <h2>Leaderboard</h2>
  <div id="title-buttons">
    <button
      on:click={() => refreshLeaderboard()}
      class="btn gray small">
      <TablerReload />
      Refresh
    </button>
    <button
      on:click={() => toggleLeaderboardDrawer()}
      id="close"
      class="icon-button"
      aria-label="Close leaderboard drawer"
      title="Close leaderboard drawer">
      <PhXBold />
    </button>
  </div>
</div>
<div id="leaderboard-wrapper">
  {#if $currentLeaderboard.loading}
    <ol id="leaderboard">
      {#each Array(10) as _, index}
        <li class="score">
          <div class="score-left">
            <span class="place">{index + 1}.</span>
            <Skeleton 
              --width={`${(Math.random() * 5) + 3}rem`}
              --height="1.125rem"
            />
          </div>
          <Skeleton 
            --width="4rem"
            --height="1.125rem"
          />
        </li>
      {/each}
    </ol>
  {:else if !$currentLeaderboard.data || !leaderboard}
    <div id="error-wrapper">
      <h3 
        id="error"
        class="error">
        There was an error getting leaderboard data.
      </h3>
    </div>
  {:else}
    <ol id="leaderboard">
      {#each leaderboard as score, index (score.id)}
        <li class="score {score.userId == $user.data?.id ? 'current-user' : ''}">
          <div class="score-left">
            <span class="place">{index + 1}.</span>
            <h3>{score.userId == $user.data?.id ? 'You' : score.username}</h3>
          </div>
          <h4 class="points">{score.points} points</h4>
        </li>
      {/each}
    </ol>
  {/if}
</div>

<style>
  #leaderboard-wrapper {
    padding: 1.5rem;
    height: 100%;
  }

  #title-buttons {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  #close {
    display: block;

    @media screen and (width > 1140px) {
      display: none;;
    }
  }

  #error-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
  }

  #error {
    text-align: center;
    width: fit-content;
  }

  #leaderboard {
    padding: 0;
    margin: 0;
  }

  .score {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid var(--gray);
    padding: 0.625rem 0;
  }

  .score-left {
    display: flex;
    align-items: center;
  }

  .place {
    width: 2rem;
  }

  .points {
    color: var(--darkgray);
  }

  .current-user {
    --side-padding: 0.75rem;
    background-color: var(--primary-light);
    position: relative;
    padding-left: var(--side-padding);
    padding-right: var(--side-padding);
    left: calc(-1 * var(--side-padding));
    width: calc(100% + calc(2 * var(--side-padding)));
    border: none;
    border-radius: 0.25rem;
  }

  body[data-theme="dark"] .current-user * {
    color: var(--primary);
  }

  body[data-theme="light"] .current-user * {
    color: var(--heading);
  }
</style>