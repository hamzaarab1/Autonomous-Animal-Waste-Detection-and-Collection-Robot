import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { router, usePathname, type Href } from 'expo-router';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { IconName } from '@/components/dashboard/ui';
import { YardSentryMark, YardSentryWordmark } from '@/components/yardsentry-logo';
import { Colors, Radius, Spacing } from '@/constants/theme';
import { useLayout } from '@/hooks/use-layout';
import { useAuth } from '@/lib/auth-context';

type NavItem = { href: Href; path: string; label: string; icon: IconName; activeIcon: IconName };

/** Dashboard sections. Add a screen in src/app/(app)/ and list it here to put it in the nav. */
const NAV: NavItem[] = [
  { href: '/dashboard', path: '/dashboard', label: 'Overview', icon: 'grid-outline', activeIcon: 'grid' },
  { href: '/robots', path: '/robots', label: 'Robots', icon: 'hardware-chip-outline', activeIcon: 'hardware-chip' },
  { href: '/schedule', path: '/schedule', label: 'Schedule', icon: 'calendar-outline', activeIcon: 'calendar' },
  { href: '/history', path: '/history', label: 'History', icon: 'time-outline', activeIcon: 'time' },
  { href: '/settings', path: '/settings', label: 'Settings', icon: 'settings-outline', activeIcon: 'settings' },
];

/**
 * Frame around every signed-in screen.
 * Desktop: full sidebar. Tablet: icon rail. Phone: top bar + bottom tab bar.
 */
export function AppShell({ children }: { children: ReactNode }) {
  const { isPhone, isDesktop } = useLayout();
  const pathname = usePathname();
  const isActive = (item: NavItem) => pathname === item.path || pathname.startsWith(`${item.path}/`);

  if (isPhone) {
    return (
      <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
        <View style={styles.topBar}>
          <YardSentryWordmark width={130} />
          <Avatar size={34} onPress={() => router.push('/settings')} />
        </View>
        <View style={styles.flex}>{children}</View>
        <View style={styles.tabBar}>
          {NAV.map((item) => {
            const active = isActive(item);
            return (
              <Pressable
                key={item.path}
                accessibilityRole="tab"
                accessibilityState={{ selected: active }}
                style={styles.tab}
                onPress={() => router.navigate(item.href)}>
                <Ionicons
                  name={active ? item.activeIcon : item.icon}
                  size={22}
                  color={active ? Colors.primary : Colors.textMuted}
                />
                <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{item.label}</Text>
              </Pressable>
            );
          })}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.root, styles.row]} edges={['top', 'bottom', 'left']}>
      <View style={[styles.sidebar, isDesktop ? styles.sidebarWide : styles.sidebarRail]}>
        <Pressable style={styles.brand} onPress={() => router.navigate('/dashboard')} accessibilityLabel="Overview">
          {isDesktop ? <YardSentryWordmark width={150} /> : <YardSentryMark width={30} />}
        </Pressable>

        <View style={styles.nav}>
          {NAV.map((item) => {
            const active = isActive(item);
            return (
              <Pressable
                key={item.path}
                accessibilityRole="link"
                accessibilityLabel={item.label}
                accessibilityState={{ selected: active }}
                style={({ pressed }) => [
                  styles.navItem,
                  !isDesktop && styles.navItemRail,
                  active && styles.navItemActive,
                  pressed && !active && styles.navItemPressed,
                ]}
                onPress={() => router.navigate(item.href)}>
                <Ionicons
                  name={active ? item.activeIcon : item.icon}
                  size={20}
                  color={active ? Colors.primary : Colors.textMuted}
                />
                {isDesktop && <Text style={[styles.navLabel, active && styles.navLabelActive]}>{item.label}</Text>}
              </Pressable>
            );
          })}
        </View>

        <AccountBlock compact={!isDesktop} />
      </View>
      <View style={styles.flex}>{children}</View>
    </SafeAreaView>
  );
}

function AccountBlock({ compact }: { compact: boolean }) {
  const { user, signOut } = useAuth();
  return (
    <View style={[styles.account, compact && styles.accountCompact]}>
      <Avatar size={36} onPress={() => router.navigate('/settings')} />
      {!compact && (
        <View style={styles.flex}>
          <Text style={styles.accountName} numberOfLines={1}>
            {user?.displayName ?? 'Account'}
          </Text>
          <Text style={styles.accountEmail} numberOfLines={1}>
            {user?.email}
          </Text>
        </View>
      )}
      <Pressable accessibilityRole="button" accessibilityLabel="Sign out" hitSlop={8} onPress={signOut}>
        <Ionicons name="log-out-outline" size={22} color={Colors.textMuted} />
      </Pressable>
    </View>
  );
}

/** The signed-in user's Google photo, or their initial if there isn't one. */
export function Avatar({ size, onPress }: { size: number; onPress?: () => void }) {
  const { user } = useAuth();
  const initial = (user?.displayName ?? user?.email ?? '?').charAt(0).toUpperCase();
  const circle = { width: size, height: size, borderRadius: size / 2 };

  return (
    <Pressable accessibilityRole="button" accessibilityLabel="Account" disabled={!onPress} onPress={onPress}>
      {user?.photoURL ? (
        <Image source={user.photoURL} style={circle} />
      ) : (
        <View style={[styles.avatarFallback, circle]}>
          <Text style={[styles.avatarInitial, { fontSize: size * 0.42 }]}>{initial}</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  row: {
    flexDirection: 'row',
  },
  flex: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: Spacing.sm + 2,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.white,
    paddingTop: 6,
    paddingBottom: 4,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
    paddingVertical: 4,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  tabLabelActive: {
    color: Colors.primary,
  },
  sidebar: {
    borderRightWidth: 1,
    borderRightColor: Colors.border,
    paddingVertical: Spacing.lg,
    backgroundColor: Colors.white,
  },
  sidebarWide: {
    width: 248,
    paddingHorizontal: Spacing.md,
  },
  sidebarRail: {
    width: 80,
    paddingHorizontal: Spacing.sm + 4,
    alignItems: 'center',
  },
  brand: {
    paddingHorizontal: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  nav: {
    flex: 1,
    gap: Spacing.xs,
    alignSelf: 'stretch',
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm + 4,
    paddingVertical: Spacing.sm + 3,
    paddingHorizontal: Spacing.sm + 4,
    borderRadius: Radius.md,
  },
  navItemRail: {
    justifyContent: 'center',
    paddingHorizontal: 0,
  },
  navItemActive: {
    backgroundColor: Colors.mint,
  },
  navItemPressed: {
    backgroundColor: Colors.surface,
  },
  navLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
  },
  navLabelActive: {
    color: Colors.forest,
    fontWeight: '700',
  },
  account: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm + 2,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    alignSelf: 'stretch',
  },
  accountCompact: {
    flexDirection: 'column',
    gap: Spacing.md,
  },
  accountName: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
  },
  accountEmail: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  avatarFallback: {
    backgroundColor: Colors.forest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    color: Colors.white,
    fontWeight: '800',
  },
});
