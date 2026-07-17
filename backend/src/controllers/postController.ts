import { Request, Response } from 'express';
import { matchedData } from 'express-validator';
import * as postService from '../services/postService';

export async function create(req: Request, res: Response): Promise<void> {
  const post = await postService.createPost(req.userId!, req.body.text);
  res.status(201).json(post);
}

export async function feed(req: Request, res: Response): Promise<void> {
  const { page = 1, limit = 10, username } = matchedData<{
    page?: number;
    limit?: number;
    username?: string;
  }>(req);
  res.json(await postService.getFeed(page, limit, username));
}
