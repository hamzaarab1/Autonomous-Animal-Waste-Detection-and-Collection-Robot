import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/button';
import { Avatar } from '@/components/dashboard/app-shell';
import { Card, Page, PageHeader } from '@/components/dashboard/ui';
import { Colors, Spacing } from '@/constants/theme';
import { useAuth } from '@/lib/auth-context';

export default function SettingsScreen() {
  const { user, signOut } = useAuth();

  return (
    <Page>
      <PageHeader title="Settings" />
      <View style={styles.column}>
        <Card title="Account">
          <View style={styles.profile}>
            <Avatar size={56} />
            <View style={styles.flex}>
              <Text style={styles.name}>{user?.displayName ?? 'YardSentry user'}</Text>
              <Text style={styles.email}>{user?.email}</Text>
            </View>
          </View>
          <Text style={styles.note}>
            Signed in with {user?.providerData[0]?.providerId === 'google.com' ? 'Google' : 'email'}.
          </Text>
          <View style={styles.signOut}>
            <Button title="Sign out" variant="secondary" onPress={signOut} />
          </View>
        </Card>
      </View>
    </Page>
  );
}

const styles = StyleSheet.create({
  column: {
    width: '100%',
    maxWidth: 640,
  },
  flex: {
    flex: 1,
  },
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  email: {
    marginTop: 2,
    fontSize: 15,
    color: Colors.textMuted,
  },
  note: {
    fontSize: 14,
    color: Colors.textMuted,
  },
  signOut: {
    alignSelf: 'flex-start',
    minWidth: 160,
  },
});
