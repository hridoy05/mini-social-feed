import bcrypt from 'bcryptjs';
import { userRepository } from '../repositories/userRepository';
import { signToken } from '../utils/jwt';
import { ConflictError, UnauthorizedError } from '../errors/HttpError';

type AuthResult = {
  token: string;
  user: { id: string; username: string; email: string };
};


export async function signup(
  username: string,
  email: string,
  password: string,
): Promise<AuthResult> {
  if (await userRepository.findByEmail(email))
    throw new ConflictError('Email already in use');

  if (await userRepository.findByUsername(username))
    throw new ConflictError('Username already taken');

  const hash = await bcrypt.hash(password, 10);
  const user = await userRepository.create({ username, email, password: hash });

  return {
    token: signToken({ id: user.id }),
    user:  { id: user.id, username: user.username, email: user.email },
  };
}

export async function updateFcmToken(userId: string, fcmToken: string): Promise<void> {
  await userRepository.updateFcmToken({ id: userId, fcmToken });
}

export async function login(email: string, password: string): Promise<AuthResult> {
  const user = await userRepository.findByEmail(email);
  if (!user) throw new UnauthorizedError('Invalid credentials');

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) throw new UnauthorizedError('Invalid credentials');

  return {
    token: signToken({ id: user.id }),
    user:  { id: user.id, username: user.username, email: user.email },
  };
}
