import { useState } from 'react';
import { StyleSheet, TextInput, TextInputProps } from 'react-native';
import { colors, radius, spacing, typography } from '../../theme';

export function Input({ style, onFocus, onBlur, ...props }: TextInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <TextInput
      placeholderTextColor={colors.textFaint}
      {...props}
      onFocus={(e) => {
        setIsFocused(true);
        onFocus?.(e);
      }}
      onBlur={(e) => {
        setIsFocused(false);
        onBlur?.(e);
      }}
      style={[styles.input, style, isFocused && styles.inputFocused]}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: colors.bgAlt,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    fontSize: typography.body.fontSize,
    color: colors.text,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  inputFocused: {
    borderColor: colors.primary,
  },
});

export default Input;
