<script lang="ts">
  import IconEyeClosed from '~icons/ph/eye-closed'
  import IconEyeFill from '~icons/ph/eye-fill'
  import TablerArrowNarrowRight from '~icons/tabler/arrow-narrow-right'

  let username = ""
  let usernameError = ""
  let password = ""
  let passwordError = ""
  let passwordHidden = true

  let handlePasswordChange = (e: Event) => {
    password = (e.target as HTMLInputElement).value;
  }
</script>

<form on:submit={() => {}}>
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
        type={passwordHidden ? "password" : "text"}
        value={password}
        on:change={handlePasswordChange} />
      <button
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