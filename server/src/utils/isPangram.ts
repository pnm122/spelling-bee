/** 
* Determine whether a word is a pangram
* @summary In this context, pangram means a word that has 7 unique letters, since each puzzle's "vocabulary" is 7 letters
* @param {string} word
* @return {boolean}
*/
export default function isPangram(word: string): boolean {
  let lettersSeen: string[] = []
  for(let letter of word) {
    if(!lettersSeen.includes(letter)) lettersSeen.push(letter)
  }

  if(lettersSeen.length == 7) return true
  
  return false
}