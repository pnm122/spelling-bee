import type Theme from "$lib/types/theme";
import { writable, type Writable } from "svelte/store";
import { browser } from "$app/environment";

let theme: Writable<Theme>

if(browser) {
  const localStorageTheme = window.localStorage.getItem('theme') as Theme | null
  // Whether the user prefers dark or light mode
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches

  // Initialize the theme to the already stored theme if it exists
  // Otherwise, initialize it to the user's preferred theme
  theme = writable<Theme>(localStorageTheme ?? (prefersDark ? 'dark' : 'light'))
} else {
  theme = writable<Theme>('light')
}

// Update local storage on initialization + every time theme changes
theme.subscribe(t => {
  if(browser) {
    document.body.setAttribute('data-theme', t)
    window.localStorage.setItem('theme', t)
  }
})

export default theme