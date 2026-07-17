import { prisma } from '../config/prisma';
import { CreateCommentInput } from './types';

export const commentRepository = {
  create({ userId, postId, text }: CreateCommentInput) {
    return prisma.comment.create({
      data: { userId, postId, text },
      include: { user: { select: { id: true, username: true } } },
    });
  },
};
