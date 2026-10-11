/**
 * YardSentry brand tokens. White surfaces with forest/leaf green accents.
 */

export const Colors = {
  // Brand greens
  forest: '#0F3D2A', // primary dark, wordmark, headings
  primary: '#1F9D5C', // buttons, links
  primaryPressed: '#17804A',
  leaf: '#2EB872', // accents, highlights
  sprout: '#5EE29B', // bright leaf green for dark backgrounds
  mint: '#E8F6EE', // tinted surfaces
  mintStrong: '#CDEBD9',

  // Neutrals
  background: '#FFFFFF',
  surface: '#F5FAF7',
  border: '#DCE8E1',
  text: '#0F2A1E',
  textMuted: '#5B6B63',
  white: '#FFFFFF',

  // Status
  danger: '#C8372D',
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const Radius = {
  sm: 8,
  md: 14,
  lg: 20,
  pill: 999,
} as const;

export const MaxContentWidth = 560;

/** Widest a full page's content grows on large screens before it centers. */
export const PageMaxWidth = 1280;

/** Window widths (px) where layouts switch. Below `tablet` is treated as a phone. */
export const Breakpoints = {
  tablet: 700,
  desktop: 1024,
} as const;
