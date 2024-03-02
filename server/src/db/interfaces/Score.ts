import { ObjectId } from "mongodb"
import Puzzle from "./Puzzle"
import User from "../../interfaces/User"

export default interface Score {
  _id: ObjectId
  score: number
  maxPossibleScore: number
  wordsFound: string[]
  date: string
  puzzleId: ObjectId
  userId: ObjectId
}