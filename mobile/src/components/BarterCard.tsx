// ══════════════════════════════════════════════════════════
// BARTER CARD COMPONENT
// ══════════════════════════════════════════════════════════

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, BorderRadius, FontSizes } from '../config/theme';
import { formatSacks } from '../utils/helpers';

interface BarterCardProps {
  sacas: number;
  pricePerSack?: number;
}

export const BarterCard: React.FC<BarterCardProps> = ({ 
  sacas, 
  pricePerSack = 160 
}) => {
  return (
    <View style={styles.card}>
      <Text style={styles.icon}>🌾</Text>
      <View style={styles.body}>
        <Text style={styles.label}>
          Equivale em soja (sc 60kg @ R${pricePerSack})
        </Text>
        <Text style={styles.value}>{formatSacks(sacas)} sacas</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.green[50],
    borderWidth: 1,
    borderColor: Colors.green[100],
    borderRadius: BorderRadius.sm,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  icon: {
    fontSize: 28,
  },
  body: {
    flex: 1,
  },
  label: {
    fontSize: FontSizes.sm,
    color: Colors.green[600],
    marginBottom: 3,
  },
  value: {
    fontSize: FontSizes.xxl,
    fontWeight: '600',
    color: Colors.green[800],
    fontVariant: ['tabular-nums'],
  },
});
