import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Text, View } from 'react-native';
import { Link } from 'expo-router';

import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { Screen } from '@/src/components/ui/Screen';
import { FieldError } from '@/src/components/ui/FieldError';
import { authFormStyles as styles } from '@/src/components/ui/authFormStyles';
import client from '@/src/api/client';
import { useAuth } from '@/src/context/AuthContext';
import { fieldErrors, loginSchema } from '@/src/validation/auth';
import { parseApiError } from '@/src/utils/apiErrors';

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      setErrors(fieldErrors(result.error));
      return;
    }
    setErrors({});

    setSubmitting(true);
    try {
      const res = await client.post('/auth/login', result.data);
      const { token, user } = res.data;
      await signIn(token, user);
    } catch (err) {
      setErrors(parseApiError(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Screen style={styles.container}>
        <Text style={styles.wordmark}>minisky</Text>
        <Text style={styles.heading}>Sign in</Text>

        <View style={styles.field}>
          <Input
            placeholder="Email"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            style={errors.email ? styles.inputError : undefined}
          />
          <FieldError message={errors.email} />
        </View>

        <View style={styles.field}>
          <Input
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            style={errors.password ? styles.inputError : undefined}
          />
          <FieldError message={errors.password} />
        </View>

        <Button
          title="Sign In"
          onPress={handleSubmit}
          loading={submitting}
          disabled={submitting}
          style={styles.submitButton}
        />
        <FieldError message={errors.form} />

        <View style={styles.linkRow}>
          <Link href="/(auth)/signup" style={styles.linkText}>
            Create a new account
          </Link>
        </View>
      </Screen>
    </KeyboardAvoidingView>
  );
}
