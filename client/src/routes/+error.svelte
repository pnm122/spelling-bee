<script lang="ts">
  import { page } from '$app/stores'
</script>

<div>
  <p>{$page.error?.message}</p>
</div>