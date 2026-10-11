import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/button';
import { Meter, StatusPill } from '@/components/dashboard/ui';
import { Colors, Radius, Spacing } from '@/constants/theme';
import { notify } from '@/lib/notify';
import { timeAgo, type Robot } from '@/lib/robots';

function notConnected(action: string) {
  notify(action, 'Robot controls aren’t connected yet.');
}

export function RobotCard({ robot }: { robot: Robot }) {
  const busy = robot.status === 'cleaning' || robot.status === 'returning';

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.name} numberOfLines={1}>
          {robot.name}
        </Text>
        <StatusPill status={robot.status} />
      </View>
      <Text style={styles.meta}>
        {robot.hasBoundary ? 'Boundary set' : 'No boundary yet'} · seen {timeAgo(robot.lastSeen)}
      </Text>

      <View style={styles.meters}>
        <Meter label="Battery" value={robot.battery} warnBelow={20} />
        <Meter label="Waste bin" value={robot.binFill} warnAbove={75} />
      </View>

      <View style={styles.actions}>
        <View style={styles.action}>
          {busy ? (
            <Button title="Return home" variant="secondary" onPress={() => notConnected('Return home')} />
          ) : (
            <Button title="Start clean" onPress={() => notConnected('Start clean')} />
          )}
        </View>
        <View style={styles.action}>
          <Button title="Manual drive" variant="secondary" onPress={() => notConnected('Manual drive')} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: Spacing.md,
    borderRadius: Radius.md,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.sm + 4,
  },
  header: {
    gap: Spacing.sm,
  },
  name: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.forest,
  },
  meta: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  meters: {
    gap: Spacing.sm + 4,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  action: {
    flexGrow: 1,
    flexBasis: 140,
  },
});
