// Derived store of puzzle and user, which sets the current score once both are loaded

import type Puzzle from "$backend_interfaces/Puzzle"
import type User from "$backend_interfaces/User"
import type Loadable from "$lib/types/loadable"
import type PuzzleAndUser from "$lib/types/puzzleAndUser"
import { derived, get, type Writable } from "svelte/store"
import currentPuzzle from "./currentPuzzle"
import user from "./user"
import currentScore from "./currentScore"
import { setNotification } from "./notification"
import request from "$lib/utils/requests/request"
import type { GetCurrentUserScoreRequest } from "$backend_interfaces/Request"
import type { GetCurrentUserScoreResponse } from "$backend_interfaces/Response"

const puzzleAndUser = derived<[Writable<Loadable<Puzzle>>, Writable<Loadable<User>>], PuzzleAndUser>([currentPuzzle, user], ([$p, $u], set) => {
  set({
    puzzle: $p,
    user: $u
  })
})

puzzleAndUser.subscribe(x => {
  const { user, puzzle } = x

  if(puzzle.loading || user.loading) return currentScore.set({ loading: true, data: undefined })
  if(!puzzle.data) return currentScore.set({ loading: false, data: undefined })

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

const getCurrentUserScore = async (p: Loadable<Puzzle>) => {
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
      data: undefined
    })
    return
  }

  currentScore.set({
    loading: false,
    data: res.data.score
  })
}

export default puzzleAndUser