// Interface for success and error responses
export interface Response {
  success: boolean,
  message: string
}

export interface SuccessResponse extends Response {
  success: true
}

export interface ErrorResponse extends Response {
  success: false,
  message: 'no-puzzle' | 'user-info-not-provided' | 'unknown-error' | string
}