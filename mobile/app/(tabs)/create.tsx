import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';

import client from '@/src/api/client';
import { Button } from '@/src/components/ui/Button';
import { FieldError } from '@/src/components/ui/FieldError';
import { Input } from '@/src/components/ui/Input';
import { Screen } from '@/src/components/ui/Screen';
import { colors, spacing, typography } from '@/src/theme';
import { parseApiError } from '@/src/utils/apiErrors';

const MAX_LENGTH = 500;
const WARN_THRESHOLD = 480;
const CONFIRMATION_DELAY_MS = 700;

export default function CreatePostScreen() {
  const router = useRouter();
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [posted, setPosted] = useState(false);
  const navigateTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (navigateTimeout.current) clearTimeout(navigateTimeout.current);
    };
  }, []);

  function handleChangeText(value: string) {
    setText(value);
    if (error) setError(null);
  }

  async function handleSubmit() {
    const trimmed = text.trim();
    if (!trimmed || submitting) return;

    setError(null);
    setSubmitting(true);
    try {
      await client.post('/posts', { text: trimmed });
      setText('');
      setSubmitting(false);
      setPosted(true);
      navigateTimeout.current = setTimeout(() => {
        router.replace('/(tabs)');
      }, CONFIRMATION_DELAY_MS);
    } catch (err) {
      setError(parseApiError(err).form ?? 'Something went wrong. Try again.');
      setSubmitting(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Screen style={styles.container}>
        {posted ? (
          <View style={styles.confirmation}>
            <Ionicons name="checkmark-circle" size={48} color={colors.primary} />
            <Text style={styles.confirmationText}>Posted!</Text>
          </View>
        ) : (
          <>
            {error && (
              <View style={styles.errorWrap}>
                <FieldError message={error} />
              </View>
            )}

            <Input
              placeholder="What's on your mind?"
              multiline
              maxLength={MAX_LENGTH}
              autoFocus
              textAlignVertical="top"
              value={text}
              onChangeText={handleChangeText}
              style={styles.input}
            />
            <Text
              style={[
                styles.counter,
                text.length > WARN_THRESHOLD && styles.counterWarning,
              ]}
            >
              {text.length} / {MAX_LENGTH}
            </Text>

            <Button
              title="Post"
              onPress={handleSubmit}
              loading={submitting}
              disabled={submitting || !text.trim()}
            />
          </>
        )}
      </Screen>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    padding: spacing.lg,
  },
  errorWrap: {
    marginBottom: spacing.lg,
  },
  input: {
    minHeight: 120,
  },
  counter: {
    textAlign: 'right',
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
    fontSize: typography.meta.fontSize,
    color: colors.textFaint,
  },
  counterWarning: {
    color: colors.danger,
  },
  confirmation: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  confirmationText: {
    fontSize: typography.display.fontSize,
    fontWeight: typography.display.fontWeight,
    color: colors.text,
  },
});
