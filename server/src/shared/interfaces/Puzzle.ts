import DBPuzzle, { DBPuzzlePreview } from "../../db/interfaces/Puzzle"
import ForClient from "./util"

type Puzzle = ForClient<DBPuzzle>
export type PuzzlePreview = ForClient<DBPuzzlePreview>

export default Puzzle