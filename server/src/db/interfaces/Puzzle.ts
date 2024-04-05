import { ObjectId } from "mongodb"

// Representation of one Spelling Bee puzzle
export default interface Puzzle {
  _id: ObjectId
  centerLetter: string
  outsideLetters: [string, string, string, string, string, string]
  wordList: string[]
  maxPoints: number
  date: string
}