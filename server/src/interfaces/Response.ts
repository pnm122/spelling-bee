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

export interface ErrorResponse extends Response {
  success: false,
  message: ErrorTypes
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

export interface ValidateResponseData {
  user: {
    id: string,
    username: string
  }
}