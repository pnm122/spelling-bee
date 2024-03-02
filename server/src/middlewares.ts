import { NextFunction, Request, Response } from 'express';

import { ErrorResponse } from './interfaces/Response';

export function notFound(req: Request, res: Response, next: NextFunction) {
  res.status(404);
  const error = new Error(`🔍 - Not Found - ${req.originalUrl}`);
  next(error);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
