<script lang="ts">
  import user from "$lib/stores/user";
	import logout from "$lib/utils/auth/logout";
	import NavLink from "./NavLink.svelte";
	import Skeleton from "./Skeleton.svelte";
	import ThemeSwitcher from "./ThemeSwitcher.svelte";
  import PhDotsThreeOutlineFill from '~icons/ph/dots-three-outline-fill'
  import PhXBold from '~icons/ph/x-bold'

  let expanded = false
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
  <button
    on:click={() => expanded = !expanded}
    aria-checked={expanded}
    aria-label={expanded ? "Close navigation" : "Open navigation"}
    title={expanded ? "Close navigation" : "Open navigation"}
    role="switch"
    id="toggle-nav">
    {#if expanded}
      <PhXBold />
    {:else}
      <PhDotsThreeOutlineFill />
    {/if} 
  </button>
  <nav
    data-expanded={expanded}>
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
    --header-height: 3.75rem;
    height: var(--header-height);
    padding: 0 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    z-index: 99;
  }

  /* I think this has to be done this way so that there's a background above
  the expanding nav, but below the header's content */
  header::before {
    content: "";
    position: absolute;
    z-index: 1;
    left: 0;
    right: 0;
    top: 0;
    height: var(--header-height);
    background-color: var(--bg);
    border-bottom: 1px solid var(--gray);
  }

  header > * {
    position: relative;
    z-index: 2;
  }

  h1 {
    font: var(--h-xl);
  }

  nav {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: var(--header-height);
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 0 1rem;
    z-index: 0;
    background-color: var(--gray);
    transition: transform var(--transition-1),
                visibility var(--transition-1);
  }

  nav[data-expanded="true"] {
    transform: translateY(100%);
  }

  nav ul {
    margin: 0;
    padding: 0;
    display: flex;
    align-items: center;
    width: 100%;
    max-width: 450px;
    justify-content: space-between;
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

  #toggle-nav {
    width: 2.5rem;
    height: 2.5rem;
    gap: 3px;
    border-radius: 999px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  #toggle-nav:hover {
    background-color: var(--gray);
  }

  @media screen and (width > 768px) {
    nav {
      background-color: transparent;
      position: static;
      visibility: visible;
      transform: none;
      height: unset;
      padding: 0;
      z-index: inherit;
    }

    nav ul {
      width: auto;
      max-width: unset;
      gap: 1rem;
    }

    #toggle-nav {
      display: none;
    }
  }
</style>