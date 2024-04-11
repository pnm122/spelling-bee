<script lang="ts">
  import { page } from "$app/stores"
  export let href: string
  export let style: string = ""
  let classes: string = ""

  $: selected = ($page.url.pathname == '/' && href == "/") || 
                (href != "/" && $page.url.pathname.includes(href))

  export {classes as class}
</script>

<a 
  href={href}
  data-sveltekit-preload-data={false}
  aria-current={selected ? "page" : undefined}
  style={style}
  class={classes}>
  <slot />
</a>

<style>
  a {
    --side-padding: 1rem;
    font: var(--label-sm);
    color: var(--heading);
    padding: 0.5rem var(--side-padding);
    position: relative;
    width: fit-content;
  }

  a::after {
    content: "";
    position: absolute;
    display: block;
    right: var(--side-padding);
    left: auto;
    width: 0;
    height: 2px;
    background-color: var(--heading);
    transition: width var(--transition-1);
  }

  a[aria-current="page"]::after,
  a:hover::after,
  a:focus::after {
    width: calc(100% - (2 * var(--side-padding)));
    left: var(--side-padding);
    right: auto;
  }

  a:focus {
    outline: none;
  }
</style>