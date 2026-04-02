// ══════════════════════════════════════════════════════════
// PEDIDO ITEM COMPONENT
// ══════════════════════════════════════════════════════════

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, FontSizes, Spacing, BorderRadius } from '../config/theme';
import { Pedido } from '../types';
import { formatCurrency } from '../utils/helpers';

interface PedidoItemProps {
  pedido: Pedido;
  onEdit?: (pedido: Pedido) => void;
  onDelete?: (pedido: Pedido) => void;
}

export const PedidoItem: React.FC<PedidoItemProps> = ({ pedido, onEdit, onDelete }) => {
  const totalComDesconto = pedido.itens.reduce((s, i) => s + (i.valorComDesconto ?? i.valorTotal), 0);
  const dateStr = pedido.data
    ? new Date(pedido.data + 'T00:00:00').toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    : '';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.farmName}>{pedido.fazendaNome}</Text>
          <Text style={styles.date}>{dateStr}</Text>
        </View>
        <View style={styles.actions}>
          {onEdit && (
            <TouchableOpacity style={styles.actionBtn} onPress={() => onEdit(pedido)}>
              <Text style={styles.actionIcon}>✏️</Text>
            </TouchableOpacity>
          )}
          {onDelete && (
            <TouchableOpacity style={[styles.actionBtn, styles.deleteBtn]} onPress={() => onDelete(pedido)}>
              <Text style={styles.actionIcon}>🗑️</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.items}>
        {pedido.itens.map(item => (
          <View key={item.id} style={styles.itemRow}>
            <Text style={styles.itemName} numberOfLines={1}>{item.produto}</Text>
            <Text style={styles.itemQty}>{item.quantidade} un.</Text>
            <View style={{ alignItems: 'flex-end', minWidth: 85 }}>
              {item.valorComDesconto ? (
                <Text style={styles.itemOriginal}>{formatCurrency(item.valorTotal)}</Text>
              ) : null}
              <Text style={styles.itemTotal}>{formatCurrency(item.valorComDesconto ?? item.valorTotal)}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerLabel}>
          {pedido.itens.length} {pedido.itens.length === 1 ? 'produto' : 'produtos'}
        </Text>
        <View style={{ alignItems: 'flex-end' }}>
          {pedido.valorFinal ? (
            <>
              <Text style={styles.totalOriginal}>{formatCurrency(totalComDesconto)}</Text>
              <Text style={styles.totalValue}>{formatCurrency(pedido.valorFinal)}</Text>
            </>
          ) : (
            <Text style={styles.totalValue}>{formatCurrency(totalComDesconto)}</Text>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[100],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  headerLeft: {
    flex: 1,
  },
  farmName: {
    fontSize: FontSizes.base,
    fontWeight: '700',
    color: Colors.gray[900],
  },
  date: {
    fontSize: FontSizes.sm,
    color: Colors.gray[500],
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  actionBtn: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.gray[50],
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.gray[100],
  },
  deleteBtn: {
    backgroundColor: Colors.red[50],
    borderColor: Colors.red[100],
  },
  actionIcon: {
    fontSize: 14,
  },
  items: {
    gap: 4,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 3,
  },
  itemName: {
    flex: 1,
    fontSize: FontSizes.sm,
    color: Colors.gray[700],
  },
  itemQty: {
    fontSize: FontSizes.sm,
    color: Colors.gray[500],
    marginRight: Spacing.md,
    minWidth: 55,
    textAlign: 'right',
  },
  itemTotal: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: Colors.gray[700],
    textAlign: 'right',
  },
  itemOriginal: {
    fontSize: FontSizes.xs,
    color: Colors.gray[400],
    textDecorationLine: 'line-through',
    textAlign: 'right',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.gray[50],
  },
  footerLabel: {
    fontSize: FontSizes.sm,
    color: Colors.gray[400],
  },
  totalValue: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    color: Colors.green[700],
  },
  totalOriginal: {
    fontSize: FontSizes.sm,
    color: Colors.gray[400],
    textDecorationLine: 'line-through',
    textAlign: 'right',
  },
});
