import { NextFunction, Request, Response } from 'express';

import { ErrorResponse } from './interfaces/Response';
import { updateSession } from './db/utils/sessions';

export function notFound(req: Request, res: Response, next: NextFunction) {
  res.status(404);
  const error = new Error(`Not Found - ${req.originalUrl}`);
  next(error);
}

export function errorHandler(err: Error, req: Request, res: Response<ErrorResponse>, next: NextFunction) {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode);
  res.json({
    success: false,
    // Probably a better way for handling this with typescript,
    // but I'm going with this for now
    // @ts-ignore
    message: err.message,
  });
}
/** 
* Check if the user is authenticated. Updates the user's session from the request cookie if it exists,
* otherwise responds to the client with a 401 not authenticated
*/
export async function authenticated(req: Request, res: Response<ErrorResponse>, next: NextFunction) {
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

  // Should refresh the cookie's expiration time, though I'm honestly not sure
  res.cookie('session', sessionId)
  next()
}
