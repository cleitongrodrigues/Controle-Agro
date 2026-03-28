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
  const { products = [], addProduct, updateProduct, deleteProduct } = useApp();
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
    <View style={[globalStyles.container, styles.fullScreenOverlay]}>
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

          {filteredProducts.length === 0 ? (
            <View style={globalStyles.card}>
              <Text style={styles.emptyText}>
                {searchQuery ? 'Nenhum produto encontrado' : 'Nenhum produto cadastrado'}
              </Text>
            </View>
          ) : (
            filteredProducts.map((product) => (
              <View key={product.id} style={styles.productCard}>
                <View style={styles.productHeader}>
                  <View style={styles.productTitleRow}>
                    <Text style={styles.productName}>{product.nome}</Text>
                    <View
                      style={[
                        styles.categoryBadge,
                        { backgroundColor: getCategoryColor(product.categoria) },
                      ]}
                    >
                      <Text style={styles.categoryText}>
                        {product.categoria}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.productBody}>
                  <View style={styles.priceRow}>
                    <Text style={styles.priceLabel}>Preço:</Text>
                    <Text style={styles.priceValue}>R$ {product.preco.toFixed(2)}</Text>
                  </View>
                </View>

                <View style={styles.productFooter}>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => handleEditProduct(product)}
                  >
                    <Text style={styles.editButtonIcon}>✏️</Text>
                    <Text style={styles.editButtonText}>Editar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => confirmDeleteProduct(product)}
                  >
                    <Text style={styles.deleteButtonIcon}>🗑️</Text>
                    <Text style={styles.deleteButtonText}>Excluir</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
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
  fullScreenOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    backgroundColor: Colors.white,
  },
  scrollContent: {
    flex: 1,
  },
  header: {
    marginBottom: Spacing.md,
  },
  addButton: {
    backgroundColor: Colors.green[600],
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    ...Shadows.sm,
  },
  addButtonText: {
    color: Colors.white,
    fontSize: FontSizes.md,
    fontWeight: '600',
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
  productCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
    ...Shadows.sm,
    overflow: 'hidden',
  },
  productHeader: {
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[100],
  },
  productTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productName: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    color: Colors.gray[900],
    flex: 1,
    marginRight: Spacing.sm,
  },
  productBody: {
    padding: Spacing.md,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: FontSizes.sm,
    color: Colors.gray[700],
    fontWeight: '500',
  },
  priceValue: {
    fontSize: FontSizes.lg,
    color: Colors.green[600],
    fontWeight: '700',
  },
  categoryBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.pill,
  },
  categoryText: {
    fontSize: FontSizes.xs,
    fontWeight: '600',
    color: Colors.white,
  },
  productFooter: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: Colors.gray[100],
  },
  editButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.md,
    gap: Spacing.xs,
    borderRightWidth: 1,
    borderRightColor: Colors.gray[100],
  },
  editButtonIcon: {
    fontSize: 16,
  },
  editButtonText: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: Colors.gray[900],
  },
  deleteButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.md,
    gap: Spacing.xs,
  },
  deleteButtonIcon: {
    fontSize: 16,
  },
  deleteButtonText: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: Colors.red[600],
  },
});
