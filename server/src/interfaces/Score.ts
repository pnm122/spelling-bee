import Puzzle from "./Puzzle"
import User from "./User"

export default interface Score {
  score: number
  maxPossibleScore: number
  wordsFound: string[]
  date: string
  puzzle: Puzzle
  user: User
}