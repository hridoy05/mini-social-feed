import NetInfo from '@react-native-community/netinfo';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, typography } from '../theme';

export function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(false);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    return NetInfo.addEventListener((state) => {
      setIsOffline(state.isConnected === false);
    });
  }, []);

  if (!isOffline) return null;

  return (
    <View style={[styles.banner, { paddingTop: insets.top + spacing.xs }]}>
      <Text style={styles.text}>You're offline</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: colors.textMuted,
    paddingBottom: spacing.xs,
    alignItems: 'center',
  },
  text: {
    color: colors.bg,
    fontSize: typography.meta.fontSize,
    fontWeight: '600',
  },
});

export default OfflineBanner;
