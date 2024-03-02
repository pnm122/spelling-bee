import Score from "../db/interfaces/Score"

export default interface UserResponse {
  username: string
  email: string
  pastScores: Score[]
}

export interface LoginRequest {
  username: string,
  password: string
}

export interface SignupRequest {
  username: string,
  password: string
}