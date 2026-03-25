// ══════════════════════════════════════════════════════════
// SALE ITEM COMPONENT
// ══════════════════════════════════════════════════════════

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, FontSizes, Spacing } from '../config/theme';
import { Sale } from '../types';
import { formatCurrency } from '../utils/helpers';

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
  const hasDesconto = sale.desconto && sale.desconto > 0;
  const valorFinal = hasDesconto ? (sale.valorComDesconto || sale.valorTotal) : sale.valorTotal;
  
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <Text style={styles.product}>{sale.produto}</Text>
        <View style={styles.tagRow}>
          <Text style={styles.farmTag}>
            {sale.fazendaNome} · {sale.quantidade} un.
          </Text>
          {hasDesconto && (
            <View style={styles.descontoBadge}>
              <Text style={styles.descontoBadgeText}>
                {sale.descontoTipo === 'percentual' ? `${sale.desconto}% OFF` : 'DESCONTO'}
              </Text>
            </View>
          )}
        </View>
      </View>
      <View style={styles.right}>
        <View style={styles.values}>
          {hasDesconto && (
            <Text style={styles.valorOriginal}>
              {formatCurrency(sale.valorTotal)}
            </Text>
          )}
          <Text style={[styles.brl, hasDesconto && styles.brlComDesconto]}>
            {formatCurrency(valorFinal)}
          </Text>
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
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: 3,
  },
  descontoBadge: {
    backgroundColor: Colors.green[600],
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  descontoBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.white,
    letterSpacing: 0.3,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  values: {
    alignItems: 'flex-end',
  },
  valorOriginal: {
    fontSize: FontSizes.xs,
    color: Colors.gray[400],
    textDecorationLine: 'line-through',
    fontVariant: ['tabular-nums'],
    marginBottom: 2,
  },
  brl: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.gray[900],
    fontVariant: ['tabular-nums'],
  },
  brlComDesconto: {
    color: Colors.green[700],
    fontSize: FontSizes.lg,
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
