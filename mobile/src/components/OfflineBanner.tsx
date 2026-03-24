// ══════════════════════════════════════════════════════════
// OFFLINE BANNER - Banner de modo offline
// ══════════════════════════════════════════════════════════

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, FontSizes } from '../config/theme';

interface OfflineBannerProps {
  visible: boolean;
  unsyncedCount?: number;
}

export const OfflineBanner: React.FC<OfflineBannerProps> = ({ 
  visible, 
  unsyncedCount = 0 
}) => {
  if (!visible) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>📡</Text>
      <Text style={styles.text}>
        Modo Offline {unsyncedCount > 0 && `• ${unsyncedCount} ${unsyncedCount === 1 ? 'item' : 'itens'} pendente${unsyncedCount === 1 ? '' : 's'}`}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.amber[600],
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
  },
  icon: {
    fontSize: FontSizes.base,
  },
  text: {
    fontSize: FontSizes.sm,
    fontWeight: '500',
    color: Colors.white,
  },
});
