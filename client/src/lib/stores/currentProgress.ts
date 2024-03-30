import type Loadable from "$lib/types/loadable";
import type Progress from "$lib/types/progress";
import { get, writable } from "svelte/store";
import currentPuzzle from "./currentPuzzle";
import { getPointsFromWord, getTotalPoints } from "$lib/utils/points";

const currentProgress = writable<Loadable<Progress>>({ loading: true, data: undefined })

currentPuzzle.subscribe(p => {
  if(p.loading) return currentProgress.set({ loading: true, data: undefined })
  if(!p.data) return currentProgress.set({ loading: false, data: undefined })
  currentProgress.set({
    loading: false,
    data: {
      points: 0,
      maxPoints: getTotalPoints(p.data.wordList),
      pointsFromLastWord: 0,
      wordsFound: []
    }
  })
})

type TryWordResponse = { success: true } | { success: false, message: string }

/** 
* Submit a word. If it's valid and hasn't been found already, add it to wordsFound
* @param {string} word
* @return {TryWordResponse} success = true if word added, otherwise success = false and explanation provided in message
*/
export const tryWord = (word: string): TryWordResponse => {
  const progress = get(currentProgress)
  const puzzle = get(currentPuzzle)

  if(puzzle.loading || !puzzle.data || progress.loading || !progress.data) {
    return { success: false, message: "Puzzle hasn't loaded yet." }
  } 

  const { wordList } = puzzle.data
  const { wordsFound, points } = progress.data

  const validWord = wordList.includes(word)
  const alreadyFoundWord = wordsFound.includes(word)
  if(validWord) {
    if(!alreadyFoundWord) {
      // Add word to wordsFound
      currentProgress.set({
        ...progress,
        data: {
          ...progress.data,
          wordsFound: [...wordsFound, word],
          points: points + getPointsFromWord(word)
        }
      })
      return { success: true }
    }
    else return { success: false, message: "You've already found this word." }
  } else {
    if(word.length < 4) return { success: false, message: "Must be at least 4 letters long." }
    else if(!word.includes(puzzle.data.centerLetter)) return { success: false, message: "Must contain center letter." }
    else return { success: false, message: "We don't have that word in our dictionary." }
  }
}

export default currentProgress