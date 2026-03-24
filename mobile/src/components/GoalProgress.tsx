// ══════════════════════════════════════════════════════════
// GOAL PROGRESS COMPONENT
// ══════════════════════════════════════════════════════════

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Colors, FontSizes } from '../config/theme';
import { Goal } from '../types';
import { formatCurrency } from '../utils/helpers';

interface GoalProgressProps {
  goal: Goal;
}

export const GoalProgress: React.FC<GoalProgressProps> = ({ goal }) => {
  const animatedWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: goal.porcentagem,
      duration: 800,
      useNativeDriver: false,
    }).start();
  }, [goal.porcentagem]);

  const widthInterpolated = animatedWidth.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  const fillColor = goal.porcentagem >= 70 ? Colors.green[500] : Colors.amber[400];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.name}>{goal.nome}</Text>
        <Text style={styles.nums}>
          {formatCurrency(goal.valorAtual)} / {formatCurrency(goal.valorMeta)}
        </Text>
      </View>
      <View style={styles.track}>
        <Animated.View 
          style={[
            styles.fill, 
            { width: widthInterpolated, backgroundColor: fillColor }
          ]} 
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 6,
  },
  name: {
    fontSize: FontSizes.base,
    fontWeight: '500',
    color: Colors.gray[700],
  },
  nums: {
    fontSize: FontSizes.base,
    color: Colors.gray[500],
    fontVariant: ['tabular-nums'],
  },
  track: {
    height: 8,
    backgroundColor: Colors.gray[100],
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 4,
  },
});
