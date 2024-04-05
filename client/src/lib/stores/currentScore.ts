import type Loadable from "$lib/types/loadable";
import type Score from "$backend_interfaces/Score"
import { get, writable } from "svelte/store";
import currentPuzzle from "./currentPuzzle";
import { getPointsFromWord, getTotalPoints, wordMatchesHint } from "$lib/utils/points";

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
  const { wordsFound, points, hint, wordPreviewsOn } = score.data

  const validWord = wordList.includes(word)
  const alreadyFoundWord = wordsFound.find(w => w.word == word)
  if(validWord) {
    if(!alreadyFoundWord) {
      const pointsFromWord = getPointsFromWord(word, hint, wordPreviewsOn)
      // Add word to wordsFound
      currentScore.set({
        ...score,
        data: {
          ...score.data,
          // Add word to the front of the list so recent words show up first
          wordsFound: [{ word: word, points: pointsFromWord }, ...wordsFound],
          points: points + pointsFromWord,
          // Update hint to undefined if the word matches the hint
          hint: wordMatchesHint(word, hint) ? undefined : hint
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

export const activateWordPreviews = () => {
  currentScore.update(c => {
    if(c.loading || !c.data) return c
    
    return {
      ...c,
      data: {
        ...c.data,
        wordPreviewsOn: true
      }
    }
  })
}

// Pick an unfound word as the user's hint
// Hint is first 3 letters of the word
// If they've already asked for a hint and not found that word, just give them the same hint again
export const getHint = (callback: (hint: string) => void) => {
  const score = get(currentScore)
  const puzzle = get(currentPuzzle)

  if(puzzle.loading || !puzzle.data || score.loading || !score.data) {
    return
  } 
  
  const { wordList } = puzzle.data
  const { wordsFound, hint } = score.data

  if(hint) return callback(hint.word.slice(0, hint.lettersGiven))

  let availableIndexes: number[] = []
  wordList.forEach((w, index) => {
    if(!wordsFound.find(n => n.word == w)) availableIndexes.push(index)
  })

  const hintIndex = availableIndexes[Math.floor(Math.random() * availableIndexes.length)]
  let hintWord = wordList[availableIndexes[hintIndex]]

  callback(hintWord.slice(0, 3))

  currentScore.update(c => {
    // Shouldn't be possible from checks above, but it stops TS from yelling at me
    if(c.loading || !c.data) return c

    return {
      ...c,
      data: {
        ...c.data,
        hint: {
          word: hintWord,
          lettersGiven: 3
        }
      }
    }
  })
}

export default currentScore