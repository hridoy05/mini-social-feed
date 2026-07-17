export type CreateUserInput = {
  username: string;
  email: string;
  password: string;
};

export type UpdateFcmTokenInput = {
  id: string;
  fcmToken: string;
};

export type CreatePostInput = {
  authorId: string;
  text: string;
};

export type FindFeedInput = {
  page: number;
  limit: number;
  username?: string;
};

export type CreateCommentInput = {
  userId: string;
  postId: string;
  text: string;
};

export type ToggleLikeInput = {
  userId: string;
  postId: string;
};
