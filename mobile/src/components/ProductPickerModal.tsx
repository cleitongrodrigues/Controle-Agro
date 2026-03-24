// ══════════════════════════════════════════════════════════
// PRODUCT PICKER MODAL - Modal de seleção de produto com busca
// ══════════════════════════════════════════════════════════

import React, { useState, useMemo } from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Colors, Spacing, BorderRadius, FontSizes, Shadows } from '../config/theme';
import { Product } from '../types';
import { SearchBar } from './SearchBar';

interface ProductPickerModalProps {
  visible: boolean;
  products: Product[];
  selectedId?: string;
  onSelect: (product: Product) => void;
  onClose: () => void;
}

export const ProductPickerModal: React.FC<ProductPickerModalProps> = ({
  visible,
  products,
  selectedId,
  onSelect,
  onClose,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;
    
    const query = searchQuery.toLowerCase();
    return products.filter(product =>
      product.nome.toLowerCase().includes(query) ||
      product.categoria.toLowerCase().includes(query)
    );
  }, [products, searchQuery]);

  const handleSelect = (product: Product) => {
    onSelect(product);
    setSearchQuery('');
    onClose();
  };

  const getCategoryColor = (categoria: string) => {
    switch (categoria) {
      case 'herbicida': return Colors.green[600];
      case 'semente': return Colors.amber[600];
      case 'fertilizante': return '#8b5cf6';
      case 'fungicida': return Colors.red[600];
      default: return Colors.gray[500];
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Selecionar Produto</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeIcon}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.searchContainer}>
            <SearchBar
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Buscar produto..."
            />
          </View>

          <ScrollView style={styles.content}>
            {filteredProducts.length === 0 ? (
              <Text style={styles.emptyText}>
                {searchQuery ? 'Nenhum produto encontrado' : 'Nenhum produto cadastrado'}
              </Text>
            ) : (
              filteredProducts.map((product) => (
                <TouchableOpacity
                  key={product.id}
                  style={[
                    styles.productItem,
                    selectedId === product.id && styles.productItemSelected,
                  ]}
                  onPress={() => handleSelect(product)}
                >
                  <View style={styles.productInfo}>
                    <Text style={styles.productName}>{product.nome}</Text>
                    <View style={styles.productMeta}>
                      <View
                        style={[
                          styles.categoryBadge,
                          { backgroundColor: `${getCategoryColor(product.categoria)}20` },
                        ]}
                      >
                        <Text
                          style={[
                            styles.categoryText,
                            { color: getCategoryColor(product.categoria) },
                          ]}
                        >
                          {product.categoria}
                        </Text>
                      </View>
                      <Text style={styles.priceText}>
                        R$ {product.preco.toFixed(2)}
                      </Text>
                    </View>
                  </View>
                  {selectedId === product.id && (
                    <Text style={styles.checkIcon}>✓</Text>
                  )}
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: BorderRadius.lg,
    borderTopRightRadius: BorderRadius.lg,
    maxHeight: '80%',
    ...Shadows.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[100],
  },
  title: {
    fontSize: FontSizes.xl,
    fontWeight: '600',
    color: Colors.gray[900],
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.gray[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIcon: {
    fontSize: FontSizes.lg,
    color: Colors.gray[700],
  },
  searchContainer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  emptyText: {
    fontSize: FontSizes.base,
    color: Colors.gray[400],
    textAlign: 'center',
    paddingVertical: Spacing.xxl,
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.sm,
    backgroundColor: Colors.gray[50],
  },
  productItemSelected: {
    backgroundColor: Colors.green[50],
    borderWidth: 1,
    borderColor: Colors.green[600],
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: FontSizes.base,
    fontWeight: '500',
    color: Colors.gray[900],
    marginBottom: 4,
  },
  productMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  categoryBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.pill,
  },
  categoryText: {
    fontSize: FontSizes.xs,
    fontWeight: '500',
  },
  priceText: {
    fontSize: FontSizes.sm,
    color: Colors.gray[700],
    fontWeight: '600',
  },
  checkIcon: {
    fontSize: FontSizes.xl,
    color: Colors.green[600],
  },
});
