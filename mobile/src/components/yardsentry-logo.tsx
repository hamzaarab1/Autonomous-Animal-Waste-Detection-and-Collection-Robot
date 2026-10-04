import Svg, { Circle, G, Path } from 'react-native-svg';

import { Colors } from '@/constants/theme';

/**
 * YardSentry logo. Monoline geometric lettering (6-unit round strokes, 44-unit cap height).
 * The Y is a sprout whose arms are two leaves ("Yard"); the mark puts that sprout inside
 * a shield ("Sentry").
 */

type Tone = 'light' | 'dark';

type LogoProps = {
  /** Rendered width in px; height follows the aspect ratio. */
  width?: number;
  /** `light` for white backgrounds, `dark` for forest-green backgrounds. */
  tone?: Tone;
};

const LEAF_LEFT = 'M15 27 Q-2 25 -1 1 Q18 5 15 27 Z';
const LEAF_RIGHT = 'M15 27 Q32 25 31 1 Q12 5 15 27 Z';

const VIEWBOX = { x: -4, y: -4, w: 290, h: 66 };

export function YardSentryWordmark({ width = 220, tone = 'light' }: LogoProps) {
  const yard = tone === 'light' ? Colors.forest : Colors.white;
  const sentry = tone === 'light' ? Colors.primary : Colors.sprout;
  const leaf = tone === 'light' ? Colors.leaf : Colors.sprout;

  return (
    <Svg
      width={width}
      height={(width * VIEWBOX.h) / VIEWBOX.w}
      viewBox={`${VIEWBOX.x} ${VIEWBOX.y} ${VIEWBOX.w} ${VIEWBOX.h}`}
      accessibilityRole="image"
      accessibilityLabel="YardSentry">
      <G fill="none" strokeWidth={6} strokeLinecap="round" strokeLinejoin="round">
        {/* Yard */}
        <G stroke={yard}>
          <Path d="M15 41 L15 26" />
          <Circle cx={48} cy={30} r={11} />
          <Path d="M59 19 L59 41" />
          <Path d="M69 41 L69 19 M69 29 Q69 19 81 19" />
          <Circle cx={102} cy={30} r={11} />
          <Path d="M113 3 L113 41" />
        </G>
        {/* Sentry */}
        <G stroke={sentry}>
          <Path d="M148 7 C144 2 126 0 126 12 C126 24 150 19 150 32 C150 46 128 44 124 38" />
          <Path d="M159 30 L181 30 A11 11 0 1 0 178.4 37.1" />
          <Path d="M191 41 L191 27 A9.5 9.5 0 0 1 210 27 L210 41" />
          <Path d="M222 6 L222 33 Q222 41 230 41 M216 18 L230 18" />
          <Path d="M240 41 L240 19 M240 29 Q240 19 252 19" />
          <Path d="M258 19 L269 44 M280 19 L266 58" />
        </G>
      </G>
      {/* Sprout leaves forming the arms of the Y */}
      <Path d={LEAF_LEFT} fill={leaf} />
      <Path d={LEAF_RIGHT} fill={leaf} />
    </Svg>
  );
}

/** Shield + sprout icon, for headers, badges, and the app icon. */
export function YardSentryMark({ width = 40, tone = 'light' }: LogoProps) {
  const shield = tone === 'light' ? Colors.forest : Colors.white;
  const stem = tone === 'light' ? Colors.white : Colors.forest;
  const leaf = tone === 'light' ? Colors.sprout : Colors.leaf;

  return (
    <Svg
      width={width}
      height={(width * 54) / 48}
      viewBox="0 0 48 54"
      accessibilityRole="image"
      accessibilityLabel="YardSentry">
      <Path d="M24 2 L44 9 V25 C44 38 35 46 24 51 C13 46 4 38 4 25 V9 Z" fill={shield} />
      <Path d="M24 42 L24 28" stroke={stem} strokeWidth={4} strokeLinecap="round" />
      <Path d="M24 29 Q13 27 13 13 Q24 16 24 29 Z" fill={leaf} />
      <Path d="M24 29 Q35 27 35 13 Q24 16 24 29 Z" fill={leaf} />
    </Svg>
  );
}
