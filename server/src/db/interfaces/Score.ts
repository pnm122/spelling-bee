import { ObjectId } from "mongodb"

export default interface Score {
  _id: ObjectId
  score: number
  maxPossibleScore: number
  wordsFound: string[]
  date: string
  puzzleId: ObjectId
  userId: ObjectId
}