// ══════════════════════════════════════════════════════════
// PRODUCT FORM MODAL - Modal de cadastro/edição de produtos
// ══════════════════════════════════════════════════════════

import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Colors, Spacing, BorderRadius, FontSizes, Shadows } from '../config/theme';
import { Product } from '../types';
import { parseDecimal, sanitizeDecimalInput } from '../utils/helpers';

interface ProductFormModalProps {
  visible: boolean;
  product?: Product | null;
  onSave: (product: Product) => void;
  onCancel: () => void;
}

const CATEGORIES = [
  { value: 'herbicida', label: 'Herbicida', color: Colors.green[600] },
  { value: 'semente', label: 'Semente', color: Colors.amber[600] },
  { value: 'fertilizante', label: 'Fertilizante', color: '#8b5cf6' },
  { value: 'fungicida', label: 'Fungicida', color: Colors.red[600] },
  { value: 'outro', label: 'Outro', color: Colors.gray[500] },
] as const;

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  visible,
  product,
  onSave,
  onCancel,
}) => {
  const [nome, setNome] = useState('');
  const [categoria, setCategoria] = useState<string>('herbicida');
  const [preco, setPreco] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEditing = !!product;

  useEffect(() => {
    if (product) {
      setNome(product.nome);
      setCategoria(product.categoria);
      setPreco(product.preco.toString());
    } else {
      resetForm();
    }
  }, [product, visible]);

  const resetForm = () => {
    setNome('');
    setCategoria('herbicida');
    setPreco('');
    setErrors({});
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }

    const precoNum = parseDecimal(preco);
    if (!preco || isNaN(precoNum) || precoNum <= 0) {
      newErrors.preco = 'Preço deve ser maior que zero';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    const productData: Product = {
      id: product?.id || Date.now().toString(),
      nome: nome.trim(),
      categoria: categoria as any,
      preco: parseDecimal(preco),
    };

    onSave(productData);
    resetForm();
  };

  const handleCancel = () => {
    resetForm();
    onCancel();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleCancel}
    >
      <View style={styles.backdrop}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>
              {isEditing ? '✏️ Editar Produto' : '➕ Novo Produto'}
            </Text>
            <TouchableOpacity onPress={handleCancel} style={styles.closeButton}>
              <Text style={styles.closeIcon}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            {/* Nome */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Nome do Produto *</Text>
              <TextInput
                style={[styles.input, errors.nome && styles.inputError]}
                value={nome}
                onChangeText={(text) => {
                  setNome(text);
                  setErrors(prev => ({ ...prev, nome: '' }));
                }}
                placeholder="Ex: Herbicida Roundup 20L"
                placeholderTextColor={Colors.gray[300]}
              />
              {errors.nome && <Text style={styles.errorText}>{errors.nome}</Text>}
            </View>

            {/* Categoria */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Categoria *</Text>
              <View style={styles.categoryGrid}>
                {CATEGORIES.map(cat => (
                  <TouchableOpacity
                    key={cat.value}
                    onPress={() => setCategoria(cat.value)}
                    style={[
                      styles.categoryOption,
                      categoria === cat.value && {
                        borderColor: cat.color,
                        backgroundColor: `${cat.color}15`,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.categoryText,
                        categoria === cat.value && { color: cat.color, fontWeight: '600' },
                      ]}
                    >
                      {cat.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Preço */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Preço Unitário (R$) *</Text>
              <TextInput
                style={[styles.input, errors.preco && styles.inputError]}
                value={preco}
                onChangeText={(text) => {
                  setPreco(sanitizeDecimalInput(text));
                  setErrors(prev => ({ ...prev, preco: '' }));
                }}
                placeholder="Ex: 185,00"
                keyboardType="decimal-pad"
                placeholderTextColor={Colors.gray[300]}
              />
              {errors.preco && <Text style={styles.errorText}>{errors.preco}</Text>}
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.button, styles.buttonCancel]}
              onPress={handleCancel}
            >
              <Text style={styles.buttonCancelText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.buttonSave]}
              onPress={handleSave}
            >
              <Text style={styles.buttonSaveText}>
                {isEditing ? 'Atualizar' : 'Cadastrar'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.md,
  },
  container: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    width: '100%',
    maxWidth: 500,
    maxHeight: '90%',
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
  content: {
    padding: Spacing.lg,
  },
  formGroup: {
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: FontSizes.sm,
    fontWeight: '500',
    color: Colors.gray[700],
    marginBottom: Spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.gray[100],
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: FontSizes.base,
    color: Colors.gray[900],
    backgroundColor: Colors.gray[50],
  },
  inputError: {
    borderColor: Colors.red[600],
    borderWidth: 1.5,
  },
  errorText: {
    fontSize: FontSizes.xs,
    color: Colors.red[600],
    marginTop: 4,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  categoryOption: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderWidth: 1.5,
    borderColor: Colors.gray[100],
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.white,
  },
  categoryText: {
    fontSize: FontSizes.sm,
    color: Colors.gray[700],
  },
  footer: {
    flexDirection: 'row',
    gap: Spacing.md,
    padding: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.gray[100],
  },
  button: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
  },
  buttonCancel: {
    backgroundColor: Colors.gray[100],
  },
  buttonCancelText: {
    fontSize: FontSizes.base,
    fontWeight: '600',
    color: Colors.gray[700],
  },
  buttonSave: {
    backgroundColor: Colors.green[600],
  },
  buttonSaveText: {
    fontSize: FontSizes.base,
    fontWeight: '600',
    color: Colors.white,
  },
});
