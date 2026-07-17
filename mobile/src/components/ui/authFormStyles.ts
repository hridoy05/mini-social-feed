import { StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../../theme';

export const authFormStyles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  wordmark: {
    fontSize: 34,
    fontWeight: '800',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  heading: {
    fontSize: typography.display.fontSize,
    fontWeight: typography.display.fontWeight,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  field: {
    marginBottom: spacing.lg,
  },
  inputError: {
    borderWidth: 1,
    borderColor: colors.danger,
  },
  submitButton: {
    marginTop: spacing.sm,
  },
  linkRow: {
    marginTop: spacing.xl,
    alignItems: 'center',
  },
  linkText: {
    color: colors.primary,
    fontSize: typography.body.fontSize,
    fontWeight: '600',
  },
});

export default authFormStyles;
