// Utility functions for the Users collection

import { LoginRequest, SignupRequest } from "../../shared/interfaces/User";
import bcrypt from 'bcrypt'
import getDb from "../conn";
import User from "../interfaces/User";
import { CreateUserData, CreateUserErrors, ErrorResponse, GetUserErrors, GetUserUtilityData, GetUserUtilityErrors, SuccessResponse, ValidateUtilityData, ValidateUserCredentialsErrors } from "../../shared/interfaces/Response";
import { ObjectId, WithoutId } from "mongodb";

/** 
* Create a user in the Users collection, hashing and salting the given password
* @param {Object} params
* @param {string} params.username - User's username
* @param {string} params.password - Raw password string
* @return {Promise<SuccessResponse<{insertedId: string}> | ErrorResponse<CreateUserErrors>>} Details whether the function was successful or not. Fails if username already exists
*/
export async function createUser({
  username,
  password
}: SignupRequest): Promise<
  SuccessResponse<CreateUserData> | 
  ErrorResponse<CreateUserErrors>> {
  // Create encrypted password for database
  const saltRounds = parseInt(process.env.SALT_ROUNDS!)
  const hashedPassword = await bcrypt.hash(password, saltRounds)

  try {
    const db = await getDb()

    const u = await db.collection('Users').findOne({
      username: username
    })

    if(u != null) {
      return {
        success: false,
        message: 'user-exists'
      }
    }

    const newUserWithoutId: WithoutId<User> = {
      username: username,
      password: hashedPassword,
      stats: {
        points: 0,
        words_found: 0,
        pangrams: 0,
        puzzles_played: 0,
        puzzles_solved: 0,
        longest_word: {
          word: '',
          length: 0
        }
      }
    }

    const insertedUser = await db.collection<WithoutId<User>>('Users')
                                 .insertOne(newUserWithoutId)

    // MongoDB automatically adds _id field apparently
    let newUserWithId = newUserWithoutId as User

    const { password, _id, ...userResponse } = newUserWithId

    return {
      success: true,
      message: "User successfully added to database",
      data: {
        user: {
          ...userResponse,
          id: insertedUser.insertedId.toString()
        }
      }
    }
  } catch(e) {
    return {
      success: false,
      message: 'unknown-error'
    }
  }
}

/** 
* Get a user from the Users collection, given their ID. Returns all fields except their password
* @param {Object} params
* @param {string} params.userId
* @return {Promise<SuccessResponse<GetUserUtilityData> | ErrorResponse<GetUserUtilityErrors>>} Details whether the function was successful or not. Fails if userId isn't found
*/
export async function getUser(
  userId: string
): Promise<
  SuccessResponse<GetUserUtilityData> | 
  ErrorResponse<GetUserUtilityErrors>> {
  try {
    const db = await getDb()

    const u = await db.collection<User>('Users').findOne({
      _id: new ObjectId(userId)
    })

    if(u == null) {
      return {
        success: false,
        message: 'invalid-user-id'
      }
    }

    // Omit password from return
    const { password, _id, ...user } = u

    return {
      success: true,
      data: {
        user: {
          ...user,
          id: _id.toString()
        }
      }
    }
  } catch(e) {
    return {
      success: false,
      message: 'unknown-error'
    }
  }
}

/** 
* Check if the given username + password combo exists in the Users collection
* @param {Object} params
* @param {string} params.username - User's username
* @param {string} params.password - Raw password string
* @return {Promise<SuccessResponse<ValidateUtilityData> | ErrorResponse<ValidateUserCredentialsErrors>>} Details whether the function was successful or not; SuccessResponse data contains user ID
*/
export async function validateUserCredentials({
  username,
  password
}: LoginRequest): Promise<SuccessResponse<ValidateUtilityData> | ErrorResponse<ValidateUserCredentialsErrors>> {
  try {
    const db = await getDb()
    const user = await db.collection<User>('Users').findOne({
      username: username
    })

    if(!user) {
      return {
        success: false,
        message: 'user-info-incorrect'
      }
    }

    const match = await bcrypt.compare(password, user.password)

    if(match) {
      const { _id, password, ...userRes } = user

      return {
        success: true,
        data: {
          user: {
            ...userRes,
            id: _id.toString()
          }
        }
      }
    } else {
      return {
        success: false,
        message: 'user-info-incorrect'
      }
    }
  } catch(e) {
    return {
      success: false,
      message: 'unknown-error'
    }
  }
}