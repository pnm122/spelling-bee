import { Hint } from "../interfaces/Score"

export const PANGRAM_POINTS = 5
// Multiplier when word previews are on
export const WORD_PREVIEWS_FACTOR = 0.8

/** 
* Get the point value of a word. Equals the length of the word + PANGRAM_POINTS if the word is a pangram
* @param {string} word - Word to get value of
* @return {number} Word's point value
*/
export function getPointsFromWord(word: string, hint: Hint | undefined, wordPreviewsOn: boolean): number {
  let points = 0
  // If the hint letters shown to the user match the start of the word, only give the user points for the difference
  // i.e. displayed hint = 'upp' and word = 'upper', the user gets 2 points
  if(wordMatchesHint(word, hint)) {
    points = word.length - hint!.lettersGiven
  // By default, the number of points you get is equal to the length of the word
  } else {
    points = word.length
  }
  if(isPangram(word)) points += PANGRAM_POINTS
  if(wordPreviewsOn) (points *= WORD_PREVIEWS_FACTOR)
  return Math.round(points)
}

/** 
* Get the point value of all words in a list
* @param {string[]} wordList
* @return {number} Total point value
*/
export function getTotalPoints(wordList: string[]): number {
  let total = 0
  wordList.forEach(w => total += getPointsFromWord(w, undefined, false))
  return total
}

/** 
* Determine whether a word is a pangram
* @summary In this context, pangram means a word that has 7 unique letters, since each puzzle's "vocabulary" is 7 letters
* @param {string} word
* @return {boolean}
*/
export function isPangram(word: string): boolean {
  const letters = getUniqueLetters(word)

  if(letters.length == 7) return true
  
  return false
}

export function getUniqueLetters(word: string): string[] {
  let lettersSeen: string[] = []
  for(let letter of word) {
    if(!lettersSeen.includes(letter)) lettersSeen.push(letter)
  }

  return lettersSeen
}

/** 
* Determine whether a word matches a given hint
* @param {string} word
* @param {Hint} hint
* @return {boolean}
*/
export function wordMatchesHint(word: string, hint: Hint | undefined): boolean {
  return hint != undefined && (word.slice(0, hint.lettersGiven) == hint.word.slice(0, hint.lettersGiven))
}