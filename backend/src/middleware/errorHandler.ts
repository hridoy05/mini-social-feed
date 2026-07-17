import { Request, Response, NextFunction } from 'express';
import { HttpError } from '../errors/HttpError';

// Central error handler — every thrown error lands here.
export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof HttpError) {
    res.status(err.statusCode).json({
      error: err.name,       
      message: err.message,
    });
    return;
  }

  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'InternalServerError',
    message: 'Something went wrong',
  });
}
