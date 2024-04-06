import Session from "../../db/interfaces/Session"
import UserResponse from "./User"
import Puzzle from "./Puzzle"
import ClientScore from "./Score"
import DBPuzzle from "../../db/interfaces/Puzzle"
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
  | 'no-puzzle' // Attempted to fetch a puzzle that doesn't exist
  | 'user-info-not-provided' // Attempted to login without providing username/password/both
  | 'unknown-error' // A catch-all for non-specific errors
  | 'invalid-user-id' // Tried to get a user from the database that doesn't exist
  | 'user-info-incorrect' // A user tried to log in, but the username or password was incorrect
  | 'user-exists' // A user tried to sign up, but the username already exists
  | 'failed-to-create-session' // When logging in, a user is created but creating a session failed
  | 'invalid-session' // Requested session doesn't exist (most likely session expired)
  | 'no-session' // Client requested a resource that requires a session without having one
  | 'no-score' // Client requested a score that doesn't exist

export type WithUnknown<T extends ErrorTypes> = T | 'unknown-error'
// Utility type to force generic passed in to be one of the specified error types
// Probably overkill since the values will get checked later anyways, but I like autocomplete :)
export type AsErrorType<T extends ErrorTypes> = T

// TYPES EXTENDING ErrorTypes
// ============================================================

export type CreateUserErrors =              WithUnknown<'user-exists'>
export type GetUserUtilityErrors =          WithUnknown<'invalid-user-id'>
export type ValidateUserCredentialsErrors = WithUnknown<'user-info-incorrect'>
export type AddWordToUserErrors =           WithUnknown<'invalid-user-id'>

export type CreateSessionErrors = AsErrorType<'failed-to-create-session'>
export type UpdateSessionErrors = WithUnknown<'invalid-session'>
export type DeleteSessionErrors = WithUnknown<'invalid-session'>
export type GetSessionErrors =    WithUnknown<'invalid-session'>

// I really like this type declaration because it directly models what the code does
// i.e. the login route validates a user and creates a session + has its own error checking
// These types tell you exactly what the potential sources of error are
export type SignUpErrors = AsErrorType<'user-info-not-provided'> | CreateUserErrors | CreateSessionErrors
export type LoginErrors =  AsErrorType<'user-info-not-provided'> | ValidateUserCredentialsErrors | CreateSessionErrors
export type LogoutErrors = WithUnknown<'no-session'> | DeleteSessionErrors
export type ValidateErrors = AuthenticatedErrors
export type GetUserErrors = AuthenticatedErrors | GetUserUtilityErrors

export type AuthenticatedErrors = AsErrorType<'no-session'> | UpdateSessionErrors

export type GetPuzzleErrors = WithUnknown<'no-puzzle'>
export type DailyPuzzleErrors = WithUnknown<'no-puzzle'>

export type GetOrCreateScoreErrors = WithUnknown<'no-puzzle'> | GetPuzzleUtilityErrors

export type GetCurrentUserScoreErrors = GetOrCreateScoreErrors
export type UpdateScoreUtilityErrors = WithUnknown<'no-score'>
export type AddWordUtilityErrors = WithUnknown<'no-score'>

export type GetPuzzleUtilityErrors = WithUnknown<'no-puzzle'>

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

export type GetPuzzleData = { puzzle: Puzzle }
export type DailyPuzzleData = { puzzle: Puzzle }

export type GetCurrentUserScoreData = { score: ClientScore }

export type GetPuzzleUtilityData = { puzzle: DBPuzzle }

// ============================================================

// FULL, COMBINED RESPONSE TYPES
// ============================================================

export type GetCurrentUserScoreResponse = SuccessResponse<GetCurrentUserScoreData> | ErrorResponse<GetCurrentUserScoreErrors>
export type GetOrCreateScoreResponse = SuccessResponse<{score: Score}> | ErrorResponse<GetOrCreateScoreErrors>
export type UpdateScoreUtilityResponse = SuccessResponse | ErrorResponse<UpdateScoreUtilityErrors>
export type AddWordUtilityResponse = SuccessResponse | ErrorResponse<AddWordUtilityErrors>

export type AddWordResponse = AddWordUtilityResponse | AddWordToUserResponse

export type GetPuzzleUtilityResponse = SuccessResponse<GetPuzzleUtilityData> | ErrorResponse<GetPuzzleUtilityErrors>

export type AddWordToUserResponse = SuccessResponse | ErrorResponse<AddWordToUserErrors>

// ============================================================