import { Redirect, Slot } from 'expo-router';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { AppShell } from '@/components/dashboard/app-shell';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/lib/auth-context';

/** Every screen in this (app) group requires a signed-in user and renders inside the dashboard shell. */
export default function SignedInLayout() {
  const { user, initializing } = useAuth();

  if (initializing) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={Colors.primary} size="large" />
      </View>
    );
  }
  if (!user) return <Redirect href="/login" />;

  return (
    <AppShell>
      <Slot />
    </AppShell>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
  },
});
