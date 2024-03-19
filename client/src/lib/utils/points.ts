import type Puzzle from "$backend_interfaces/Puzzle";

export const PANGRAM_POINTS = 5

/** 
* Get the point value of a word. Equals the length of the word + PANGRAM_POINTS if the word is a pangram
* @param {string} word - Word to get value of
* @return {number} Word's point value
*/
export function getPointsFromWord(word: string): number {
  let points = word.length
  if(isPangram(word)) points += PANGRAM_POINTS
  return points
}

/** 
* Get the point value of all words in a list
* @param {string[]} wordList
* @return {number} Total point value
*/
export function getTotalPoints(wordList: string[]): number {
  let total = 0
  wordList.forEach(w => total += getPointsFromWord(w))
  return total
}

/** 
* Determine whether a word is a pangram
* @summary In this context, pangram means a word that has 7 unique letters, since each puzzle's "vocabulary" is 7 letters
* @param {string} word
* @return {boolean}
*/
export function isPangram(word: string): boolean {
  let lettersSeen: string[] = []
  for(let letter of word) {
    if(!lettersSeen.includes(letter)) lettersSeen.push(letter)
  }

  if(lettersSeen.length == 7) return true
  
  return false
}