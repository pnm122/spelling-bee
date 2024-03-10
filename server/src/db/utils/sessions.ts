// Utility functions for the Sessions collection

import { WithoutId } from "mongodb";
import { ErrorResponse, SuccessResponse } from "../../interfaces/Response";
import getDb from "../conn";
import Session, { SessionInsert } from "../interfaces/Session";
import { v4 as uuidv4 } from 'uuid'
import debug from "../../utils/debug";

/** 
* Create a session in the Sessions collection
* @return {Promise<string | ErrorResponse>} session ID if successful, ErrorResponse if not
*/
export async function createSession(): Promise<string | ErrorResponse> {
  try {
    const db = await getDb()

    const sessionDetails: SessionInsert = {
      sessionId: uuidv4(),
      lastUpdate: new Date(Date.now())
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

/** 
* Updates a given session with the current time, causing it to expire later. Fails if the session doesn't exist
* @param {string} sessionId - ID of the session to update
* @return {Promise<SuccessResponse | ErrorResponse>} Details whether the function was successful or not
*/
export async function updateSession(sessionId: string): Promise<SuccessResponse | ErrorResponse> {
  try {
    const db = await getDb()

    const updateTime = new Date(Date.now())

    const res = await db.collection('Sessions')
      .updateOne({
        sessionId: sessionId
      }, {
        $set: {
          lastUpdate: updateTime
        } as Partial<SessionInsert>
      })

    if(!res.acknowledged || res.matchedCount == 0) {
      return {
        success: false,
        message: 'invalid-session'
      }
    }

    return {
      success: true
    }
  } catch(e) {
    debug(e as string)
    return {
      success: false,
      message: 'unknown-error'
    }
  }
}

// /** 
// * Delete a given session
// * @param {string} sessionId - ID of the session to delete
// * @return {Promise<SuccessResponse | ErrorResponse>} Details whether the function was successful or not
// */
// export async function deleteSession(sessionId: string): Promise<SuccessResponse | ErrorResponse> {

// }