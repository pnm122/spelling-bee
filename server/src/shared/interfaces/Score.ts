import Score, { Hint } from "../../db/interfaces/Score";
import ForClient from "./util";

type ClientScore = ForClient<Omit<Score, 'puzzleId' | 'userId'> & { puzzleId: string, userId: string }>
type HintClient = Hint

export { HintClient as Hint }
export default ClientScore