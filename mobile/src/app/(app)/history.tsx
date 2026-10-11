import { View } from 'react-native';

import { DetectionRow } from '@/components/dashboard/detection-row';
import { Card, EmptyState, Page, PageHeader } from '@/components/dashboard/ui';
import { robotName, useDetections, useRobots } from '@/lib/robots';

export default function HistoryScreen() {
  const robots = useRobots();
  const detections = useDetections();

  return (
    <Page>
      <PageHeader title="History" subtitle="Everything your robots found, picked up, or skipped." />
      <Card>
        {detections.length === 0 ? (
          <EmptyState icon="time-outline" title="No history yet" body="Detections from each clean will appear here." />
        ) : (
          <View>
            {detections.map((d) => (
              <DetectionRow key={d.id} detection={d} robotName={robotName(robots, d.robotId)} />
            ))}
          </View>
        )}
      </Card>
    </Page>
  );
}
