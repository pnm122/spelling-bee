// Representation of one Spelling Bee puzzle
export default interface Puzzle {
  centerLetter: string
  outsideLetters: [string, string, string, string, string, string]
  wordList: string[]
  date: string
}