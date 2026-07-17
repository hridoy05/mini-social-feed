import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { UnauthorizedError } from '../errors/HttpError';

// Augment Express's Request type globally so req.userId is typed.
declare global {
  namespace Express {
    interface Request { userId?: string; }
  }
}

export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    throw new UnauthorizedError('Missing bearer token');
  }

  try {
    const { id } = verifyToken(header.slice(7));
    req.userId = id;
    next();
  } catch {
    throw new UnauthorizedError('Invalid or expired token');
  }
}
