import { ObjectId } from "mongodb"
import Puzzle from "./Puzzle"
import User from "./User"

export default interface Score {
  score: number
  maxPossibleScore: number
  wordsFound: string[]
  date: string
  puzzleId: ObjectId
  userId: ObjectId
}