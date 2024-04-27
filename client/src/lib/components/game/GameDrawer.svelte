<script lang="ts">
  import gameDrawerStates from "$lib/stores/gameDrawerStates";

  export let side: 'left' | 'right'
  export let open: boolean
</script>

<div 
  class="drawer {side}"
  aria-label="Drawer"
  aria-expanded={open}>
  <slot />
</div>

<style>
  .drawer {
    position: fixed;
    inset: 0;
    background-color: var(--bg-secondary);
    z-index: var(--z-drawer);
    transition: transform var(--transition-2),
                visibility var(--transition-2);
    visibility: hidden;
    overflow: hidden;
    display: flex;
    flex-direction: column;

    &.left {
      transform: translateX(-100%);
    }

    &.right {
      transform: translateX(100%);
    }

    &[aria-expanded="true"] {
      transform: translate(0);
      visibility: visible;
    }

    @media screen and (width > 1140px) {
      width: 100%;
      position: relative;
      z-index: var(--z-under-header);
      
      &.left {
        grid-area: header / left / left / left;
        border-right: 1px solid var(--gray);
      }

      &.right {
        grid-area: header / right / right / right;
        border-left: 1px solid var(--gray);
      }
    }
  }
</style>