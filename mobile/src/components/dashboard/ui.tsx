import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps, ReactNode } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Colors, PageMaxWidth, Radius, Spacing } from '@/constants/theme';
import { useLayout } from '@/hooks/use-layout';
import { STATUS_LABEL, USING_SAMPLE_DATA, type RobotStatus } from '@/lib/robots';

export type IconName = ComponentProps<typeof Ionicons>['name'];

/** Scrollable page body that fills the space next to the nav, with responsive padding. */
export function Page({ children }: { children: ReactNode }) {
  const { gutter } = useLayout();
  return (
    <ScrollView style={styles.page} contentContainerStyle={{ padding: gutter, paddingBottom: gutter + Spacing.lg }}>
      <View style={styles.pageInner}>{children}</View>
    </ScrollView>
  );
}

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  const { isPhone } = useLayout();
  return (
    <View style={[styles.header, isPhone && styles.headerStacked]}>
      <View style={styles.flex}>
        <View style={styles.headerTitleRow}>
          <Text style={[styles.title, isPhone && styles.titlePhone]}>{title}</Text>
          {USING_SAMPLE_DATA && <SampleBadge />}
        </View>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      {action}
    </View>
  );
}

export function Card({
  title,
  action,
  children,
  style,
}: {
  title?: string;
  action?: ReactNode;
  children: ReactNode;
  style?: ComponentProps<typeof View>['style'];
}) {
  return (
    <View style={[styles.card, style]}>
      {(title || action) && (
        <View style={styles.cardHeader}>
          {title && <Text style={styles.cardTitle}>{title}</Text>}
          {action}
        </View>
      )}
      {children}
    </View>
  );
}

export function StatTile({ icon, label, value, hint }: { icon: IconName; label: string; value: string; hint?: string }) {
  return (
    <View style={[styles.card, styles.stat]}>
      <View style={styles.iconBadge}>
        <Ionicons name={icon} size={20} color={Colors.primary} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
      {hint && <Text style={styles.statHint}>{hint}</Text>}
    </View>
  );
}

const STATUS_COLOR: Record<RobotStatus, { bg: string; fg: string }> = {
  idle: { bg: Colors.surface, fg: Colors.textMuted },
  cleaning: { bg: Colors.mint, fg: Colors.primary },
  returning: { bg: Colors.mint, fg: Colors.forest },
  charging: { bg: '#FFF6E0', fg: '#8A6100' },
  offline: { bg: Colors.surface, fg: Colors.textMuted },
  error: { bg: '#FCEDEC', fg: Colors.danger },
};

export function StatusPill({ status }: { status: RobotStatus }) {
  const c = STATUS_COLOR[status];
  return (
    <View style={[styles.pill, { backgroundColor: c.bg }]}>
      <View style={[styles.dot, { backgroundColor: c.fg }]} />
      <Text style={[styles.pillText, { color: c.fg }]}>{STATUS_LABEL[status]}</Text>
    </View>
  );
}

/** Labeled horizontal bar, e.g. battery or bin fill. `warnAbove`/`warnBelow` turn it red. */
export function Meter({
  label,
  value,
  warnAbove,
  warnBelow,
}: {
  label: string;
  value: number;
  warnAbove?: number;
  warnBelow?: number;
}) {
  const warn = (warnAbove !== undefined && value > warnAbove) || (warnBelow !== undefined && value < warnBelow);
  return (
    <View>
      <View style={styles.meterRow}>
        <Text style={styles.meterLabel}>{label}</Text>
        <Text style={[styles.meterValue, warn && { color: Colors.danger }]}>{value}%</Text>
      </View>
      <View style={styles.meterTrack}>
        <View
          style={[styles.meterFill, { width: `${value}%`, backgroundColor: warn ? Colors.danger : Colors.leaf }]}
        />
      </View>
    </View>
  );
}

export function EmptyState({ icon, title, body, action }: { icon: IconName; title: string; body: string; action?: ReactNode }) {
  return (
    <View style={styles.empty}>
      <View style={[styles.iconBadge, styles.emptyIcon]}>
        <Ionicons name={icon} size={26} color={Colors.primary} />
      </View>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.emptyBody}>{body}</Text>
      {action}
    </View>
  );
}

export function SampleBadge() {
  return (
    <View style={styles.sample}>
      <Text style={styles.sampleText}>Sample data</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  page: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  pageInner: {
    width: '100%',
    maxWidth: PageMaxWidth,
    alignSelf: 'center',
    gap: Spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Spacing.md,
  },
  headerStacked: {
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm + 4,
    flexWrap: 'wrap',
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: Colors.forest,
    letterSpacing: -0.4,
  },
  titlePhone: {
    fontSize: 26,
  },
  subtitle: {
    marginTop: Spacing.xs,
    fontSize: 16,
    lineHeight: 23,
    color: Colors.textMuted,
  },
  card: {
    padding: Spacing.lg - 4,
    borderRadius: Radius.lg,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.text,
  },
  stat: {
    gap: Spacing.xs,
  },
  iconBadge: {
    width: 40,
    height: 40,
    borderRadius: Radius.sm + 4,
    backgroundColor: Colors.mint,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  statValue: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.forest,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  statHint: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: Radius.pill,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  pillText: {
    fontSize: 13,
    fontWeight: '700',
  },
  meterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  meterLabel: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  meterValue: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.text,
  },
  meterTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.mint,
    overflow: 'hidden',
  },
  meterFill: {
    height: '100%',
    borderRadius: 4,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    gap: Spacing.sm,
  },
  emptyIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  emptyBody: {
    maxWidth: 380,
    textAlign: 'center',
    fontSize: 15,
    lineHeight: 22,
    color: Colors.textMuted,
    marginBottom: Spacing.sm,
  },
  sample: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: Radius.sm,
    backgroundColor: '#FFF6E0',
  },
  sampleText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8A6100',
  },
});
