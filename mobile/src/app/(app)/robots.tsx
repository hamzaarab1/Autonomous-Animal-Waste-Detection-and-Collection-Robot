import Ionicons from '@expo/vector-icons/Ionicons';

import { Button } from '@/components/button';
import { RobotCard } from '@/components/dashboard/robot-card';
import { Grid } from '@/components/grid';
import { Card, EmptyState, Page, PageHeader } from '@/components/dashboard/ui';
import { Colors } from '@/constants/theme';
import { useLayout } from '@/hooks/use-layout';
import { notify } from '@/lib/notify';
import { useRobots } from '@/lib/robots';

export default function RobotsScreen() {
  const { isPhone, width } = useLayout();
  const robots = useRobots();
  const pair = () => notify('Pair a robot', 'Robot pairing is coming soon.');

  return (
    <Page>
      <PageHeader
        title="Robots"
        subtitle="Each robot has its own name, boundary, and schedule."
        action={
          <Button
            title="Pair a robot"
            icon={<Ionicons name="qr-code-outline" size={18} color={Colors.white} />}
            onPress={pair}
          />
        }
      />
      {robots.length === 0 ? (
        <Card>
          <EmptyState
            icon="qr-code-outline"
            title="No robots yet"
            body="Pair your YardSentry by scanning the QR code in its box. Then teach it the boundary of your yard."
            action={<Button title="Pair a robot" onPress={pair} />}
          />
        </Card>
      ) : (
        <Grid columns={isPhone ? 1 : width >= 1280 ? 3 : 2}>
          {robots.map((r) => (
            <RobotCard key={r.id} robot={r} />
          ))}
        </Grid>
      )}
    </Page>
  );
}
