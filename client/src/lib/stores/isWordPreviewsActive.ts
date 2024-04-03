import { writable } from "svelte/store";

const isWordPreviewsActive = writable<boolean>(false)

export async function activateWordPreviews() {
  isWordPreviewsActive.set(true)
  // TODO: Call to server to activate word previews
}

export default isWordPreviewsActive