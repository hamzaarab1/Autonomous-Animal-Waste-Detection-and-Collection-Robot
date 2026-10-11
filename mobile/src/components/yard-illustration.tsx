import Svg, { Circle, G, Path, Rect, Text as SvgText } from 'react-native-svg';

import { Colors } from '@/constants/theme';

/**
 * Hero illustration: a top-down yard with a taught boundary, the robot's path,
 * and a detected target. Mirrors the boundary-teaching and detection concepts.
 */
export function YardIllustration({ width = 320 }: { width?: number }) {
  return (
    <Svg width={width} height={(width * 200) / 320} viewBox="0 0 320 200">
      {/* Lawn */}
      <Rect x={0} y={0} width={320} height={200} rx={20} fill={Colors.mint} />

      {/* Grass tufts */}
      <G stroke={Colors.mintStrong} strokeWidth={2} strokeLinecap="round">
        {[
          [30, 30], [92, 22], [270, 34], [300, 120], [24, 150],
          [140, 178], [250, 182], [190, 20], [60, 96], [292, 72],
        ].map(([x, y]) => (
          <Path key={`${x}-${y}`} d={`M${x} ${y} l-3 -7 M${x} ${y} l0 -8 M${x} ${y} l3 -7`} />
        ))}
      </G>

      {/* Taught operating boundary */}
      <Path
        d="M48 48 L246 38 L284 104 L254 166 L70 172 L38 112 Z"
        fill={Colors.white}
        fillOpacity={0.55}
        stroke={Colors.forest}
        strokeWidth={2}
        strokeDasharray="7 6"
        strokeLinejoin="round"
      />
      {[
        [48, 48], [246, 38], [284, 104], [254, 166], [70, 172], [38, 112],
      ].map(([x, y]) => (
        <Circle key={`${x}-${y}`} cx={x} cy={y} r={4.5} fill={Colors.white} stroke={Colors.forest} strokeWidth={2} />
      ))}

      {/* Home position */}
      <Circle cx={92} cy={140} r={12} fill="none" stroke={Colors.primary} strokeWidth={2} />
      <Circle cx={92} cy={140} r={4} fill={Colors.primary} />

      {/* Robot path to target */}
      <Path
        d="M104 132 C140 110 150 88 186 86"
        fill="none"
        stroke={Colors.primary}
        strokeWidth={2.5}
        strokeDasharray="2 6"
        strokeLinecap="round"
      />

      {/* Detected target with bounding box */}
      <Rect x={194} y={70} width={34} height={32} rx={4} fill="none" stroke={Colors.leaf} strokeWidth={2} />
      <Path d="M203 94 q8 -14 16 0 Z" fill="#8A6A4F" />
      <Rect x={194} y={52} width={78} height={16} rx={4} fill={Colors.leaf} />
      <SvgText x={199} y={64} fontSize={10} fontWeight="700" fill={Colors.white}>
        target · 0.94
      </SvgText>

      {/* Robot (top-down) */}
      <G transform="translate(150 98) rotate(-28)">
        <Rect x={-6} y={-16} width={6} height={10} rx={2} fill={Colors.forest} />
        <Rect x={-6} y={6} width={6} height={10} rx={2} fill={Colors.forest} />
        <Rect x={20} y={-16} width={6} height={10} rx={2} fill={Colors.forest} />
        <Rect x={20} y={6} width={6} height={10} rx={2} fill={Colors.forest} />
        <Rect x={-4} y={-12} width={28} height={24} rx={6} fill={Colors.forest} />
        <Circle cx={18} cy={0} r={3.5} fill={Colors.leaf} />
      </G>
    </Svg>
  );
}
