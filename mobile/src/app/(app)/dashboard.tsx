import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/button';
import { DetectionRow } from '@/components/dashboard/detection-row';
import { RobotCard } from '@/components/dashboard/robot-card';
import { Grid } from '@/components/grid';
import { Card, EmptyState, Page, PageHeader, StatTile } from '@/components/dashboard/ui';
import { Colors, Spacing } from '@/constants/theme';
import { useLayout } from '@/hooks/use-layout';
import { useAuth } from '@/lib/auth-context';
import { notify } from '@/lib/notify';
import { robotName, useDetections, useRobots, useSchedules } from '@/lib/robots';

export default function OverviewScreen() {
  const { user } = useAuth();
  const { isPhone, isDesktop, width } = useLayout();
  const robots = useRobots();
  const schedules = useSchedules();
  const detections = useDetections();

  const firstName = user?.displayName?.split(' ')[0];
  const active = robots.filter((r) => r.status === 'cleaning' || r.status === 'returning').length;
  const pickedUp = detections.filter((d) => d.kind === 'picked-up').length;
  const toReview = detections.filter((d) => d.kind === 'needs-review').length;
  const nextSchedule = schedules.find((s) => s.enabled);

  // Two-column body (robots | activity) only when there's room for both.
  const sideBySide = width >= 1180;

  return (
    <Page>
      <PageHeader
        title={firstName ? `Hi, ${firstName}` : 'Overview'}
        subtitle="Here’s what your robots are up to."
        action={
          <Button
            title="Pair a robot"
            icon={<Ionicons name="qr-code-outline" size={18} color={Colors.white} />}
            onPress={() => notify('Pair a robot', 'Robot pairing is coming soon.')}
          />
        }
      />

      <Grid columns={isDesktop ? 4 : 2}>
        <StatTile icon="hardware-chip-outline" label="Robots" value={String(robots.length)} hint={`${active} active now`} />
        <StatTile icon="checkmark-done-outline" label="Picked up" value={String(pickedUp)} hint="Last 24 hours" />
        <StatTile icon="help-circle-outline" label="Needs your review" value={String(toReview)} hint="Low-confidence finds" />
        <StatTile
          icon="calendar-outline"
          label="Next clean"
          value={nextSchedule?.time ?? '—'}
          hint={nextSchedule ? `${nextSchedule.days.join(', ')} · ${robotName(robots, nextSchedule.robotId)}` : 'Nothing scheduled'}
        />
      </Grid>

      <View style={[styles.body, sideBySide && styles.bodyRow]}>
        <View style={[styles.main, sideBySide && styles.mainWide]}>
          <Card title="Your robots">
            {robots.length === 0 ? (
              <EmptyState
                icon="qr-code-outline"
                title="No robots yet"
                body="Pair your YardSentry by scanning the QR code in its box."
              />
            ) : (
              <Grid columns={isPhone ? 1 : 2}>
                {robots.map((r) => (
                  <RobotCard key={r.id} robot={r} />
                ))}
              </Grid>
            )}
          </Card>
        </View>

        <View style={[styles.side, sideBySide && styles.sideWide]}>
          <Card
            title="Recent activity"
            action={<Button title="See all" variant="ghost" onPress={() => router.navigate('/history')} />}>
            {detections.length === 0 ? (
              <Text style={styles.muted}>Nothing yet. Detections show up here during a clean.</Text>
            ) : (
              <View>
                {detections.slice(0, 5).map((d) => (
                  <DetectionRow key={d.id} detection={d} robotName={robotName(robots, d.robotId)} />
                ))}
              </View>
            )}
          </Card>
        </View>
      </View>
    </Page>
  );
}

const styles = StyleSheet.create({
  body: {
    gap: Spacing.lg,
  },
  bodyRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  main: {},
  mainWide: {
    flex: 3,
  },
  side: {},
  sideWide: {
    flex: 2,
  },
  muted: {
    fontSize: 15,
    color: Colors.textMuted,
  },
});
