import Session from "../../db/interfaces/Session"
import UserResponse from "./User"
import Puzzle, { PuzzlePreview } from "./Puzzle"
import ClientScore, { LeaderboardScore } from "./Score"
import DBPuzzle, { DBPuzzlePreview } from "../../db/interfaces/Puzzle"
import Score from "../../db/interfaces/Score"

// Interface for success and error responses
export interface Response {
  success: boolean,
  message?: string
}

export type SuccessResponse<T = undefined> = T extends undefined ? SuccessResponseWithoutData : SuccessResponseWithData<T>

// Define interfaces for different cases
interface SuccessResponseWithoutData extends Response {
  success: true;
  message?: string;
}

interface SuccessResponseWithData<T> extends Response {
  success: true;
  message?: string;
  data: T;
}

export interface ErrorResponse<T extends ErrorTypes> extends Response {
  success: false,
  message: T
}

export type ErrorTypes = 
  | 'unknown-error' // A catch-all for non-specific errors
  | 'no-puzzle' // Attempted to fetch a puzzle/data relating to a puzzle that doesn't exist
  | 'user-info-not-provided' // Attempted to login without providing username/password/both
  | 'invalid-username' // User tried to login/signup with an invalid username
  | 'invalid-password' // User tried to login/signup with an invalid password
  | 'invalid-user-id' // Tried to get a user from the database that doesn't exist
  | 'user-info-incorrect' // A user tried to log in, but the username or password was incorrect
  | 'user-exists' // A user tried to sign up, but the username already exists
  | 'failed-to-create-session' // When logging in, a user is created but creating a session failed
  | 'invalid-session' // Requested session doesn't exist (most likely session expired)
  | 'no-session' // Client requested a resource that requires a session without having one
  | 'no-score' // Client requested a score that doesn't exist
  | 'invalid-hint' // Client requested to update a user's hint, but the hint provided is invalid
  | 'invalid-puzzle' // Attempted to insert an invalid puzzle to the database
  | 'failed-to-create-puzzle' // Daily puzzle didn't exist, and the server failed to create a new puzzle

export type WithUnknown<T extends ErrorTypes> = T | 'unknown-error'
// Utility type to force generic passed in to be one of the specified error types
// Probably overkill since the values will get checked later anyways, but I like autocomplete :)
export type AsErrorType<T extends ErrorTypes> = T

// TYPES EXTENDING ErrorTypes
// ============================================================

export type CreateUserErrors =              WithUnknown<'user-exists'>
export type GetUserUtilityErrors =          WithUnknown<'invalid-user-id'>
export type ValidateUserCredentialsErrors = WithUnknown<'user-info-incorrect'>
export type AddWordToUserErrors =           WithUnknown<'invalid-user-id' | 'no-puzzle'>

export type CreateSessionErrors = AsErrorType<'failed-to-create-session'>
export type UpdateSessionErrors = WithUnknown<'invalid-session'>
export type DeleteSessionErrors = WithUnknown<'invalid-session'>
export type GetSessionErrors =    WithUnknown<'invalid-session'>

// I really like this type declaration because it directly models what the code does
// i.e. the login route validates a user and creates a session + has its own error checking
// These types tell you exactly what the potential sources of error are
export type SignUpErrors = AsErrorType<'user-info-not-provided' | 'invalid-password' | 'invalid-username'> | CreateUserErrors | CreateSessionErrors
export type LoginErrors =  AsErrorType<'user-info-not-provided' | 'invalid-password' | 'invalid-username'> | ValidateUserCredentialsErrors | CreateSessionErrors
export type LogoutErrors = WithUnknown<'no-session'> | DeleteSessionErrors
export type ValidateErrors = AuthenticatedErrors
export type GetUserErrors = AuthenticatedErrors | GetUserUtilityErrors

export type AuthenticatedErrors = AsErrorType<'no-session'> | UpdateSessionErrors

export type GetPuzzleErrors = WithUnknown<'no-puzzle'>
export type DailyPuzzleErrors = AsErrorType<'failed-to-create-puzzle'>

export type GetOrCreateScoreErrors = WithUnknown<'no-puzzle'> | GetPuzzleUtilityErrors

export type GetCurrentUserScoreErrors = GetOrCreateScoreErrors
export type UpdateScoreUtilityErrors = WithUnknown<'no-score'>
export type AddWordUtilityErrors = WithUnknown<'no-score'>
export type PuzzleLeaderboardErrors = PuzzleLeaderboardUtilityErrors

export type GetPuzzleUtilityErrors = WithUnknown<'no-puzzle'>
export type InsertPuzzleErrors = WithUnknown<'invalid-puzzle'>
export type IncrementPuzzlesPlayedErrors = WithUnknown<'invalid-user-id'>
export type ActivateWordPreviewsUtilityErrors = UpdateScoreUtilityErrors
export type ActivateWordPreviewsErrors = ActivateWordPreviewsUtilityErrors
export type SetHintUtilityErrors = UpdateScoreUtilityErrors
export type SetHintErrors = AsErrorType<'invalid-hint'>
export type AllPuzzlesUtilityErrors = AsErrorType<'unknown-error'>
export type AllPuzzlesErrors = AllPuzzlesUtilityErrors
export type PuzzleLeaderboardUtilityErrors = WithUnknown<'no-puzzle'>

// ============================================================

// SUCCESS DATA TYPES
// ============================================================

export type GetUserUtilityData = { user: UserResponse }
export type ValidateUtilityData = { user: UserResponse }

export type GetUserData = GetUserUtilityData
export type CreateUserData = { user: UserResponse }

export type SignUpData = { user: UserResponse }
export type LogInData = { user: UserResponse }
export type ValidateData = { userId: string }

export type UpdateSessionData = { session: Session }
export type GetSessionData = { session: Session }

export type DailyPuzzleData = { puzzle: Puzzle }

export type GetCurrentUserScoreData = { score: ClientScore }
export type GetOrCreateScoreData = { score: Score, created: boolean }
export type AddWordUtilityData = { score: Score }
export type PuzzleLeaderboardData = PuzzleLeaderboardUtilityData

export type GetPuzzleUtilityData = { puzzle: DBPuzzle }
export type GetPuzzleData = { puzzle: Puzzle }
export type InsertPuzzleData = { puzzle: DBPuzzle }
export type AllPuzzlesUtilityData = { puzzles: DBPuzzlePreview[] }
export type AllPuzzlesData = { puzzles: PuzzlePreview[] }
export type PuzzleLeaderboardUtilityData = { scores: LeaderboardScore[] }

// ============================================================

// FULL, COMBINED RESPONSE TYPES
// ============================================================

export type AuthenticatedResponse = ErrorResponse<AuthenticatedErrors>

export type GetUserUtilityResponse = SuccessResponse<GetUserUtilityData> | ErrorResponse<GetUserUtilityErrors>
export type GetCurrentUserScoreResponse = GetUserUtilityResponse | SuccessResponse<GetCurrentUserScoreData> | ErrorResponse<GetCurrentUserScoreErrors>
export type GetOrCreateScoreResponse = SuccessResponse<GetOrCreateScoreData> | ErrorResponse<GetOrCreateScoreErrors>
export type UpdateScoreUtilityResponse = SuccessResponse | ErrorResponse<UpdateScoreUtilityErrors>
export type AddWordUtilityResponse = SuccessResponse<AddWordUtilityData> | ErrorResponse<AddWordUtilityErrors>
export type PuzzleLeaderboardUtilityResponse = SuccessResponse<PuzzleLeaderboardUtilityData> | ErrorResponse<PuzzleLeaderboardUtilityErrors>
export type PuzzleLeaderboardResponse = PuzzleLeaderboardUtilityResponse

export type AddWordResponse = AddWordUtilityResponse | AddWordToUserResponse | AuthenticatedResponse

export type GetPuzzleUtilityResponse = SuccessResponse<GetPuzzleUtilityData> | ErrorResponse<GetPuzzleUtilityErrors>
export type InsertPuzzleResponse = SuccessResponse<InsertPuzzleData> | ErrorResponse<InsertPuzzleErrors>
export type AllPuzzlesUtilityResponse = SuccessResponse<AllPuzzlesUtilityData> | ErrorResponse<AllPuzzlesUtilityErrors>
export type AllPuzzlesResponse = SuccessResponse<AllPuzzlesData> | ErrorResponse<'unknown-error'> | AuthenticatedResponse
export type GetPuzzleResponse = SuccessResponse<GetPuzzleData> | ErrorResponse<GetPuzzleUtilityErrors> | AuthenticatedResponse

export type AddWordToUserResponse = SuccessResponse | ErrorResponse<AddWordToUserErrors>
export type IncrementPuzzlesPlayedResponse = SuccessResponse | ErrorResponse<IncrementPuzzlesPlayedErrors>
export type ActivateWordPreviewsUtilityResponse = SuccessResponse | ErrorResponse<ActivateWordPreviewsUtilityErrors>
export type ActivateWordPreviewsResponse = SuccessResponse | ErrorResponse<ActivateWordPreviewsErrors> | AuthenticatedResponse
export type SetHintUtilityResponse = SuccessResponse | ErrorResponse<SetHintUtilityErrors>
export type SetHintResponse = SetHintUtilityResponse | ErrorResponse<SetHintErrors>

// ============================================================