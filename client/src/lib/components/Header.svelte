<script lang="ts">
  import user from "$lib/stores/user";
	import logout from "$lib/utils/auth/logout";
	import NavLink from "./NavLink.svelte";
	import Skeleton from "./Skeleton.svelte";
	import ThemeSwitcher from "./ThemeSwitcher.svelte";
</script>

<header>
  {#if $user.loading}
    <Skeleton --height='1.25rem' --width='5rem' />
  {:else if !$user.data}
    <h1>Spelling Bee</h1>
  {:else}
    <button id="player-info">
      <h1>{$user.data.username}</h1>
    </button>
  {/if}
  <nav>
    <ul>
      <li>
        <ThemeSwitcher />
      </li>
      {#if $user.loading || !$user.data}
        <li>
          <NavLink href="/leaderboard">Leaderboard</NavLink>
        </li>
        <div id="divider" />
        <li>
          <NavLink href="/login">Log in</NavLink>
        </li>
        <li>
          <a class="btn primary main-button" href="/signup">Sign up</a>
        </li>
      {:else}
        <li>
          <NavLink href="/stats">My Stats</NavLink>
        </li>
        <li>
          <NavLink href="/leaderboard">Leaderboard</NavLink>
        </li>
        <li>
          <button 
            on:click={logout}
            class="btn primary main-button">
            Log out
          </button>
        </li>
      {/if}
    </ul>
  </nav>
</header>

<style>
  header {
    height: 3.75rem;
    padding: 0 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid var(--gray);
  }

  h1 {
    font: var(--h-xl);
  }

  nav ul {
    margin: 0;
    padding: 0;
    display: flex;
    align-items: center;
  }

  nav li {
    margin: 0;
    padding: 0;
    display: block;
  }

  #divider {
    height: 1.5rem;
    width: 1px;
    background-color: var(--mediumgray);
  }

  .main-button {
    font: var(--label-sm);
  }
</style>