import { NotFoundError } from '../errors/HttpError';
import { commentRepository } from '../repositories/commentRepository';
import { likeRepository } from '../repositories/likeRepository';
import { postRepository } from '../repositories/postRepository';
import { userRepository } from '../repositories/userRepository';
import { notifyUser } from '../utils/notify';

export async function toggleLike(userId: string, postId: string) {
  const post = await postRepository.findById(postId);
  if (!post) throw new NotFoundError('Post');

  const result = await likeRepository.toggle({userId, postId});

  // Notify on like (not unlike), skip self-likes.
  if (result.liked && post.authorId !== userId) {
    const actor = await userRepository.findById(userId);
    void notifyUser(
      post.authorId,
      'New like ❤️',
      `${actor?.username ?? 'Someone'} liked your post`,
      { postId },
    );
  }
  return result;
}

export async function addComment(userId: string, postId: string, text: string) {
  const post = await postRepository.findById(postId);
  if (!post) throw new NotFoundError('Post');

  const comment = await commentRepository.create({userId, postId, text});

  if (post.authorId !== userId) {
    const actor = await userRepository.findById(userId);
    void notifyUser(
      post.authorId,
      'New comment 💬',
      `${actor?.username ?? 'Someone'}: ${text.slice(0, 50)}`,
      { postId },
    );
  }
  return comment;
}
