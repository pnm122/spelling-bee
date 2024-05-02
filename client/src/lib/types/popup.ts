import type { SvelteComponent } from "svelte"

export default interface Popup {
  open: boolean
  content: PopupContent
}

export type PopupContent = ConstructorOfATypedSvelteComponent | undefined