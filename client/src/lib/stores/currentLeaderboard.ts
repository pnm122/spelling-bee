import type Loadable from "$lib/types/loadable";
import request from "$lib/utils/requests/request";
import type { PuzzleLeaderboardErrors, PuzzleLeaderboardResponse } from "$shared/interfaces/Response";
import type { LeaderboardScore } from "$shared/interfaces/Score";
import { get, writable } from "svelte/store";
import currentPuzzle from "./currentPuzzle";
import { setNotification } from "./notification";

// One minute between leaderboard refreshes
const TIME_BETWEEN_REFRESHES = 1000 * 60

let leaderboardLastRefreshed = -1
let lastRefreshPuzzleId = ''

export type CurrentLeaderboard = Loadable<LeaderboardScore[], PuzzleLeaderboardErrors>
const currentLeaderboard = writable<CurrentLeaderboard>({ 
  loading: true, 
  data: undefined 
})

// Load leaderboard every time the puzzle changes
currentPuzzle.subscribe(p => {
  if(p.loading || !p.data) {
    currentLeaderboard.set({
      loading: true,
      data: undefined
    })
  }

  refreshLeaderboard()
})

export async function refreshLeaderboard() {
  const refreshTime = Date.now()
  const puzzle = get(currentPuzzle)
  if(puzzle.loading || !puzzle.data) return

  if(puzzle.data.id == lastRefreshPuzzleId && leaderboardLastRefreshed + TIME_BETWEEN_REFRESHES > refreshTime) {
    return
  }
  
  currentLeaderboard.set({
    loading: true,
    data: undefined
  })

  lastRefreshPuzzleId = puzzle.data.id
  leaderboardLastRefreshed = refreshTime

  const res = await request<{}, PuzzleLeaderboardResponse>(
    `score/puzzle_leaderboard?puzzleId=${puzzle.data.id}`
  )

  if(!res.success) {
    currentLeaderboard.set({
      loading: false,
      data: undefined,
      error: res.message
    })

    return setNotification(
      'Error getting leaderboard',
      'There was an error getting the leaderboard. Please refresh to try again.',
      'error'
    )
  }

  currentLeaderboard.set({
    loading: false,
    data: res.data.scores
  })
}

export default currentLeaderboard
