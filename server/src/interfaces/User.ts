import User from "../db/interfaces/User"

// Remove password, replace _id ObjectId with id string
type UserResponse = Omit<User, 'password'|'_id'> & { id: string }

export interface LoginRequest {
  username: string,
  password: string
}

export interface SignupRequest {
  username: string,
  password: string
}

export {UserResponse as default}