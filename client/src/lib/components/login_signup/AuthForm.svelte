<script lang="ts">
  import IconEyeClosed from '~icons/ph/eye-closed'
  import IconEyeFill from '~icons/ph/eye-fill'
  import TablerArrowNarrowRight from '~icons/tabler/arrow-narrow-right'
  import login from '$lib/utils/requests/auth/login'
  import signup from '$lib/utils/requests/auth/signup'
	import Loader from '$lib/components/shared/Loader.svelte';
  import { notifyServerError } from '$lib/stores/notification';
  import { ALLOWED_SPECIAL_CHARACTERS, MAX_PASSWORD_LENGTH, MAX_USERNAME_LENGTH, MIN_PASSWORD_LENGTH, MIN_USERNAME_LENGTH, isValidPassword, isValidUsername } from '$shared/utils/validation'
  
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

  const validate = (): boolean => {
    const u = username.trim()
    const p = password.trim()
    const validUsername = isValidUsername(u)
    const validPassword = isValidPassword(p)
    if(validPassword && validUsername) return true

    if(u.length < MIN_USERNAME_LENGTH || u.length > MAX_USERNAME_LENGTH) usernameError = `Must be ${MIN_USERNAME_LENGTH}-${MAX_USERNAME_LENGTH} characters`
    else if(!validUsername) usernameError = `Must be alphanumeric and have ${MIN_USERNAME_LENGTH}-${MAX_USERNAME_LENGTH} characters`
    
    if(p.length < MIN_PASSWORD_LENGTH || p.length > MAX_PASSWORD_LENGTH) passwordError = `Must be ${MIN_PASSWORD_LENGTH}-${MAX_PASSWORD_LENGTH} characters`
    else if(!validPassword) passwordError = `Must be alphanumeric or have special characters [${ALLOWED_SPECIAL_CHARACTERS}]`
  
    return false
  }

  const handleLogin = async () => {
    if(!validate()) return

    const res = await login(username.trim(), password.trim())
    
    if(!res.success) {
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
    if(!validate()) return

    const res = await signup(username.trim(), password.trim())
    
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

  const handleSubmit = async () => {
    usernameError = ''
    passwordError = ''

    if(type == 'signup' && (password != confirmPassword)) {
      passwordError = 'Passwords must match'
      return
    }

    loading = true
    
    if(type == 'login') await handleLogin()
    else await handleSignup()

    loading = false
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