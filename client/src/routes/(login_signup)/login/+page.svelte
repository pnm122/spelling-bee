<script lang="ts">
  import IconEyeClosed from '~icons/ph/eye-closed'
  import IconEyeFill from '~icons/ph/eye-fill'
  import TablerArrowNarrowRight from '~icons/tabler/arrow-narrow-right'
  import login from '$lib/utils/auth/login'
	import Loader from '$lib/components/Loader.svelte';
  import notificationState, { notifyServerError } from '$lib/stores/notification';
  import user from '$lib/stores/user'
  
  let username = ""
  let usernameError = ""
  let password = ""
  let passwordError = ""
  let passwordHidden = true
  let loading = false

  let handlePasswordChange = (e: Event) => {
    passwordError = ''
    password = (e.target as HTMLInputElement).value;
  }

  let handleSubmit = async () => {
    loading = true
    const res = await login(username, password)
    
    if(res && res.success) {
      // Update the user store on successful login
      // This will automatically redirect them from the page
      user.set(res.data.user)
    } else {
      loading = false

      if(!res) {
        notifyServerError()
        return
      }

      switch(res.message) {
        case 'user-info-not-provided':
          // Shouldn't happen because inputs are required
          if(username == '') usernameError = 'Please provide a username'
          if(password == '') passwordError = 'Please provide a password'
          break
        case 'user-info-incorrect':
          usernameError = 'Incorrect username or password'
          passwordError = 'Incorrect username or password'
          break
        case 'failed-to-create-session':
          break
        case 'unknown-error':
        default:
          notifyServerError()
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
      data-input-invalid={usernameError != ''}
      aria-invalid={usernameError != ''}
      aria-describedby={passwordError ? 'usernameError' : undefined}
      required
      bind:value={username}
      on:change={() => usernameError = ''} />
    <span class="error" id='usernameError'>{usernameError}</span>
  </div>
  <div class="input-group">
    <label 
      for="password"
      class="">
      Password
    </label>
    <div class="input" data-input-invalid={passwordError != ''}>
      <input 
        id="password" 
        aria-invalid={passwordError != ''}
        aria-describedby={passwordError ? 'passwordError' : undefined}
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
    <span class="error" id='passwordError'>{passwordError}</span>
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
      I need an account
      <TablerArrowNarrowRight />
    </a>
  </div>
</form>