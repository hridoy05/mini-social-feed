import { prisma } from '../config/prisma';
import { CreatePostInput, FindFeedInput } from './types';

const publicAuthor = { select: { id: true, username: true } };


const feedInclude = {
  author: publicAuthor,
  likes: { select: { userId: true } },
  comments: {
    orderBy: { createdAt: 'asc' as const },
    include: { user: publicAuthor },
  },
  _count: { select: { likes: true, comments: true } },
};

export const postRepository = {
  create({ authorId, text }: CreatePostInput) {
    return prisma.post.create({
      data: { authorId, text },
      include: feedInclude,
    });
  },

  findById(id: string) {
    return prisma.post.findUnique({ where: { id }, include: feedInclude });
  },

  async findFeed({ page, limit, username }: FindFeedInput) {
    const where = username ? { author: { username } } : {};

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: feedInclude,
      }),
      prisma.post.count({ where }),
    ]);

    return { posts, total };
  },
};
