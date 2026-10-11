import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Text, View } from 'react-native';

import type { IconName } from '@/components/dashboard/ui';
import { Colors, Spacing } from '@/constants/theme';
import { timeAgo, type Detection, type DetectionKind } from '@/lib/robots';

const KIND: Record<DetectionKind, { icon: IconName; color: string; verb: string }> = {
  'picked-up': { icon: 'checkmark-circle', color: Colors.primary, verb: 'Picked up' },
  'needs-review': { icon: 'help-circle', color: '#B07C00', verb: 'Needs review' },
  ignored: { icon: 'remove-circle-outline', color: Colors.textMuted, verb: 'Ignored' },
};

export function DetectionRow({ detection, robotName }: { detection: Detection; robotName: string }) {
  const k = KIND[detection.kind];
  return (
    <View style={styles.row}>
      <Ionicons name={k.icon} size={22} color={k.color} />
      <View style={styles.text}>
        <Text style={styles.title} numberOfLines={1}>
          {k.verb}: {detection.label}
        </Text>
        <Text style={styles.meta} numberOfLines={1}>
          {robotName} · {Math.round(detection.confidence * 100)}% confident
        </Text>
      </View>
      <Text style={styles.time}>{timeAgo(detection.at)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm + 4,
    paddingVertical: Spacing.sm + 4,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  text: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
  },
  meta: {
    marginTop: 2,
    fontSize: 13,
    color: Colors.textMuted,
  },
  time: {
    fontSize: 13,
    color: Colors.textMuted,
  },
});
