import type Puzzle from "$shared/interfaces/Puzzle"
import type Score from "$shared/interfaces/Score"
import type Loadable from "$lib/types/loadable"
import { derived, type Writable } from "svelte/store"
import currentPuzzle from "./currentPuzzle"
import currentScore from "./currentScore"

type GameData = { loading: boolean, exists: false } | { loading: false, exists: true, puzzle: Puzzle, score: Score }

const gameData = derived<[Writable<Loadable<Puzzle>>, Writable<Loadable<Score>>], GameData>([currentPuzzle, currentScore], ([$p, $s], set) => {
  if($p.loading || $s.loading) {
    return set({
      loading: true,
      exists: false
    })
  }
  
  if(!$p.data || !$s.data) {
    return set({
      loading: false,
      exists: false
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