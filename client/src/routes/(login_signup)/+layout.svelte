<script lang="ts">
  import user from '$lib/stores/user'
  import { goto } from '$app/navigation'

  if($user) {
    goto('/app')
  }
</script>

<main>
	<div id="card">
		<div id="hexagons">
			<svg class="primary" width="96" viewBox="-5 -5 130 113.92304845413263">
        <polygon
					points="0,51.96152422706631 30,0 90,0 120,51.96152422706631 90,103.92304845413263 30,103.92304845413263">
        </polygon>
      </svg>
      <svg width="96" viewBox="-5 -5 130 113.92304845413263">
        <polygon
					points="0,51.96152422706631 30,0 90,0 120,51.96152422706631 90,103.92304845413263 30,103.92304845413263">
        </polygon>
      </svg>
      <svg width="96" viewBox="-5 -5 130 113.92304845413263">
        <polygon
					points="0,51.96152422706631 30,0 90,0 120,51.96152422706631 90,103.92304845413263 30,103.92304845413263">
        </polygon>
      </svg>
      <svg width="96" viewBox="-5 -5 130 113.92304845413263">
        <polygon
					points="0,51.96152422706631 30,0 90,0 120,51.96152422706631 90,103.92304845413263 30,103.92304845413263">
        </polygon>
      </svg>
		</div>
    <div id="card-inner">
      <h1>Spelling Bee</h1>
      <slot />
    </div>
	</div>
</main>

<style>
	main {
		width: 100%;
		min-height: 100vh;
		background-color: var(--bg-secondary);
		display: flex;
		justify-content: center;
		align-items: center;
	}

	#card {
		flex: 1;
		min-height: 100vh;
		background-color: var(--bg);
		padding: 2rem;
		overflow: hidden;
		position: relative;
    display: flex;
	}

	@media screen and (width > 600px) {
		#card {
			flex: unset;
			min-height: unset;
			width: fit-content;
			padding: 3rem 5rem;
			border-radius: 1rem;
			box-shadow: 0.5rem 0.5rem 2rem rgba(0, 0, 0, 0.15);
    }

    #card-inner {
      width: 350px;
    }
	}

  #card-inner {
    /* Stack above hexagons */
    position: relative;
    display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 2rem;
    flex: 1;
  }

	h1 {
		font: var(--h-4xl);
	}

	#hexagons {
		position: absolute;
		top: 25px;
		right: 25px;
	}

  svg.primary {
    fill: var(--primary);
  }

  svg:not(.primary) {
    fill: var(--primary-light);
  }

  svg {
    position: absolute;
    top: 0;
    right: 0;
  }

  svg:nth-of-type(2) {
    transform: translate(75%, 50%);
  }

  svg:nth-of-type(3) {
    transform: translate(75%, -50%);
  }

  svg:nth-of-type(4) {
    transform: translate(0, -100%);
  }

  /* Style inputs only inside of #card-inner */
  #card-inner :global(.input) {
    border-radius: 999px;
    height: 2.5rem;
    background-color: var(--gray);
    display: flex;
    justify-content: space-between;
    overflow: hidden;
  }

  #card-inner :global(.input:focus-within) {
    outline: 2px solid var(--focus);
  }

  #card-inner :global(form) {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  #card-inner :global(input) {
    padding: 0 1.125rem;
    flex-grow: 1;
  }

  #card-inner :global(input::placeholder) {
    opacity: 0.333;
  }

  #card-inner :global(.input input),
  #card-inner :global(.input button) {
    /* Disable outline for password input and button, since the containing .input should have the outline */
    outline: none;
  }

  #card-inner :global(.input button) {
    padding: 0 1.125rem;
    border-radius: 999px;
  }

  #card-inner :global(.input button:focus) {
    background-color: color-mix(in oklch, var(--heading) 20%, transparent);
  }

  #card-inner :global(button[type="submit"]) {
    margin-top: 0.5rem;
  }

  #card-inner :global(#button-group) {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
  }

  #card-inner :global(#button-group button[type="submit"]) {
    width: 100%;
  }

  #card-inner :global(#switch) {
    font: var(--label-sm);
    width: fit-content;
  }

  #card-inner :global(#switch:hover) {
    text-decoration: underline;
  }
</style>
