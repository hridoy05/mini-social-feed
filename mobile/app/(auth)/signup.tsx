import { StyleSheet, Text } from 'react-native';

import { Screen } from '@/src/components/ui/Screen';
import { colors, typography } from '@/src/theme';

export default function SignupScreen() {
  return (
    <Screen style={styles.container}>
      <Text style={styles.text}>Signup</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: typography.display.fontSize,
    fontWeight: typography.display.fontWeight,
    color: colors.text,
  },
});
