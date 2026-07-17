import { Request, Response } from 'express';
import * as interactionService from '../services/interactionService';

export async function like(req: Request<{ id: string }>, res: Response): Promise<void> {
  const result = await interactionService.toggleLike(req.userId!, req.params.id);
  res.json(result);
}

export async function comment(req: Request<{ id: string }>, res: Response): Promise<void> {
  const c = await interactionService.addComment(req.userId!, req.params.id, req.body.text);
  res.status(201).json(c);
}
