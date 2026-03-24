// ══════════════════════════════════════════════════════════
// SYNC BADGE - Badge com contador de itens não sincronizados
// ══════════════════════════════════════════════════════════

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Colors, Spacing, FontSizes, BorderRadius } from '../config/theme';

interface SyncBadgeProps {
  count: number;
  onPress?: () => void;
  syncing?: boolean;
}

export const SyncBadge: React.FC<SyncBadgeProps> = ({ count, onPress, syncing = false }) => {
  if (count === 0 && !syncing) return null;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      disabled={syncing || !onPress}
    >
      {syncing ? (
        <ActivityIndicator size="small" color={Colors.white} />
      ) : (
        <>
          <Text style={styles.icon}>📤</Text>
          <Text style={styles.count}>{count}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.amber[600],
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.pill,
    gap: 4,
  },
  icon: {
    fontSize: FontSizes.sm,
  },
  count: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: Colors.white,
  },
});
