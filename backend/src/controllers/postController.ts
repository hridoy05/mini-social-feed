import { Request, Response } from 'express';
import * as postService from '../services/postService';

export async function create(req: Request, res: Response): Promise<void> {
  const post = await postService.createPost(req.userId!, req.body.text);
  res.status(201).json(post);
}

export async function feed(req: Request, res: Response): Promise<void> {
  const page  = Number(req.query.page)  || 1;
  const limit = Number(req.query.limit) || 10;
  const username = req.query.username as string | undefined;
  res.json(await postService.getFeed(page, limit, username));
}
