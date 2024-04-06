import { ObjectId } from "mongodb";

export default interface User {
  _id: ObjectId,
  username: string,
  password: string,
  stats: {
    points: number,
    words_found: number,
    pangrams: number,
    puzzles_played: number
    puzzles_solved: number
    longest_word: string
  }
}