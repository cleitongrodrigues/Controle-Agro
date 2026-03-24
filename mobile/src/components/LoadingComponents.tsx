// ══════════════════════════════════════════════════════════
// LOADING COMPONENTS - SKELETON E INDICADORES
// ══════════════════════════════════════════════════════════

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Colors, BorderRadius, Spacing } from '../config/theme';

/**
 * Skeleton animado para loading states
 */
export const Skeleton: React.FC<{
  width?: number | string;
  height?: number;
  style?: any;borderRadius?: number;
}> = ({ width = '100%', height = 20, borderRadius = 4, style }) => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, []);

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: Colors.gray[100],
          opacity,
        },
        style,
      ]}
    />
  );
};

/**
 * Skeleton para Card de Métrica
 */
export const MetricCardSkeleton: React.FC = () => (
  <View style={styles.metricCard}>
    <Skeleton width={80} height={12} style={{ marginBottom: 8 }} />
    <Skeleton width={60} height={28} style={{ marginBottom: 6 }} />
    <Skeleton width={100} height={12} />
  </View>
);

/**
 * Skeleton para Item de Fazenda
 */
export const FarmItemSkeleton: React.FC = () => (
  <View style={styles.farmItem}>
    <Skeleton width={10} height={10} borderRadius={5} />
    <View style={{ flex: 1, gap: 6 }}>
      <Skeleton width="60%" height={14} />
      <Skeleton width="80%" height={12} />
    </View>
    <Skeleton width={70} height={24} borderRadius={12} />
  </View>
);

/**
 * Skeleton para Item de Venda
 */
export const SaleItemSkeleton: React.FC = () => (
  <View style={styles.saleItem}>
    <View style={{ flex: 1, gap: 6 }}>
      <Skeleton width="70%" height={14} />
      <Skeleton width="50%" height={12} />
    </View>
    <View style={{ alignItems: 'flex-end', gap: 6 }}>
      <Skeleton width={80} height={14} />
      <Skeleton width={60} height={12} />
    </View>
  </View>
);

/**
 * Loading Overlay para tela inteira
 */
export const LoadingOverlay: React.FC<{ visible: boolean }> = ({ visible }) => {
  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.loadingCard}>
        <Skeleton width={40} height={40} borderRadius={20} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  metricCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.gray[100],
    padding: 14,
  },
  farmItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 13,
  },
  saleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 12,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9998,
  },
  loadingCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    padding: 20,
  },
});
