import { Children, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { Spacing } from '@/constants/theme';

/**
 * Lays children out in `columns` equal columns, wrapping onto new rows.
 * Pass a different `columns` per breakpoint from the caller.
 */
export function Grid({ columns, gap = Spacing.md, children }: { columns: number; gap?: number; children: ReactNode }) {
  return (
    <View style={[styles.grid, { margin: -gap / 2 }]}>
      {Children.toArray(children).map((child, i) => (
        <View key={i} style={{ width: `${100 / columns}%`, padding: gap / 2 }}>
          {child}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
