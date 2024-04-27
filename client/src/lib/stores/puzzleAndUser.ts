// Derived store of puzzle and user, which sets the current score once both are loaded

import type Puzzle from "$shared/interfaces/Puzzle"
import type User from "$shared/interfaces/User"
import type Loadable from "$lib/types/loadable"
import type PuzzleAndUser from "$lib/types/puzzleAndUser"
import { derived, get, type Writable } from "svelte/store"
import currentPuzzle, { type CurrentPuzzle } from "./currentPuzzle"
import user, { type GameUser } from "./user"
import currentScore from "./currentScore"
import { setNotification } from "./notification"
import request from "$lib/utils/requests/request"
import type { GetCurrentUserScoreRequest } from "$shared/interfaces/Request"
import type { GetCurrentUserScoreResponse } from "$shared/interfaces/Response"

const puzzleAndUser = derived<[Writable<CurrentPuzzle>, Writable<GameUser>], PuzzleAndUser>([currentPuzzle, user], ([$p, $u], set) => {
  set({
    puzzle: $p,
    user: $u
  })
})

puzzleAndUser.subscribe(x => {
  const { user, puzzle } = x

  if(puzzle.loading || user.loading) return currentScore.set({ loading: true, data: undefined })
  if(!puzzle.data) return currentScore.set({ loading: false, data: undefined, error: 'no-puzzle' })

  if(!user.data) {
    currentScore.set({
      loading: false,
      data: {
        id: '',
        wordPreviewsOn: false,
        points: 0,
        puzzleId: puzzle.data.id,
        userId: '',
        wordsFound: []
      }
    })

    return setNotification(
      "Your score is not being saved",
      "Please login to save your scores.",
      "default"
    )
  }

  getCurrentUserScore(puzzle)
})

const getCurrentUserScore = async (p: CurrentPuzzle) => {
  if(p.loading || !p.data) return

  const res = await request<GetCurrentUserScoreRequest, GetCurrentUserScoreResponse>(
    `score/get_current_user?puzzleId=${p.data!.id}`
  )

  if(!res.success) {
    setNotification(
      'Error getting user score',
      res.message,
      'error'
    )
    currentScore.set({
      loading: false,
      data: undefined,
      error: res.message
    })
    return
  }

  currentScore.set({
    loading: false,
    data: res.data.score
  })
}

export default puzzleAndUser