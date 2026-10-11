/**
 * Robot data model for the dashboard.
 *
 * Everything here is SAMPLE DATA so the dashboard has something to lay out. When the app can talk
 * to a robot (over its local Wi-Fi network), replace the bodies of the `use*` hooks below; the
 * screens only depend on these types and hooks.
 */

export type RobotStatus = 'idle' | 'cleaning' | 'returning' | 'charging' | 'offline' | 'error';

export type Robot = {
  id: string;
  name: string;
  status: RobotStatus;
  /** 0–100 */
  battery: number;
  /** Onboard waste bin fill, 0–100 */
  binFill: number;
  /** Whether an operating boundary has been taught. */
  hasBoundary: boolean;
  /** ISO timestamp */
  lastSeen: string;
};

export type Schedule = {
  id: string;
  robotId: string;
  /** e.g. ['Mon', 'Wed', 'Fri'] */
  days: string[];
  /** 24h "HH:MM" */
  time: string;
  enabled: boolean;
};

export type DetectionKind = 'picked-up' | 'needs-review' | 'ignored';

export type Detection = {
  id: string;
  robotId: string;
  kind: DetectionKind;
  /** What the vision model thought it was, e.g. "Dog waste", "Pinecone". */
  label: string;
  /** 0–1 */
  confidence: number;
  /** ISO timestamp */
  at: string;
};

/** True while the hooks below return made-up data. Screens show a "Sample data" badge. */
export const USING_SAMPLE_DATA = true;

const minutesAgo = (m: number) => new Date(Date.now() - m * 60_000).toISOString();

const SAMPLE_ROBOTS: Robot[] = [
  { id: 'r1', name: 'Backyard Cleaner', status: 'cleaning', battery: 72, binFill: 35, hasBoundary: true, lastSeen: minutesAgo(1) },
  { id: 'r2', name: 'Cottage Cleaner', status: 'charging', battery: 41, binFill: 80, hasBoundary: true, lastSeen: minutesAgo(18) },
];

const SAMPLE_SCHEDULES: Schedule[] = [
  { id: 's1', robotId: 'r1', days: ['Mon', 'Wed', 'Fri'], time: '08:00', enabled: true },
  { id: 's2', robotId: 'r2', days: ['Sat'], time: '10:30', enabled: true },
  { id: 's3', robotId: 'r1', days: ['Sun'], time: '17:00', enabled: false },
];

const SAMPLE_DETECTIONS: Detection[] = [
  { id: 'd1', robotId: 'r1', kind: 'picked-up', label: 'Dog waste', confidence: 0.96, at: minutesAgo(4) },
  { id: 'd2', robotId: 'r1', kind: 'needs-review', label: 'Possible waste', confidence: 0.58, at: minutesAgo(9) },
  { id: 'd3', robotId: 'r1', kind: 'ignored', label: 'Pinecone', confidence: 0.91, at: minutesAgo(12) },
  { id: 'd4', robotId: 'r2', kind: 'picked-up', label: 'Dog waste', confidence: 0.93, at: minutesAgo(190) },
  { id: 'd5', robotId: 'r2', kind: 'ignored', label: 'Rock', confidence: 0.88, at: minutesAgo(200) },
];

export function useRobots(): Robot[] {
  return SAMPLE_ROBOTS;
}

export function useSchedules(): Schedule[] {
  return SAMPLE_SCHEDULES;
}

export function useDetections(): Detection[] {
  return SAMPLE_DETECTIONS;
}

export const STATUS_LABEL: Record<RobotStatus, string> = {
  idle: 'Idle',
  cleaning: 'Cleaning',
  returning: 'Returning home',
  charging: 'Charging',
  offline: 'Offline',
  error: 'Needs attention',
};

export function robotName(robots: Robot[], id: string): string {
  return robots.find((r) => r.id === id)?.name ?? 'Unknown robot';
}

/** "just now", "5 min ago", "3 h ago", "2 d ago" */
export function timeAgo(iso: string): string {
  const minutes = Math.round((Date.now() - new Date(iso).getTime()) / 60_000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes} min ago`;
  if (minutes < 60 * 24) return `${Math.round(minutes / 60)} h ago`;
  return `${Math.round(minutes / (60 * 24))} d ago`;
}
