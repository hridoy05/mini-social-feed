import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import client from '../api/client';
import { Comment, Post, ToggleLikeResponse } from '../api/types';
import { colors, radius, spacing, typography } from '../theme';
import { Avatar } from './ui/Avatar';
import { Input } from './ui/Input';

type PostRowProps = {
  post: Post;
  currentUserId: string;
};

export function timeAgo(iso: string): string {
  const seconds = Math.max(
    0,
    Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  );
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
}

export function PostRow({ post, currentUserId }: PostRowProps) {
  const [liked, setLiked] = useState(() =>
    post.likes.some((like) => like.userId === currentUserId)
  );
  const [likeCount, setLikeCount] = useState(post._count.likes);
  const [likePending, setLikePending] = useState(false);

  const [comments, setComments] = useState<Comment[]>(post.comments);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [commentSubmitting, setCommentSubmitting] = useState(false);

  useEffect(() => {
    setLiked(post.likes.some((like) => like.userId === currentUserId));
    setLikeCount(post._count.likes);
    setComments(post.comments);
  }, [post, currentUserId]);

  async function handleLike() {
    if (likePending) return;
    const prevLiked = liked;
    const prevCount = likeCount;
    const nextLiked = !prevLiked;

    setLiked(nextLiked);
    setLikeCount(prevCount + (nextLiked ? 1 : -1));
    setLikePending(true);
    try {
      const res = await client.post<ToggleLikeResponse>(
        `/posts/${post.id}/like`
      );
      setLiked(res.data.liked);
      setLikeCount(res.data.count);
    } catch {
      setLiked(prevLiked);
      setLikeCount(prevCount);
    } finally {
      setLikePending(false);
    }
  }

  async function handleSendComment() {
    const text = commentText.trim();
    if (!text || commentSubmitting) return;

    setCommentSubmitting(true);
    try {
      const res = await client.post<Comment>(`/posts/${post.id}/comment`, {
        text,
      });
      setComments((prev) => [...prev, res.data]);
      setCommentText('');
    } catch {
      // Leave the draft in place so the user can retry.
    } finally {
      setCommentSubmitting(false);
    }
  }

  return (
    <View style={styles.row}>
      <Avatar username={post.author.username} size={40} />
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.username}>{post.author.username}</Text>
          <Text style={styles.time}>{timeAgo(post.createdAt)}</Text>
        </View>

        <Text style={styles.body}>{post.text}</Text>

        <View style={styles.actions}>
          <Pressable
            onPress={() => setCommentsOpen((open) => !open)}
            style={styles.actionButton}
            hitSlop={8}
          >
            <Ionicons
              name="chatbubble-outline"
              size={18}
              color={colors.textMuted}
            />
            {comments.length > 0 && (
              <Text style={styles.actionCount}>{comments.length}</Text>
            )}
          </Pressable>

          <Pressable
            onPress={handleLike}
            style={styles.actionButton}
            hitSlop={8}
            disabled={likePending}
          >
            <Ionicons
              name={liked ? 'heart' : 'heart-outline'}
              size={18}
              color={liked ? colors.danger : colors.textMuted}
            />
            {likeCount > 0 && (
              <Text
                style={[styles.actionCount, liked && styles.actionCountLiked]}
              >
                {likeCount}
              </Text>
            )}
          </Pressable>
        </View>

        {commentsOpen && (
          <View style={styles.commentSection}>
            {comments.map((comment) => (
              <View key={comment.id} style={styles.commentRow}>
                <Text style={styles.commentUsername}>
                  {comment.user.username}
                </Text>
                <Text style={styles.commentText}>{comment.text}</Text>
              </View>
            ))}

            <View style={styles.commentInputRow}>
              <Input
                placeholder="Write a comment..."
                value={commentText}
                onChangeText={setCommentText}
                style={styles.commentInput}
              />
              <Pressable
                onPress={handleSendComment}
                disabled={commentSubmitting || !commentText.trim()}
                style={({ pressed }) => [
                  styles.sendButton,
                  (commentSubmitting || !commentText.trim()) &&
                    styles.sendButtonDisabled,
                  pressed && styles.sendButtonPressed,
                ]}
                hitSlop={8}
              >
                <Text style={styles.sendButtonText}>
                  {commentSubmitting ? '...' : 'Send'}
                </Text>
              </Pressable>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    padding: spacing.lg,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  },
  content: {
    flex: 1,
    marginLeft: spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing.xs,
  },
  username: {
    fontSize: typography.handle.fontSize,
    fontWeight: typography.handle.fontWeight,
    color: colors.text,
  },
  time: {
    fontSize: typography.meta.fontSize,
    color: colors.textFaint,
  },
  body: {
    fontSize: typography.body.fontSize,
    lineHeight: typography.body.lineHeight,
    color: colors.text,
    marginTop: spacing.xs,
  },
  actions: {
    flexDirection: 'row',
    marginTop: spacing.sm,
    gap: spacing.lg,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  actionCount: {
    fontSize: typography.meta.fontSize,
    color: colors.textMuted,
  },
  actionCountLiked: {
    color: colors.danger,
  },
  commentSection: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 0.5,
    borderTopColor: colors.border,
  },
  commentRow: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
    gap: spacing.xs,
  },
  commentUsername: {
    fontSize: typography.meta.fontSize,
    fontWeight: '600',
    color: colors.text,
  },
  commentText: {
    flex: 1,
    fontSize: typography.meta.fontSize,
    color: colors.textMuted,
  },
  commentInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  commentInput: {
    flex: 1,
    paddingVertical: spacing.sm,
  },
  sendButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonPressed: {
    opacity: 0.7,
  },
  sendButtonText: {
    color: colors.bg,
    fontSize: typography.meta.fontSize,
    fontWeight: '600',
  },
});

export default PostRow;
