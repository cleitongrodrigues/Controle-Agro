// ══════════════════════════════════════════════════════════
// FARM ITEM COMPONENT
// ══════════════════════════════════════════════════════════

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, BorderRadius, FontSizes, Spacing } from '../config/theme';
import { Farm } from '../types';

interface FarmItemProps {
  farm: Farm;
  description?: string;
  onPress?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  showActions?: boolean;
}

export const FarmItem: React.FC<FarmItemProps> = ({ 
  farm, 
  description, 
  onPress,
  onEdit,
  onDelete,
  showActions = false,
}) => {
  const dotColor = 
    farm.status === 'visitado' ? Colors.green[500] :
    farm.status === 'pendente' ? Colors.amber[400] :
    Colors.red[600];

  const badgeStyle = 
    farm.status === 'visitado' ? styles.badgeGreen :
    farm.status === 'pendente' ? styles.badgeAmber :
    styles.badgeRed;

  const badgeText = 
    farm.status === 'visitado' ? 'Visitado' :
    farm.status === 'pendente' ? 'Pendente' :
    'Urgente';

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity 
        style={styles.container} 
        onPress={onPress}
        activeOpacity={0.6}
      >
        <View style={[styles.dot, { backgroundColor: dotColor }]} />
        <View style={styles.body}>
          <Text style={styles.name}>{farm.nome}</Text>
          {description && <Text style={styles.meta}>{description}</Text>}
        </View>
        <View style={badgeStyle}>
          <Text style={styles.badgeText}>{badgeText}</Text>
        </View>
      </TouchableOpacity>

      {showActions && (
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={onEdit}
          >
            <Text style={styles.actionIcon}>✏️</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={onDelete}
          >
            <Text style={styles.actionIcon}>🗑️</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[100],
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 13,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  body: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    fontSize: FontSizes.md,
    fontWeight: '500',
    color: Colors.gray[900],
  },
  meta: {
    fontSize: FontSizes.base,
    color: Colors.gray[500],
    marginTop: 2,
  },
  badgeGreen: {
    backgroundColor: Colors.green[50],
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.pill,
  },
  badgeAmber: {
    backgroundColor: Colors.amber[100],
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.pill,
  },
  badgeRed: {
    backgroundColor: Colors.red[100],
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.pill,
  },
  badgeText: {
    fontSize: FontSizes.xs,
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingBottom: Spacing.sm,
  },
  actionButton: {
    backgroundColor: Colors.gray[100],
    paddingHorizontal: Spacing.sm,
    paddingVertical: 6,
    borderRadius: BorderRadius.sm,
  },
  deleteButton: {
    backgroundColor: Colors.red[50],
  },
  actionIcon: {
    fontSize: FontSizes.base,
  },
});

