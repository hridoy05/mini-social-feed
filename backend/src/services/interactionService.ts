import { likeRepository } from '../repositories/likeRepository';
import { commentRepository } from '../repositories/commentRepository';
import { postRepository } from '../repositories/postRepository';
import { NotFoundError } from '../errors/HttpError';

export async function toggleLike(userId: string, postId: string) {
  const post = await postRepository.findById(postId);
  if (!post) throw new NotFoundError('Post');
  return likeRepository.toggle({userId, postId});
}

export async function addComment(userId: string, postId: string, text: string) {
  const post = await postRepository.findById(postId);
  if (!post) throw new NotFoundError('Post');
  return commentRepository.create({userId, postId, text});
}
