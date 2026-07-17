import { Link, Stack } from 'expo-router';
import { StyleSheet, Text } from 'react-native';

import { Screen } from '@/src/components/ui/Screen';
import { colors, typography } from '@/src/theme';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <Screen style={styles.container}>
        <Text style={styles.title}>This screen doesn't exist.</Text>

        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>Go to home screen!</Text>
        </Link>
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    ...typography.display,
    color: colors.text,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    ...typography.action,
    color: colors.primary,
  },
});
