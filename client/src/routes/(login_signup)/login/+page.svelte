<script lang="ts">
  import IconEyeClosed from '~icons/ph/eye-closed'
  import IconEyeFill from '~icons/ph/eye-fill'
  import TablerArrowNarrowRight from '~icons/tabler/arrow-narrow-right'
  import login from '$lib/utils/auth/login'
	import Loader from '$lib/components/Loader.svelte';
  import { goto } from '$app/navigation';
  import user from '$lib/stores/user'
  
  let username = ""
  let usernameError = ""
  let password = ""
  let passwordError = ""
  let passwordHidden = true
  let loading = false

  let handlePasswordChange = (e: Event) => {
    password = (e.target as HTMLInputElement).value;
  }

  let handleSubmit = async () => {
    loading = true
    const res = await login(username, password)
    
    if(res.success) {
      // Update the user store on successful login
      user.set({
        id: res.message!,
        username: username
      })
      goto('/app')
    } else {
      loading = false
      switch(res.message) {
        case 'user-info-not-provided':
          break
        case 'user-info-incorrect':
          break
        case 'failed-to-create-session':
          break
        case 'unknown-error':
        default:
          break
      }
    }
  }
</script>

<form on:submit|preventDefault={handleSubmit}>
  <div class="input-group">
    <label 
      for="username"
      class="">
      Username
    </label>
    <input 
      id="username" 
      class="input" 
      placeholder="i.e. John Doe"
      required
      bind:value={username} />
    <span class="error">{usernameError}</span>
  </div>
  <div class="input-group">
    <label 
      for="password"
      class="">
      Password
    </label>
    <div class="input">
      <input 
        id="password" 
        required
        type={passwordHidden ? "password" : "text"}
        value={password}
        on:change={handlePasswordChange} />
      <button
        type="button"
        title={passwordHidden ? "Show password" : "Hide password"}
        on:click={() => passwordHidden = !passwordHidden}>
        {#if passwordHidden}
          <IconEyeClosed />
        {:else}
          <IconEyeFill />
        {/if}
      </button>
    </div>
    <span class="error">{passwordError}</span>
  </div>
  <div id="button-group">
    <button
      disabled={loading}
      type="submit"
      class="btn primary">
      {#if loading}
        <Loader size={28} color='var(--dark)' />
      {:else}
        Log in
      {/if}
    </button>
    <a
      href="/signup"
      id="switch">
      I already have an account
      <TablerArrowNarrowRight />
    </a>
  </div>
</form>