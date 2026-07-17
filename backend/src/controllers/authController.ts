import { Request, Response } from 'express';
import * as authService from '../services/authService';


export async function signup(req: Request, res: Response): Promise<void> {
  const { username, email, password } = req.body;
  const result = await authService.signup(username, email, password);
  res.status(201).json(result);
}

export async function login(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body;
  const result = await authService.login(email, password);
  res.status(200).json(result);
}
