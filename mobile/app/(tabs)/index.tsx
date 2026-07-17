import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import client from '@/src/api/client';
import { FeedResponse, Post } from '@/src/api/types';
import { PostRow } from '@/src/components/PostRow';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { Screen } from '@/src/components/ui/Screen';
import { useAuth } from '@/src/context/AuthContext';
import { useResponsive } from '@/src/hooks/useResponsive';
import { colors, radius, spacing, typography } from '@/src/theme';
import { getErrorMessage } from '@/src/utils/apiError';

const PAGE_LIMIT = 10;
const MAX_CONTENT_WIDTH = 600;

type LoadMode = 'initial' | 'refresh' | 'more';

export default function FeedScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const { width, isTablet } = useResponsive();
  const contentWidth = Math.min(width, MAX_CONTENT_WIDTH);

  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [filterInput, setFilterInput] = useState('');
  const [appliedFilter, setAppliedFilter] = useState('');

  const fetchPage = useCallback(
    async (pageNum: number, username: string, mode: LoadMode) => {
      if (mode === 'initial') setLoading(true);
      if (mode === 'refresh') setRefreshing(true);
      if (mode === 'more') setLoadingMore(true);
      setError(null);

      try {
        const res = await client.get<FeedResponse>('/posts', {
          params: {
            page: pageNum,
            limit: PAGE_LIMIT,
            username: username || undefined,
          },
        });
        setPosts((prev) =>
          pageNum === 1 ? res.data.posts : [...prev, ...res.data.posts]
        );
        setPage(res.data.page);
        setHasMore(res.data.hasMore);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
        setRefreshing(false);
        setLoadingMore(false);
      }
    },
    []
  );

  useFocusEffect(
    useCallback(() => {
      fetchPage(1, appliedFilter, 'initial');
    }, [appliedFilter, fetchPage])
  );

  function handleRefresh() {
    fetchPage(1, appliedFilter, 'refresh');
  }

  function handleEndReached() {
    if (loading || loadingMore || refreshing || error || !hasMore) return;
    fetchPage(page + 1, appliedFilter, 'more');
  }

  function handleRetry() {
    fetchPage(1, appliedFilter, 'initial');
  }

  function handleSearch() {
    setAppliedFilter(filterInput.trim());
  }

  function handleClearFilter() {
    setFilterInput('');
    setAppliedFilter('');
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Screen>
        <View style={[styles.wrapper, { width: contentWidth }]}>
          {error && (
            <Pressable
              onPress={handleRetry}
              style={({ pressed }) => [
                styles.errorBanner,
                pressed && styles.errorBannerPressed,
              ]}
              hitSlop={8}
            >
              <Text style={styles.errorText}>{error}</Text>
            </Pressable>
          )}

          <FlatList
            data={posts}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <PostRow post={item} currentUserId={user?.id ?? ''} />
            )}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                tintColor={colors.primary}
                colors={[colors.primary]}
              />
            }
            onEndReached={handleEndReached}
            onEndReachedThreshold={0.5}
            ListHeaderComponent={
              <View
                style={[
                  styles.filterSection,
                  isTablet && styles.filterSectionTablet,
                ]}
              >
                <View style={styles.filterRow}>
                  <Input
                    placeholder="Filter by @username"
                    autoCapitalize="none"
                    value={filterInput}
                    onChangeText={setFilterInput}
                    onSubmitEditing={handleSearch}
                    returnKeyType="search"
                    style={styles.filterInput}
                  />
                  <Pressable
                    onPress={handleSearch}
                    style={({ pressed }) => [
                      styles.searchButton,
                      pressed && styles.searchButtonPressed,
                    ]}
                    hitSlop={8}
                    accessibilityRole="button"
                    accessibilityLabel="Search"
                  >
                    <Ionicons
                      name="search"
                      size={20}
                      color={colors.textMuted}
                    />
                  </Pressable>
                </View>

                {appliedFilter.length > 0 && (
                  <Pressable
                    onPress={handleClearFilter}
                    style={({ pressed }) => [
                      styles.clearPill,
                      pressed && styles.clearPillPressed,
                    ]}
                    hitSlop={8}
                  >
                    <Text style={styles.clearPillText}>
                      Clear filter: @{appliedFilter}
                    </Text>
                    <Ionicons name="close" size={14} color={colors.primary} />
                  </Pressable>
                )}
              </View>
            }
            ListEmptyComponent={
              loading ? (
                <View style={styles.centerState}>
                  <ActivityIndicator color={colors.primary} />
                </View>
              ) : error ? null : appliedFilter.length > 0 ? (
                <View style={styles.centerState}>
                  <Text style={styles.emptyText}>
                    No posts by @{appliedFilter}
                  </Text>
                  <Button
                    title="Clear filter"
                    variant="ghost"
                    onPress={handleClearFilter}
                  />
                </View>
              ) : (
                <View style={styles.centerState}>
                  <Text style={styles.emptyText}>
                    Nothing here yet. Pull to refresh or write the first post!
                  </Text>
                  <Button
                    title="Create a post"
                    onPress={() => router.push('/(tabs)/create')}
                  />
                </View>
              )
            }
            ListFooterComponent={
              loadingMore ? (
                <View style={styles.footer}>
                  <ActivityIndicator color={colors.primary} />
                </View>
              ) : null
            }
          />
        </View>
      </Screen>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  wrapper: {
    flex: 1,
    alignSelf: 'center',
  },
  errorBanner: {
    backgroundColor: colors.danger,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  errorBannerPressed: {
    opacity: 0.7,
  },
  errorText: {
    color: colors.bg,
    fontSize: typography.meta.fontSize,
    fontWeight: '600',
    textAlign: 'center',
  },
  filterSection: {
    padding: spacing.lg,
    gap: spacing.sm,
  },
  filterSectionTablet: {
    padding: spacing.xl,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  filterInput: {
    flex: 1,
  },
  searchButton: {
    padding: spacing.sm,
  },
  searchButtonPressed: {
    opacity: 0.6,
  },
  clearPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: spacing.xs,
    backgroundColor: colors.bgAlt,
    borderRadius: radius.pill,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  clearPillPressed: {
    opacity: 0.6,
  },
  clearPillText: {
    fontSize: typography.meta.fontSize,
    color: colors.primary,
    fontWeight: '600',
  },
  centerState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl * 2,
    gap: spacing.md,
  },
  emptyText: {
    fontSize: typography.body.fontSize,
    color: colors.textMuted,
    textAlign: 'center',
    paddingHorizontal: spacing.xl,
  },
  footer: {
    paddingVertical: spacing.lg,
  },
});
