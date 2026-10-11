import { useWindowDimensions } from 'react-native';

import { Breakpoints } from '@/constants/theme';

/** Window-size flags for switching between phone, tablet, and desktop layouts. */
export function useLayout() {
  const { width, height } = useWindowDimensions();
  return {
    width,
    height,
    isPhone: width < Breakpoints.tablet,
    isTablet: width >= Breakpoints.tablet,
    isDesktop: width >= Breakpoints.desktop,
    /** Horizontal page padding that grows with the window. */
    gutter: width >= Breakpoints.desktop ? 48 : width >= Breakpoints.tablet ? 32 : 20,
  };
}
