import { WithoutId } from "mongodb"
import Session from "../db/interfaces/Session"

// Interface for success and error responses
export interface Response {
  success: boolean,
  message?: string
}

export interface SuccessResponse<T = any> extends Response {
  success: true
  message?: string
  data?: T
}

export interface ErrorResponse<T extends ErrorTypes> extends Response {
  success: false,
  message: T
}

export type ErrorTypes = 
  | 'no-puzzle' // Attempted to fetch a puzzle that doesn't exist
  | 'user-info-not-provided' // Attempted to login without providing username/password/both
  | 'unknown-error' // A catch-all for non-specific errors
  | 'user-info-incorrect' // A user tried to log in, but the username or password was incorrect
  | 'user-exists' // A user tried to sign up, but the username already exists
  | 'failed-to-create-session' // When logging in, a user is created but creating a session failed
  | 'invalid-session' // Requested session doesn't exist (most likely session expired)
  | 'no-session' // Client requested a resource that requires a session without having one

export type WithUnknown<T extends ErrorTypes> = T | 'unknown-error'
// Utility type to force generic passed in to be one of the specified error types
// Probably overkill since the values will get checked later anyways, but I like autocomplete :)
export type AsErrorType<T extends ErrorTypes> = T

// TYPES EXTENDING ErrorTypes
// ============================================================

export type CreateUserErrors =              WithUnknown<'user-exists'>
export type ValidateUserCredentialsErrors = WithUnknown<'user-info-incorrect'>

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

export type AuthenticatedErrors = AsErrorType<'no-session'> | UpdateSessionErrors

// ============================================================

export interface ValidateResponseData {
  user: {
    id: string,
    username: string
  }
}