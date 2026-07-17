import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { colors, radius } from '../../theme';

type AvatarProps = {
  username: string;
  size?: number;
  style?: ViewStyle;
};

export function Avatar({ username, size = 40, style }: AvatarProps) {
  const initial = username.trim().charAt(0).toUpperCase() || '?';

  return (
    <View
      style={[
        styles.container,
        { width: size, height: size, borderRadius: size / 2 },
        style,
      ]}
    >
      <Text style={[styles.initial, { fontSize: size * 0.4 }]}>{initial}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.bgAlt,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
  },
  initial: {
    color: colors.textMuted,
    fontWeight: '600',
  },
});

export default Avatar;
