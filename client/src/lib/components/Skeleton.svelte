<script lang="ts">
  export let style: string = ""
  export let classes: string = ""
  export let id: string = ""
</script>

<div style={style} class="skeleton {classes}" id={id} />

<style>
  .skeleton {
    width: var(--width);
    height: var(--height);
    background-color: var(--mediumgray);
    border-radius: 0.25rem;
    overflow: hidden;
    position: relative;
  }

  .skeleton::after {
    content: "";
    position: absolute;
    display: block;
    width: 200%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 1;
    background: linear-gradient(to right, transparent, var(--gray), transparent);
    animation: load 1.5s cubic-bezier(0.77, 0, 0.175, 1) infinite;
  }

  @keyframes load {
    from {
      transform: translateX(-100%);
    } to {
      transform: translate(100%);
    }
  }
</style>