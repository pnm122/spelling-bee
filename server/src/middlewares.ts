import { NextFunction, Request, Response } from 'express';

import { AuthenticatedErrors, ErrorResponse } from './shared/interfaces/Response';
import { updateSession } from './db/utils/sessions';
import Session from './db/interfaces/Session';

export function notFound(req: Request, res: Response, next: NextFunction) {
  res.status(404);
  const error = new Error(`Not Found - ${req.originalUrl}`);
  next(error);
}

export function errorHandler(err: Error, req: Request, res: Response<ErrorResponse<any>>, next: NextFunction) {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode);
  res.json({
    success: false,
    message: err.message,
  });
}
/** 
* Check if the user is authenticated. Updates the user's session from the request cookie if it exists,
* otherwise responds to the client with a 401 not authenticated
*/
export async function authenticated(req: Request, res: Response<ErrorResponse<AuthenticatedErrors>>, next: NextFunction) {
  const sessionId = req.cookies['session']

  if(!sessionId) {
    return res.status(401).json({
      success: false,
      message: 'no-session'
    })
  }
  
  const updateRes = await updateSession(sessionId)

  if(!updateRes.success) {
    if(updateRes.message == 'invalid-session') {
      return res.status(401).json(updateRes)
    }

    return res.status(500).json(updateRes)
  }

  // Refresh the expiration time for the session cookie
  // * 1000 because maxAge is in ms, but SESSION_EXPIRE_TIME is in seconds
  res.cookie('session', sessionId, { maxAge: parseInt(process.env.SESSION_EXPIRE_TIME!) * 1000 })
  // Store session information for later use
  req.body.session = updateRes.data.session as Session
  next()
}
