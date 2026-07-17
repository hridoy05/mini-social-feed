import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Pressable, StyleSheet, Text } from 'react-native';

import { useAuth } from '@/src/context/AuthContext';
import { colors, typography } from '@/src/theme';

function SignOutButton() {
  const { signOut } = useAuth();

  return (
    <Pressable onPress={() => signOut()} style={styles.signOutButton} hitSlop={8}>
      <Text style={styles.signOutText}>Sign out</Text>
    </Pressable>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textFaint,
        headerStyle: {
          backgroundColor: colors.bg,
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: colors.border,
        },
        headerTitleStyle: {
          color: colors.text,
        },
        headerRight: () => <SignOutButton />,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: 'New Post',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'add-circle' : 'add-circle-outline'}
              size={24}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  signOutButton: {
    marginRight: 16,
  },
  signOutText: {
    fontSize: typography.action.fontSize,
    fontWeight: typography.action.fontWeight,
    color: colors.primary,
  },
});
