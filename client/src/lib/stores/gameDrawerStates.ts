import { writable } from "svelte/store";

const gameDrawerStates = writable({
  wordList: true,
  // Disable by default so it isn't open on mobile
  // Maybe a better approach in the future
  leaderboard: false
})

export function toggleWordListDrawer() {
  gameDrawerStates.update(s => {
    return { ...s, wordList: !s.wordList }
  })
}

export function toggleLeaderboardDrawer() {
  gameDrawerStates.update(s => {
    return { ...s, leaderboard: !s.leaderboard }
  })
}

export default gameDrawerStates