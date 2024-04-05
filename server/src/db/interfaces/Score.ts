import { ObjectId } from "mongodb";

// A user's score and relevant metadata
export default interface Score {
  _id: ObjectId
  // Words the user has found
  wordsFound: UserWordFound[]
  // Total points earned from puzzle
  points: number
  // User's current hint, if they've taken one
  hint?: Hint
  // Whether the user has turned on word previews or not
  wordPreviewsOn: boolean
  // Id of the puzzle this data refers to
  puzzleId: ObjectId
  // Id of the user this data refers to
  userId: ObjectId
}

export interface UserWordFound {
  word: string
  points: number
}

export interface Hint {
  word: string
  lettersGiven: number
}