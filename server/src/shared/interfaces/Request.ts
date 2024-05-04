import Session from "../../db/interfaces/Session";
import ClientScore, { Hint, UserWordFound } from "./Score";

export type WithSession<T = {}> = T & { session: Session }

// Require ID for updating score, and keep everything else optional
export type AddWordRequest = { scoreId: string, word: UserWordFound }
export type GetScoreRequest = Pick<ClientScore, 'puzzleId' | 'userId'>
export type ActivateWordPreviewsRequest = { scoreId: string }
export type SetHintRequest = { scoreId: string, hint?: Hint }