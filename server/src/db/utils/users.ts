// Utility functions for the Users collection

import { LoginRequest, SignupRequest } from "../../interfaces/User";
import bcrypt from 'bcrypt'
import getDb from "../conn";
import User from "../interfaces/User";
import { CreateUserErrors, ErrorResponse, SuccessResponse, ValidateResponseData, ValidateUserCredentialsErrors } from "../../interfaces/Response";

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
  SuccessResponse<{insertedId: string}> | 
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

    const insertedUser = await db.collection('Users').insertOne({
      username: username,
      password: hashedPassword
    })

    return {
      success: true,
      message: "User successfully added to database",
      data: {
        insertedId: insertedUser.insertedId.toString()
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
* @return {Promise<SuccessResponse<ValidateResponseData> | ErrorResponse<ValidateUserCredentialsErrors>>} Details whether the function was successful or not; SuccessResponse data contains user ID
*/
export async function validateUserCredentials({
  username,
  password
}: LoginRequest): Promise<SuccessResponse<ValidateResponseData> | ErrorResponse<ValidateUserCredentialsErrors>> {
  try {
    const db = await getDb()
    const user = await db.collection('Users').findOne({
      username: username
    }) as unknown as User | undefined

    if(!user) {
      return {
        success: false,
        message: 'user-info-incorrect'
      }
    }

    const match = await bcrypt.compare(password, user.password)

    if(match) {
      return {
        success: true,
        data: {
          user: {
            id: user._id.toString(),
            username: user.username
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