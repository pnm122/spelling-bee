import Session from "../../db/interfaces/Session";
import ClientScore, { UserWordFound } from "./Score";

export type WithSession<T = {}> = T & { session: Session }

// Require ID for updating score, and keep everything else optional
export type AddWordRequest = { scoreId: string, word: UserWordFound }
export type GetCurrentUserScoreRequest = Pick<ClientScore, 'puzzleId'>
export type GetScoreRequest = Pick<ClientScore, 'puzzleId' | 'userId'>