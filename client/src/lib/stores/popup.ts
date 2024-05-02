import type { PopupContent } from "$lib/types/popup";
import type Popup from "$lib/types/popup";
import { writable } from "svelte/store";

const popup = writable<Popup>({
  open: false,
  content: undefined
})

export function openPopup(content: PopupContent) {
  popup.set({
    open: true,
    content
  })
}

export function closePopup() {
  popup.update(p => {
    return { ...p, open: false }
  })
}

export default popup