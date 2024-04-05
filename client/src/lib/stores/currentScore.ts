import type Loadable from "$lib/types/loadable";
import type Score from "$backend_interfaces/Score"
import { get, writable } from "svelte/store";
import currentPuzzle from "./currentPuzzle";
import { getPointsFromWord, getTotalPoints } from "$lib/utils/points";

const currentScore = writable<Loadable<Score>>({ loading: true, data: undefined })

currentScore.subscribe(c => {
  console.log(c.data?.wordsFound)
})

currentPuzzle.subscribe(p => {
  if(p.loading) return currentScore.set({ loading: true, data: undefined })
  if(!p.data) return currentScore.set({ loading: false, data: undefined })
  // TODO: Fetch user score from server
  currentScore.set({
    loading: false,
    data: {
      id: 'abc',
      points: 0,
      wordsFound: [],
      wordPreviewsOn: false,
      puzzleId: 'abcdef',
      userId: '12345'
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
  const score = get(currentScore)
  const puzzle = get(currentPuzzle)

  if(puzzle.loading || !puzzle.data || score.loading || !score.data) {
    return { success: false, message: "Puzzle hasn't loaded yet." }
  } 

  const { wordList } = puzzle.data
  const { wordsFound, points } = score.data

  const validWord = wordList.includes(word)
  const alreadyFoundWord = wordsFound.find(w => w.word == word)
  if(validWord) {
    if(!alreadyFoundWord) {
      const pointsFromWord = getPointsFromWord(word)
      // Add word to wordsFound
      currentScore.set({
        ...score,
        data: {
          ...score.data,
          // Add word to the front of the list so recent words show up first
          wordsFound: [{ word: word, points: pointsFromWord }, ...wordsFound],
          points: points + pointsFromWord,
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

export default currentScore