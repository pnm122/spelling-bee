<script lang="ts">
  import IconEyeClosed from '~icons/ph/eye-closed'
  import IconEyeFill from '~icons/ph/eye-fill'
  import TablerArrowNarrowRight from '~icons/tabler/arrow-narrow-right'
  import login from '$lib/utils/auth/login'
  
  let username = ""
  let usernameError = ""
  let password = ""
  let passwordError = ""
  let passwordHidden = true

  let handlePasswordChange = (e: Event) => {
    password = (e.target as HTMLInputElement).value;
  }

  let handleSubmit = async (e: SubmitEvent) => {
    login(username, password)
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
      type="submit"
      class="btn primary">
      Log In
    </button>
    <a
      href="/signup"
      id="switch">
      I already have an account
      <TablerArrowNarrowRight />
    </a>
  </div>
</form>