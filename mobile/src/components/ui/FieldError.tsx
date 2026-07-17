import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { colors, typography, spacing } from '../../theme';

export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <Text style={styles.text}>{message}</Text>;
}

const styles = StyleSheet.create({
  text: {
    color: colors.danger,
    fontSize: typography.meta.fontSize,
    marginTop: spacing.xs,
  },
});

export default FieldError;
