import { writable } from "svelte/store";

const gameDrawerStates = writable({
  wordList: false,
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