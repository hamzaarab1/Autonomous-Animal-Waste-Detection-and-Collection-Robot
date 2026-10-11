import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Switch, Text, View } from 'react-native';

import { Button } from '@/components/button';
import { Card, EmptyState, Page, PageHeader } from '@/components/dashboard/ui';
import { Colors, Spacing } from '@/constants/theme';
import { notify } from '@/lib/notify';
import { robotName, useRobots, useSchedules } from '@/lib/robots';

export default function ScheduleScreen() {
  const robots = useRobots();
  const schedules = useSchedules();
  const add = () => notify('New schedule', 'Creating schedules is coming soon.');

  return (
    <Page>
      <PageHeader
        title="Schedule"
        subtitle="Cleans that start on their own."
        action={
          <Button title="New schedule" icon={<Ionicons name="add" size={20} color={Colors.white} />} onPress={add} />
        }
      />
      <Card>
        {schedules.length === 0 ? (
          <EmptyState icon="calendar-outline" title="No schedules" body="Set a time and the robot will start a clean by itself." />
        ) : (
          schedules.map((s, i) => (
            <View key={s.id} style={[styles.row, i > 0 && styles.divider]}>
              <Text style={styles.time}>{s.time}</Text>
              <View style={styles.text}>
                <Text style={styles.title}>{robotName(robots, s.robotId)}</Text>
                <Text style={styles.meta}>{s.days.join(', ')}</Text>
              </View>
              {/* TODO: persist toggles once schedules are stored on the robot. */}
              <Switch
                value={s.enabled}
                trackColor={{ true: Colors.leaf, false: Colors.border }}
                thumbColor={Colors.white}
                onValueChange={() => notify('Schedule', 'Editing schedules is coming soon.')}
              />
            </View>
          ))
        )}
      </Card>
    </Page>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  divider: {
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  time: {
    width: 72,
    fontSize: 22,
    fontWeight: '800',
    color: Colors.forest,
  },
  text: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  meta: {
    marginTop: 2,
    fontSize: 14,
    color: Colors.textMuted,
  },
});
