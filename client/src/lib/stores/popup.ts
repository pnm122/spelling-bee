import type Popup from "$lib/types/popup";
import { writable } from "svelte/store";

const popup = writable<Popup>({
  open: false,
  message: ''
})

export function openPopup(message: string) {
  popup.set({
    open: true,
    message
  })
}

export function closePopup() {
  popup.update(p => {
    return { open: false, message: p.message }
  })
}

export default popup