// ══════════════════════════════════════════════════════════
// METRIC CARD COMPONENT
// ══════════════════════════════════════════════════════════

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, BorderRadius, FontSizes, Shadows } from '../config/theme';
import { Metric } from '../types';

interface MetricCardProps {
  metric: Metric;
}

export const MetricCard: React.FC<MetricCardProps> = ({ metric }) => {
  const isWarning = metric.variant === 'warning';

  return (
    <View style={styles.card}>
      <Text style={styles.label}>{metric.label}</Text>
      <Text style={[styles.value, isWarning && styles.valueWarning]}>
        {metric.value}
      </Text>
      <Text style={[styles.subtitle, isWarning && styles.subtitleWarning]}>
        {metric.subtitle}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.gray[100],
    padding: 14,
    ...Shadows.sm,
  },
  label: {
    fontSize: FontSizes.sm,
    color: Colors.gray[500],
    marginBottom: 4,
  },
  value: {
    fontSize: FontSizes.xxxl,
    fontWeight: '600',
    color: Colors.gray[900],
    lineHeight: 30,
  },
  valueWarning: {
    color: Colors.amber[600],
  },
  subtitle: {
    fontSize: FontSizes.sm,
    color: Colors.green[500],
    marginTop: 4,
  },
  subtitleWarning: {
    color: Colors.amber[600],
  },
});
