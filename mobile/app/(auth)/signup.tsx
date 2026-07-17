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
import { fieldErrors, signupSchema } from '@/src/validation/auth';
import { parseApiError } from '@/src/utils/apiErrors';

const CONFLICT_FIELDS = ['username', 'email'];

export default function SignupScreen() {
  const { signIn } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    const result = signupSchema.safeParse({ username, email, password });
    if (!result.success) {
      setErrors(fieldErrors(result.error));
      return;
    }
    setErrors({});

    setSubmitting(true);
    try {
      const res = await client.post('/auth/signup', result.data);
      const { token, user } = res.data;
      await signIn(token, user);
    } catch (err) {
      setErrors(parseApiError(err, CONFLICT_FIELDS));
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
        <Text style={styles.heading}>Sign up</Text>

        <View style={styles.field}>
          <Input
            placeholder="Username"
            autoCapitalize="none"
            value={username}
            onChangeText={setUsername}
            style={errors.username ? styles.inputError : undefined}
          />
          <FieldError message={errors.username} />
        </View>

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
          title="Sign Up"
          onPress={handleSubmit}
          loading={submitting}
          disabled={submitting}
          style={styles.submitButton}
        />
        <FieldError message={errors.form} />

        <View style={styles.linkRow}>
          <Link href="/(auth)/login" style={styles.linkText}>
            Already have an account? Sign in
          </Link>
        </View>
      </Screen>
    </KeyboardAvoidingView>
  );
}
