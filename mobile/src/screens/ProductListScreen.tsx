// ══════════════════════════════════════════════════════════
// PRODUCT LIST SCREEN - Gerenciamento de Produtos
// ══════════════════════════════════════════════════════════

import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { AppHeader, ProductFormModal, ConfirmModal, SearchBar } from '../components';
import { globalStyles } from '../styles/global';
import { Colors, Spacing, BorderRadius, FontSizes, Shadows } from '../config/theme';
import { useApp } from '../contexts/AppContext';
import { useToast } from '../contexts/ToastContext';
import { Product } from '../types';

interface ProductListScreenProps {
  visible: boolean;
  onClose: () => void;
}

export const ProductListScreen: React.FC<ProductListScreenProps> = ({ visible, onClose }) => {
  const { products, addProduct, updateProduct, deleteProduct } = useApp();
  const { showToast } = useToast();
  
  const [productFormVisible, setProductFormVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // ============================================
  // PRODUCT HANDLERS
  // ============================================

  const handleAddProduct = () => {
    setEditingProduct(null);
    setProductFormVisible(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductFormVisible(true);
  };

  const handleSaveProduct = async (product: Product) => {
    try {
      if (editingProduct) {
        await updateProduct(product.id, product);
        showToast('Produto atualizado com sucesso!', 'success');
      } else {
        await addProduct(product);
        showToast('Produto cadastrado com sucesso!', 'success');
      }
      setProductFormVisible(false);
      setEditingProduct(null);
    } catch (error) {
      showToast('Erro ao salvar produto', 'error');
    }
  };

  const confirmDeleteProduct = (product: Product) => {
    setDeleteConfirm(product);
  };

  const handleDeleteProduct = async () => {
    if (!deleteConfirm) return;
    
    try {
      await deleteProduct(deleteConfirm.id);
      showToast('Produto removido com sucesso!', 'success');
      setDeleteConfirm(null);
    } catch (error) {
      showToast('Erro ao remover produto', 'error');
    }
  };

  const filteredProducts = products.filter(product =>
    product.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.categoria.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCategoryColor = (categoria: string) => {
    switch (categoria) {
      case 'herbicida': return Colors.green[600];
      case 'semente': return Colors.amber[600];
      case 'fertilizante': return '#8b5cf6';
      case 'fungicida': return Colors.red[600];
      default: return Colors.gray[500];
    }
  };
  if (!visible) return null;
  return (
    <View style={globalStyles.container}>
      <AppHeader 
        title="Gerenciar Produtos" 
        subtitle="Cadastre e edite produtos"
        onBack={onClose}
      />
      
      <ScrollView style={styles.scrollContent}>
        <View style={globalStyles.section}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddProduct}
            >
              <Text style={styles.addButtonText}>➕ Novo Produto</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.searchContainer}>
            <SearchBar
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Buscar produto..."
            />
          </View>

          <View style={globalStyles.card}>
            {filteredProducts.length === 0 ? (
              <Text style={styles.emptyText}>
                {searchQuery ? 'Nenhum produto encontrado' : 'Nenhum produto cadastrado'}
              </Text>
            ) : (
              filteredProducts.map((product, index) => (
                <View key={product.id} style={styles.productItem}>
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
                  <View style={styles.actions}>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleEditProduct(product)}
                    >
                      <Text style={styles.actionIcon}>✏️</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.actionButton, styles.deleteButton]}
                      onPress={() => confirmDeleteProduct(product)}
                    >
                      <Text style={styles.actionIcon}>🗑️</Text>
                    </TouchableOpacity>
                  </View>
                  {index < filteredProducts.length - 1 && (
                    <View style={styles.divider} />
                  )}
                </View>
              ))
            )}
          </View>
        </View>
      </ScrollView>

      {/* Product Form Modal */}
      <ProductFormModal
        visible={productFormVisible}
        product={editingProduct}
        onSave={handleSaveProduct}
        onCancel={() => {
          setProductFormVisible(false);
          setEditingProduct(null);
        }}
      />

      {/* Delete Confirmation */}
      <ConfirmModal
        visible={!!deleteConfirm}
        title="Excluir produto?"
        message={`Deseja realmente excluir o produto "${deleteConfirm?.nome}"?`}
        onConfirm={handleDeleteProduct}
        onCancel={() => setDeleteConfirm(null)}
        destructive
      />
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flex: 1,
  },
  header: {
    marginBottom: Spacing.md,
  },
  addButton: {
    backgroundColor: Colors.green[600],
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignSelf: 'flex-start',
  },
  addButtonText: {
    fontSize: FontSizes.base,
    fontWeight: '600',
    color: Colors.white,
  },
  searchContainer: {
    marginBottom: Spacing.md,
  },
  emptyText: {
    fontSize: FontSizes.base,
    color: Colors.gray[400],
    textAlign: 'center',
    paddingVertical: Spacing.xl,
  },
  productItem: {
    position: 'relative',
  },
  productInfo: {
    flex: 1,
    paddingVertical: Spacing.md,
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
  divider: {
    height: 1,
    backgroundColor: Colors.gray[100],
    marginTop: Spacing.sm,
  },
});
