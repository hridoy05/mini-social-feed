import { prisma } from '../config/prisma';
import { ToggleLikeInput } from './types';

export const likeRepository = {
  // Atomic toggle
  async toggle({ userId, postId }: ToggleLikeInput) {
    return prisma.$transaction(async (tx) => {
      const existing = await tx.like.findUnique({
        where: { userId_postId: { userId, postId } },
      });

      if (existing) {
        await tx.like.delete({ where: { id: existing.id } });
      } else {
        await tx.like.create({ data: { userId, postId } });
      }

      const count = await tx.like.count({ where: { postId } });
      return { liked: !existing, count };
    });
  },
};
