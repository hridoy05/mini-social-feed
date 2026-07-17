export type PublicUser = {
  id: string;
  username: string;
};

export type Comment = {
  id: string;
  text: string;
  userId: string;
  postId: string;
  user: PublicUser;
  createdAt: string;
  updatedAt: string;
};

export type Post = {
  id: string;
  text: string;
  authorId: string;
  author: PublicUser;
  comments: Comment[];
  likes: { userId: string }[];
  _count: { likes: number; comments: number };
  createdAt: string;
  updatedAt: string;
};

export type FeedResponse = {
  posts: Post[];
  page: number;
  totalPages: number;
  hasMore: boolean;
};

export type ToggleLikeResponse = {
  liked: boolean;
  count: number;
};
