import { ObjectId } from "mongodb"

// Representation of one Spelling Bee puzzle
export default interface Puzzle {
  _id: ObjectId
  centerLetter: string
  outsideLetters: OutsideLetters
  wordList: string[]
  maxPoints: number
  date: string
}

export type OutsideLetters = [string, string, string, string, string, string]