import Score from "../../db/interfaces/Score";
import ForClient from "./util";

type ScoreResponse = ForClient<Omit<Score, 'puzzleId' | 'userId'> & { puzzleId: string, userId: string }>

export default ScoreResponse