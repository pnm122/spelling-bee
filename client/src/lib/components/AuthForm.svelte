<script lang="ts">
  import IconEyeClosed from '~icons/ph/eye-closed'
  import IconEyeFill from '~icons/ph/eye-fill'
  import TablerArrowNarrowRight from '~icons/tabler/arrow-narrow-right'
  import login from '$lib/utils/requests/auth/login'
  import signup from '$lib/utils/requests/auth/signup'
	import Loader from '$lib/components/Loader.svelte';
  import { notifyServerError } from '$lib/stores/notification';
  import { setUser } from '$lib/stores/user'
  
  export let type: 'login' | 'signup'
  let username = ""
  let usernameError = ""
  let password = ""
  let passwordError = ""
  let confirmPassword = ""
  let passwordHidden = true
  let loading = false

  const handleConfirmPasswordChange = (e: Event) => {
    passwordError = ''
    confirmPassword = (e.target as HTMLInputElement).value;
  }

  const handlePasswordChange = (e: Event) => {
    passwordError = ''
    password = (e.target as HTMLInputElement).value;
  }

  const handleLogin = async () => {
    const res = await login(username, password)
    
    if(!res.success) {
      loading = false

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

  const handleSignup = async () => {
    const res = await signup(username, password)
    loading = false
    
    if(!res.success){
      switch(res.message) {
        case 'user-info-not-provided':
          // Shouldn't happen because inputs are required
          if(username == '') usernameError = 'Please provide a username'
          if(password == '') passwordError = 'Please provide a password'
          break
        case 'user-exists':
          usernameError = 'Username already exists'
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

  const handleSubmit = () => {
    if(type == 'signup' && (password != confirmPassword)) {
      passwordError = 'Passwords must match'
      return
    }

    loading = true
    
    if(type == 'login') handleLogin()
    else handleSignup()
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
  {#if type == 'signup'}
    <div class="input-group">
      <label 
        for="confirmPassword"
        class="">
        Confirm Password
      </label>
      <input 
        id="confirmPassword" 
        class="input" 
        data-input-invalid={passwordError != ''}
        aria-invalid={passwordError != ''}
        aria-describedby={passwordError ? 'confirmPasswordError' : undefined}
        required
        type={passwordHidden ? "password" : "text"}
        on:change={handleConfirmPasswordChange} />
      <span class="error" id='confirmPasswordError'>{passwordError}</span>
    </div>
  {/if}
  <div id="button-group">
    <button
      disabled={loading}
      type="submit"
      class="btn primary">
      {#if loading}
        <Loader size={28} color='var(--dark)' />
      {:else}
        {type == 'login' ? 'Log in' : 'Sign up'}
      {/if}
    </button>
    <a
      href={type == 'login' ? '/signup' : '/login'}
      id="switch">
      {type == 'login' ? 'I need an account' : 'I already have an account'}
      <TablerArrowNarrowRight />
    </a>
  </div>
</form>