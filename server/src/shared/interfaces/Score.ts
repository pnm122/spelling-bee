import Score, { Hint, UserWordFound } from "../../db/interfaces/Score";
import ForClient from "./util";

type ClientScore = ForClient<Omit<Score, 'puzzleId' | 'userId'> & { puzzleId: string, userId: string }>
type ClientUserWordFound = UserWordFound
type HintClient = Hint
export type LeaderboardScore = {
  id: string,
  username: string,
  userId: string,
  points: number
}

export { HintClient as Hint }
export { ClientUserWordFound as UserWordFound }
export default ClientScore