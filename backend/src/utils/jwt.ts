import jwt, { SignOptions } from 'jsonwebtoken';

export type JwtPayload = { id: string };

const SECRET  = process.env.JWT_SECRET  || 'dev_secret_change_me';
const EXPIRES = (process.env.JWT_EXPIRES || '7d') as SignOptions['expiresIn'];

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, SECRET, { expiresIn: EXPIRES });
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, SECRET) as JwtPayload;
}
