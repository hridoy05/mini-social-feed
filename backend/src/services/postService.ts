import { postRepository } from '../repositories/postRepository';
import { NotFoundError } from '../errors/HttpError';

export function createPost(authorId: string, text: string) {
  return postRepository.create({ authorId, text });
}

export async function getFeed(page: number, limit: number, username?: string) {
  const { posts, total } = await postRepository.findFeed({ page, limit, username });
  return {
    posts,
    page,
    totalPages: Math.ceil(total / limit),
    hasMore:    page * limit < total,
  };
}

export async function getPostById(id: string) {
  const post = await postRepository.findById(id);
  if (!post) throw new NotFoundError('Post');
  return post;
}
