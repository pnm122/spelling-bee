import type Loadable from "$lib/types/loadable";
import type Score from "$shared/interfaces/Score"
import { get, writable } from "svelte/store";
import currentPuzzle from "./currentPuzzle";
import { getPointsFromWord, wordMatchesHint } from "$lib/utils/points";
import { notifyNeedAccount, setNotification } from "./notification";
import request from "$lib/utils/requests/request";
import type { ActivateWordPreviewsResponse, AddWordResponse, AuthenticatedErrors, GetCurrentUserScoreErrors, SetHintResponse } from "$shared/interfaces/Response";
import { type AddWordRequest, type ActivateWordPreviewsRequest, type SetHintRequest } from "$shared/interfaces/Request"
import user, { addWordToUser, removeUser } from "./user";
import type { Hint, UserWordFound } from "$shared/interfaces/Score";

export type CurrentScoreErrors = GetCurrentUserScoreErrors | AuthenticatedErrors
export type CurrentScore = Loadable<Score, CurrentScoreErrors>
const currentScore = writable<CurrentScore>({ loading: true, data: undefined })

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
  const { wordsFound } = score.data

  const validWord = wordList.includes(word)
  const alreadyFoundWord = wordsFound.find(w => w.word == word)
  if(validWord) {
    if(!alreadyFoundWord) {
      
      (async () => {
        // Add word to wordsFound
        const w: UserWordFound | undefined = await updateScoreWithWord(word)
        // Update user's stats with new word if successfully updated database
        if(w) addWordToUser(w)
      })()

      return { success: true }
    }
    else return { success: false, message: "You've already found this word." }
  } else {
    if(word.length < 4) return { success: false, message: "Must be at least 4 letters long." }
    else if(!word.includes(puzzle.data.centerLetter)) return { success: false, message: "Must contain center letter." }
    else return { success: false, message: "We don't have that word in our dictionary." }
  }
}

/** 
* Update the local score state, then update the database if the user is logged in
* @param {string} word - Word to add
* @return {Promise<UserWordFound | undefined>} Return the word and point value if added to the database, undefined otherwise
*/
const updateScoreWithWord = async (word: string): Promise<UserWordFound | undefined> => {
  let pointsFromWord = -1
  let scoreId = ''
  let wordMatchedHint = false

  currentScore.update(score => {
    if(score.loading || !score.data) return score
    const { hint, wordPreviewsOn, wordsFound, points, id } = score.data
    scoreId = id

    pointsFromWord = getPointsFromWord(word, hint, wordPreviewsOn)
    wordMatchedHint = wordMatchesHint(word, hint)

    return {
      ...score,
      data: {
        ...score.data,
        // Add word to the front of the list so recent words show up first
        wordsFound: [{ word: word, points: pointsFromWord }, ...wordsFound],
        points: points + pointsFromWord,
        // Update hint to undefined if the word matches the hint
        hint: wordMatchedHint ? undefined : hint
      }
    }
  })
    
  const u = get(user)
  if(u.loading || !u.data) return

  const res = await request<AddWordRequest, AddWordResponse>(
    'score/add_word',
    'POST',
    { 
      word: { word, points: pointsFromWord },
      scoreId: scoreId
    }
  )

  if(wordMatchedHint) {
    const hintRes = await request<SetHintRequest, SetHintResponse>(
      'score/set_hint',
      'POST',
      { scoreId }
    )
  }

  if(!res.success) {
    if((res.message == 'no-session' || res.message == 'invalid-session') && u.data) {
      removeUser()
      setNotification(
        'Session expired',
        'Your session has expired, please log in again to save your data!',
        'error'
      )
    } else {
      setNotification(
        'Error', 
        'There was an error updating your score, please refresh.', 
        'error'
      )
    }

    return
  }

  return {
    word,
    points: pointsFromWord
  }
}

export const activateWordPreviews = async () => {
  currentScore.update(c => {
    if(c.loading || !c.data) return c

    const u = get(user);

    if(!u.data) {
      notifyNeedAccount()
      return c
    }

    (async () => {
      const res = await request<ActivateWordPreviewsRequest, ActivateWordPreviewsResponse>(
        'score/activate_word_previews',
        'POST',
        { scoreId: c.data!.id }
      )

      if(!res.success) {
        setNotification(
          'Failed to update database',
          'Please refresh the page and try again.',
          'error'
        )
      }
    })()
    
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
export const getHint = async (callback: (hint: string) => void) => {
  const score = get(currentScore)
  const puzzle = get(currentPuzzle)
  const u = get(user)

  if(u.loading || !u.data) {
    return notifyNeedAccount()
  }

  if(puzzle.loading || !puzzle.data || score.loading || !score.data) {
    return
  } 
  
  const { wordList } = puzzle.data
  const { wordsFound, hint } = score.data

  if(hint) return callback(hint.word.slice(0, hint.lettersGiven))

  // User has found all the words
  if(wordList.length == wordsFound.length) return

  let availableIndexes: number[] = []
  wordList.forEach((w, index) => {
    if(!wordsFound.find(n => n.word == w)) availableIndexes.push(index)
  })

  const hintIndex = availableIndexes[Math.floor(Math.random() * availableIndexes.length)]
  let hintWord = wordList[hintIndex]

  const newHint: Hint = {
    word: hintWord,
    lettersGiven: 3
  }

  callback(hintWord.slice(0, 3))

  currentScore.update(c => {
    // Shouldn't be possible from checks above, but it stops TS from yelling at me
    if(c.loading || !c.data) return c

    return {
      ...c,
      data: {
        ...c.data,
        hint: newHint
      }
    }
  })

  const res = await request<SetHintRequest, SetHintResponse>(
    'score/set_hint',
    'POST',
    { scoreId: score.data.id, hint: newHint }
  )
}

export default currentScore