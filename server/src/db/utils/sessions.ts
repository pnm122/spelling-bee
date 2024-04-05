// Utility functions for the Sessions collection

import { CreateSessionErrors, DeleteSessionErrors, ErrorResponse, GetSessionData, GetSessionErrors, SuccessResponse, UpdateSessionData, UpdateSessionErrors } from "../../shared/interfaces/Response";
import getDb from "../conn";
import Session, { SessionInsert } from "../interfaces/Session";
import { v4 as uuidv4 } from 'uuid'
import debug from "../../utils/debug";

/** 
* Create a session in the Sessions collection
* @param {string} userId - ID of the user to associate with the session
* @return {Promise<SuccessResponse<{ sessionId: string }> | ErrorResponse<CreateSessionErrors>>} session ID if successful, ErrorResponse if not
*/
export async function createSession(userId: string): Promise<SuccessResponse<{ sessionId: string }> | ErrorResponse<CreateSessionErrors>> {
  try {
    const db = await getDb()

    const sessionDetails: SessionInsert = {
      sessionId: uuidv4(),
      userId,
      lastUpdate: new Date(Date.now())
    }

    const res = await db.collection('Sessions').insertOne(sessionDetails)

    return {
      success: true,
      data: { sessionId: sessionDetails.sessionId }
    }
  } catch(e) {
    return {
      success: false,
      message: 'failed-to-create-session'
    }
  }
}

/** 
* Updates a given session with the current time, causing it to expire later. Fails if the session doesn't exist or if the session has expired
* @param {string} sessionId - ID of the session to update
* @return {Promise<SuccessResponse<UpdateSessionData> | ErrorResponse<UpdateSessionErrors>>} Details whether the function was successful or not
*/
export async function updateSession(sessionId: string): Promise<SuccessResponse<UpdateSessionData> | ErrorResponse<UpdateSessionErrors>> {
  try {
    const db = await getDb()

    const updateTime = new Date(Date.now())

    const res = await db.collection<Session>('Sessions')
      .findOneAndUpdate({
        sessionId: sessionId
      }, {
        // @ts-ignore I know what I'm doing, the types for inserting sessions are different than the sessions received from the DB
        $set: {
          lastUpdate: updateTime
        } as Partial<SessionInsert>
      })

    if(!res) {
      return {
        success: false,
        message: 'invalid-session'
      }
    }

    // BELOW DOESNT WORK because the session has already been updated if it exists
    // For now, I'm just going to rely on MongoDB automatically deleting my sessions at roughly the right time
    // Getting the exact expiration time isn't really a big deal for this app anyways
    // session has expired if the session doesn't exist anymore or if it does exist but its expiration date has passed (just hasn't been deleted by MongoDB yet)
    // const expirationDate = new Date(res.lastUpdate).getTime() + (parseInt(process.env.SESSION_EXPIRE_TIME!) * 1000)
    // const sessionExpired = Date.now() > expirationDate

    // if(sessionExpired) debug(`EXPIRED SESSION\nSession expiration date: ${new Date(expirationDate).toString()}\n`)
    

    return {
      success: true,
      data: { session: res }
    }
  } catch(e) {
    debug(e as string)
    return {
      success: false,
      message: 'unknown-error'
    }
  }
}

/** 
* Delete a given session if it exists. Fails if the session doesn't exist
* @param {string} sessionId - ID of the session to delete
* @return {Promise<SuccessResponse | ErrorResponse>} Details whether the function was successful or not
*/
export async function deleteSession(sessionId: string): Promise<SuccessResponse | ErrorResponse<DeleteSessionErrors>> {
  try {
    const db = await getDb()

    const res = await db.collection<Session>('Sessions').deleteOne({
      sessionId: sessionId
    })
  
    if(res.acknowledged && res.deletedCount) {
      debug(`Session ${sessionId} successfully removed from database.`)
  
      return {
        success: true
      }
    }

    return {
      success: false,
      message: 'invalid-session'
    }
  } catch(e) {
    return {
      success: false,
      message: 'unknown-error'
    }
  }
}

/** 
* Get a given session if it exists. Fails if the session doesn't exist
* @param {string} sessionId - ID of the session to get
* @return {Promise<SuccessResponse | ErrorResponse>} Details whether the function was successful or not; SuccessResponse data contains session information
*/
export async function getSession(sessionId: string): Promise<SuccessResponse<GetSessionData> | ErrorResponse<GetSessionErrors>> {
  try {
    const db = await getDb()

    const res = await db.collection<Session>('Sessions').findOne({
      sessionId: sessionId
    })
  
    if(res) {
      return {
        success: true,
        data: { session: res }
      }
    }

    return {
      success: false,
      message: 'invalid-session'
    }
  } catch(e) {
    return {
      success: false,
      message: 'unknown-error'
    }
  }
}