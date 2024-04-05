import Session from "../../db/interfaces/Session";
import ClientScore from "./Score";

export type WithSession<T = {}> = T & { session: Session }

// Require ID for updating score, and keep everything else optional
export type UpdateScoreData = Partial<Pick<ClientScore, 'hint' | 'points' | 'wordPreviewsOn' | 'wordsFound'>>
export type UpdateScoreRequest = { data: UpdateScoreData } & { id: string }
export type GetCurrentUserScoreRequest = Pick<ClientScore, 'puzzleId'>
export type GetScoreRequest = Pick<ClientScore, 'puzzleId' | 'userId'>