import type Puzzle from "$shared/interfaces/Puzzle"
import type Score from "$shared/interfaces/Score"
import type Loadable from "$lib/types/loadable"
import { derived, type Writable } from "svelte/store"
import currentPuzzle, { type CurrentPuzzle, type CurrentPuzzleErrors } from "./currentPuzzle"
import currentScore, { type CurrentScore, type CurrentScoreErrors } from "./currentScore"

type GameData = { loading: true, exists: false } 
              | { 
                  loading: false, 
                  exists: false, 
                  errors: { 
                    puzzle: CurrentPuzzleErrors | undefined, 
                    score: CurrentScoreErrors | undefined 
                  } 
                }
              | { loading: false, exists: true, puzzle: Puzzle, score: Score }

const gameData = derived<[Writable<CurrentPuzzle>, Writable<CurrentScore>], GameData>([currentPuzzle, currentScore], ([$p, $s], set) => {
  if($p.loading || $s.loading) {
    return set({
      loading: true,
      exists: false
    })
  }
  
  if(!$p.data || !$s.data) {
    return set({
      loading: false,
      exists: false,
      errors: {
        puzzle: !$p.data ? $p.error : undefined,
        score: !$s.data ? $s.error : undefined
      }
    })
  }

  set({
    loading: false,
    exists: true,
    puzzle: $p.data,
    score: $s.data
  })
})

export default gameData