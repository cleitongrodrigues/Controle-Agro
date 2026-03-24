// ══════════════════════════════════════════════════════════
// SALE ITEM COMPONENT
// ══════════════════════════════════════════════════════════

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, FontSizes, Spacing } from '../config/theme';
import { Sale } from '../types';
import { formatCurrency, formatSacks } from '../utils/helpers';

interface SaleItemProps {
  sale: Sale;
  onEdit?: (sale: Sale) => void;
  onDelete?: (sale: Sale) => void;
  showActions?: boolean;
}

export const SaleItem: React.FC<SaleItemProps> = ({ 
  sale, 
  onEdit, 
  onDelete,
  showActions = false,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <Text style={styles.product}>{sale.produto}</Text>
        <Text style={styles.farmTag}>
          {sale.fazendaNome} · {sale.quantidade} un.
        </Text>
      </View>
      <View style={styles.right}>
        <View style={styles.values}>
          <Text style={styles.brl}>{formatCurrency(sale.valorTotal)}</Text>
          <Text style={styles.sacas}>{formatSacks(sale.sacasSoja)} sacas</Text>
        </View>
        {showActions && (onEdit || onDelete) && (
          <View style={styles.actions}>
            {onEdit && (
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => onEdit(sale)}
              >
                <Text style={styles.actionIcon}>✏️</Text>
              </TouchableOpacity>
            )}
            {onDelete && (
              <TouchableOpacity 
                style={[styles.actionButton, styles.deleteButton]}
                onPress={() => onDelete(sale)}
              >
                <Text style={styles.actionIcon}>🗑️</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[100],
  },
  left: {
    flex: 1,
  },
  product: {
    fontSize: FontSizes.md,
    fontWeight: '500',
    color: Colors.gray[900],
  },
  farmTag: {
    fontSize: FontSizes.sm,
    color: Colors.gray[500],
    marginTop: 3,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  values: {
    alignItems: 'flex-end',
  },
  brl: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.gray[900],
    fontVariant: ['tabular-nums'],
  },
  sacas: {
    fontSize: FontSizes.sm,
    color: Colors.gray[500],
    marginTop: 3,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  actionButton: {
    width: 32,
    height: 32,
    backgroundColor: Colors.gray[100],
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButton: {
    backgroundColor: Colors.red[100],
  },
  actionIcon: {
    fontSize: FontSizes.sm,
  },
});
