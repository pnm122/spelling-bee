// Utility functions for the Sessions collection

import { ObjectId, WithoutId } from "mongodb";
import { ErrorResponse, SuccessResponse } from "../../interfaces/Response";
import getDb from "../conn";
import Session from "../interfaces/Session";
import { v4 as uuidv4 } from 'uuid'

/** 
* Create a session in the Sessions collection
* @return {Promise<string | ErrorResponse>} session ID if successful, ErrorResponse if not
*/
export async function createSession(): Promise<string | ErrorResponse> {
  try {
    const db = await getDb()

    const sessionDetails: WithoutId<Session> = {
      sessionId: uuidv4(),
      lastUpdate: new Date(Date.now()).toISOString(),
      expiresAfterSeconds: parseInt(process.env.SESSION_EXPIRE_TIME!)
    }

    const res = await db.collection('Sessions').insertOne(sessionDetails)

    return sessionDetails.sessionId
  } catch(e) {
    return {
      success: false,
      message: 'unknown-error'
    }
  }
}

// /** 
// * Updates a given session with the current time, causing it to expire later
// * @param {string} sessionId - ID of the session to update
// * @return {Promise<SuccessResponse | ErrorResponse>} Details whether the function was successful or not
// */
// export async function updateSession(sessionId: string): Promise<SuccessResponse | ErrorResponse> {

// }

// /** 
// * Delete a given session
// * @param {string} sessionId - ID of the session to delete
// * @return {Promise<SuccessResponse | ErrorResponse>} Details whether the function was successful or not
// */
// export async function deleteSession(sessionId: string): Promise<SuccessResponse | ErrorResponse> {

// }