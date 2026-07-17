import { Slot, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { ErrorBoundary } from '@/src/components/ErrorBoundary';
import { OfflineBanner } from '@/src/components/OfflineBanner';
import { AuthProvider, useAuth } from '@/src/context/AuthContext';
import { colors, spacing, typography } from '@/src/theme';
import { setupNotificationHandler, setupTapHandler } from '@/src/utils/notifications';

export default function RootLayout() {
  useEffect(() => {
    setupNotificationHandler();
  }, []);

  return (
    <ErrorBoundary>
      <AuthProvider>
        <RootLayoutNav />
      </AuthProvider>
    </ErrorBoundary>
  );
}

function RootLayoutNav() {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = setupTapHandler(() => router.push('/(tabs)'));
    return unsubscribe;
  }, [router]);

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!user && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (user && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [user, loading, segments, router]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.wordmark}>minisky</Text>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.appContainer}>
      <OfflineBanner />
      <Slot />
    </View>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bg,
    gap: spacing.lg,
  },
  wordmark: {
    fontSize: 34,
    fontWeight: '800',
    color: colors.primary,
  },
});
