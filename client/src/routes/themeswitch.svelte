<script lang='ts'>
  import theme from "$lib/stores/theme";
  import MdiAlarmOff from '~icons/mdi/alarm-off'
</script>

<button 
  class="btn primary"
  on:click={() => { $theme == 'dark' ? $theme = 'light' : $theme = 'dark' }}>
  Switch Theme
  <MdiAlarmOff />
</button>