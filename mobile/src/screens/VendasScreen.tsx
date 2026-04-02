// ══════════════════════════════════════════════════════════
// VENDAS SCREEN — carrinho com múltiplos produtos
// ══════════════════════════════════════════════════════════

import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import {
  AppHeader,
  SearchBar,
  ConfirmModal,
  ProductPickerModal,
  FarmPickerModal,
  PedidoItem,
} from '../components';
import { globalStyles } from '../styles/global';
import { Colors, Spacing, BorderRadius, FontSizes } from '../config/theme';
import { Pedido, Product, Farm } from '../types';
import { generateId, formatDateISO, parseDecimal, sanitizeDecimalInput, formatCurrency } from '../utils/helpers';
import { useToast } from '../contexts/ToastContext';
import { useApp } from '../contexts/AppContext';

interface CartItem {
  tempId: string;
  produtoId: string;
  produto: string;
  categoria: string;
  quantidade: number;
  valorUnitario: number;
  valorTotal: number;
  desconto?: number;
  descontoTipo?: 'percentual' | 'valor';
  valorComDesconto?: number;
}

export const VendasScreen: React.FC = () => {
  const { showToast } = useToast();
  const { farms = [], pedidos = [], products = [], addPedido, updatePedido, deletePedido, loading: appLoading } = useApp();

  // Cabeçalho do pedido
  const [fazendaId, setFazendaId] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  // Formulário de item
  const [produtoId, setProdutoId] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [valorUnitario, setValorUnitario] = useState('');
  const [temDesconto, setTemDesconto] = useState(false);
  const [descontoTipo, setDescontoTipo] = useState<'percentual' | 'valor'>('percentual');
  const [descontoValor, setDescontoValor] = useState('');

  // Desconto no total do pedido
  const [temDescontoPedido, setTemDescontoPedido] = useState(false);
  const [descontoTipoPedido, setDescontoTipoPedido] = useState<'percentual' | 'valor'>('percentual');
  const [descontoValorPedido, setDescontoValorPedido] = useState('');

  // Carrinho
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<Pedido | null>(null);
  const [productModalVisible, setProductModalVisible] = useState(false);
  const [farmModalVisible, setFarmModalVisible] = useState(false);

  const selectedFarm = farms.find(f => f.id === fazendaId);
  const selectedProduct = products.find(p => p.id === produtoId);

  const qtd = parseDecimal(quantidade);
  const valor = parseDecimal(valorUnitario);
  const desconto = parseDecimal(descontoValor);
  const itemSubtotal = qtd * valor;
  let itemDescontoValor = 0;
  if (temDesconto && desconto > 0) {
    itemDescontoValor = descontoTipo === 'percentual'
      ? (itemSubtotal * desconto) / 100
      : desconto;
  }
  const itemFinal = itemSubtotal - itemDescontoValor;
  const cartTotal = cartItems.reduce((sum, item) => sum + (item.valorComDesconto ?? item.valorTotal), 0);

  const descontoPedido = parseDecimal(descontoValorPedido);
  let pedidoDescontoValor = 0;
  if (temDescontoPedido && descontoPedido > 0) {
    pedidoDescontoValor = descontoTipoPedido === 'percentual'
      ? (cartTotal * descontoPedido) / 100
      : descontoPedido;
  }
  const pedidoFinal = cartTotal - pedidoDescontoValor;

  const filteredPedidos = useMemo(() => {
    if (!searchQuery) return pedidos;
    const query = searchQuery.toLowerCase();
    return pedidos.filter(p =>
      p.fazendaNome.toLowerCase().includes(query) ||
      p.itens.some(i => i.produto.toLowerCase().includes(query))
    );
  }, [pedidos, searchQuery]);

  const handleProductSelect = (product: Product) => {
    setProdutoId(product.id);
    setValorUnitario(sanitizeDecimalInput(product.preco.toString()));
    setErrors(prev => ({ ...prev, produto: '', valor: '' }));
    setProductModalVisible(false);
  };

  const handleFarmSelect = (farm: Farm) => {
    setFazendaId(farm.id);
    setErrors(prev => ({ ...prev, fazenda: '' }));
    setFarmModalVisible(false);
  };

  const handleAddToCart = () => {
    const newErrors: Record<string, string> = {};
    if (!produtoId) newErrors.produto = 'Selecione um produto';
    if (qtd <= 0) newErrors.quantidade = 'Quantidade deve ser maior que zero';
    if (valor <= 0) newErrors.valor = 'Produto sem preço definido';
    if (cartItems.some(item => item.produtoId === produtoId)) {
      newErrors.produto = 'Este produto já está no carrinho';
    }
    if (temDesconto && desconto <= 0) newErrors.desconto = 'Valor do desconto deve ser maior que zero';
    if (temDesconto && descontoTipo === 'percentual' && desconto > 100) newErrors.desconto = 'Percentual não pode ser maior que 100%';
    if (temDesconto && descontoTipo === 'valor' && desconto >= itemSubtotal) newErrors.desconto = 'Desconto não pode ser maior que o subtotal';
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    const product = products.find(p => p.id === produtoId)!;
    setCartItems(prev => [
      ...prev,
      {
        tempId: generateId(),
        produtoId,
        produto: product.nome,
        categoria: product.categoria,
        quantidade: qtd,
        valorUnitario: valor,
        valorTotal: itemSubtotal,
        desconto: temDesconto && desconto > 0 ? desconto : undefined,
        descontoTipo: temDesconto && desconto > 0 ? descontoTipo : undefined,
        valorComDesconto: temDesconto && desconto > 0 ? itemFinal : undefined,
      },
    ]);
    setProdutoId('');
    setValorUnitario('');
    setQuantidade('');
    setTemDesconto(false);
    setDescontoValor('');
    setDescontoTipo('percentual');
    setErrors({});
  };

  const handleRemoveCartItem = (tempId: string) => {
    setCartItems(prev => prev.filter(item => item.tempId !== tempId));
  };

  const handleEdit = (pedido: Pedido) => {
    setEditingId(pedido.id);
    setFazendaId(pedido.fazendaId);
    setCartItems(
      pedido.itens.map(item => ({
        tempId: item.id,
        produtoId: item.produtoId,
        produto: item.produto,
        categoria: item.categoria,
        quantidade: item.quantidade,
        valorUnitario: item.valorUnitario,
        valorTotal: item.valorTotal,
        desconto: item.desconto,
        descontoTipo: item.descontoTipo,
        valorComDesconto: item.valorComDesconto,
      }))
    );
    setProdutoId('');
    setValorUnitario('');
    setQuantidade('');
    setTemDesconto(false);
    setDescontoValor('');
    setDescontoTipo('percentual');
    setTemDescontoPedido(pedido.desconto != null && pedido.desconto > 0);
    setDescontoValorPedido(pedido.desconto != null ? pedido.desconto.toString() : '');
    setDescontoTipoPedido(pedido.descontoTipo ?? 'percentual');
    setErrors({});
    showToast('Modo de edição ativado', 'info');
  };

  const resetForm = () => {
    setEditingId(null);
    setFazendaId('');
    setCartItems([]);
    setProdutoId('');
    setValorUnitario('');
    setQuantidade('');
    setTemDesconto(false);
    setDescontoValor('');
    setDescontoTipo('percentual');
    setTemDescontoPedido(false);
    setDescontoValorPedido('');
    setDescontoTipoPedido('percentual');
    setErrors({});
  };

  const confirmDelete = (pedido: Pedido) => setDeleteConfirm(pedido);

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await deletePedido(deleteConfirm.id);
      showToast('Pedido excluído', 'success');
      setDeleteConfirm(null);
    } catch {
      showToast('Erro ao excluir pedido', 'error');
    }
  };

  const handleConfirmPedido = async () => {
    const newErrors: Record<string, string> = {};
    if (!fazendaId) newErrors.fazenda = 'Selecione uma fazenda';
    if (cartItems.length === 0) newErrors.cart = 'Adicione pelo menos um produto ao carrinho';
    if (temDescontoPedido && descontoPedido <= 0) newErrors.descontoPedido = 'Valor do desconto deve ser maior que zero';
    if (temDescontoPedido && descontoTipoPedido === 'percentual' && descontoPedido > 100) newErrors.descontoPedido = 'Percentual não pode ser maior que 100%';
    if (temDescontoPedido && descontoTipoPedido === 'valor' && descontoPedido >= cartTotal) newErrors.descontoPedido = 'Desconto não pode ser maior que o total';
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showToast('Preencha todos os campos obrigatórios', 'error');
      return;
    }
    const fazenda = farms.find(f => f.id === fazendaId)!;
    setLoading(true);
    try {
      const pedidoPayload = {
        fazendaId,
        fazendaNome: fazenda.nome,
        itens: cartItems.map(item => ({
          produtoId: item.produtoId,
          produto: item.produto,
          categoria: item.categoria,
          quantidade: item.quantidade,
          valorUnitario: item.valorUnitario,
          valorTotal: item.valorTotal,
          desconto: item.desconto,
          descontoTipo: item.descontoTipo,
          valorComDesconto: item.valorComDesconto,
        })),
        valorTotal: cartTotal,
        desconto: temDescontoPedido && descontoPedido > 0 ? descontoPedido : undefined,
        descontoTipo: temDescontoPedido && descontoPedido > 0 ? descontoTipoPedido : undefined,
        valorFinal: temDescontoPedido && descontoPedido > 0 ? pedidoFinal : undefined,
        data: formatDateISO(new Date()),
        sincronizado: false,
      };
      if (editingId) {
        await updatePedido(editingId, pedidoPayload);
        showToast('✅ Pedido atualizado com sucesso!', 'success');
      } else {
        await addPedido(pedidoPayload);
        showToast('✅ Pedido registrado com sucesso!', 'success');
      }
      resetForm();
    } catch {
      showToast(editingId ? 'Erro ao atualizar pedido' : 'Erro ao registrar pedido', 'error');
    } finally {
      setLoading(false);
    }
  };

  const hasCartOrEdit = editingId !== null || cartItems.length > 0;

  return (
    <View style={globalStyles.container}>
      <AppHeader title="Vendas" subtitle="Registre pedidos com múltiplos produtos" />

      <ScrollView style={styles.scrollContent}>
        <View style={globalStyles.section}>

          {/* ── Cabeçalho do pedido ── */}
          <Text style={globalStyles.sectionTitle}>
            {editingId ? '✏️ Editar pedido' : 'Novo pedido'}
          </Text>
          <View style={globalStyles.card}>

            {/* Fazenda */}
            <View style={globalStyles.formGroup}>
              <Text style={globalStyles.formLabel}>Fazenda</Text>
              <TouchableOpacity
                style={[globalStyles.input, styles.pickerButton, errors.fazenda && styles.inputError]}
                onPress={() => setFarmModalVisible(true)}
              >
                <Text style={selectedFarm ? styles.pickerButtonText : styles.pickerPlaceholder}>
                  {selectedFarm ? selectedFarm.nome : 'Selecione uma fazenda'}
                </Text>
                <Text style={styles.dropdownIcon}>▼</Text>
              </TouchableOpacity>
              {errors.fazenda ? <Text style={styles.errorText}>{errors.fazenda}</Text> : null}
            </View>

            {/* ── Adicionar item ── */}
            <View style={styles.addItemSection}>
              <Text style={styles.sectionLabel}>ADICIONAR PRODUTO</Text>

              <View style={globalStyles.formGroup}>
                <Text style={globalStyles.formLabel}>Produto</Text>
                <TouchableOpacity
                  style={[globalStyles.input, styles.pickerButton, errors.produto && styles.inputError]}
                  onPress={() => setProductModalVisible(true)}
                >
                  <Text style={selectedProduct ? styles.pickerButtonText : styles.pickerPlaceholder}>
                    {selectedProduct ? selectedProduct.nome : 'Selecione um produto'}
                  </Text>
                  <Text style={styles.dropdownIcon}>▼</Text>
                </TouchableOpacity>
                {errors.produto ? <Text style={styles.errorText}>{errors.produto}</Text> : null}
              </View>

              <View style={styles.formRow}>
                <View style={[globalStyles.formGroup, { flex: 1 }]}>
                  <Text style={globalStyles.formLabel}>Quantidade</Text>
                  <TextInput
                    style={[globalStyles.input, errors.quantidade && styles.inputError]}
                    value={quantidade}
                    onChangeText={text => {
                      setQuantidade(sanitizeDecimalInput(text));
                      setErrors(prev => ({ ...prev, quantidade: '' }));
                    }}
                    keyboardType="decimal-pad"
                    placeholder="0"
                  />
                  {errors.quantidade ? <Text style={styles.errorText}>{errors.quantidade}</Text> : null}
                </View>
                <View style={[globalStyles.formGroup, { flex: 1 }]}>
                  <Text style={globalStyles.formLabel}>Valor unit. (R$)</Text>
                  <TextInput
                    style={[globalStyles.input, { backgroundColor: Colors.gray[50], color: Colors.gray[500] }]}
                    value={valorUnitario}
                    editable={false}
                  />
                  {errors.valor ? <Text style={styles.errorText}>{errors.valor}</Text> : null}
                </View>
              </View>

              {qtd > 0 && valor > 0 ? (
                <View style={styles.descontoSection}>
                  <View style={styles.descontoHeader}>
                    <Text style={globalStyles.formLabel}>Aplicar desconto</Text>
                    <Switch
                      value={temDesconto}
                      onValueChange={v => {
                        setTemDesconto(v);
                        if (!v) { setDescontoValor(''); setDescontoTipo('percentual'); }
                      }}
                      trackColor={{ false: Colors.gray[200], true: Colors.green[200] }}
                      thumbColor={temDesconto ? Colors.green[600] : Colors.gray[400]}
                    />
                  </View>

                  {temDesconto && (
                    <View style={styles.descontoInputs}>
                      <View style={styles.descontoTipoRow}>
                        <TouchableOpacity
                          style={[styles.tipoButton, descontoTipo === 'percentual' && styles.tipoButtonActive]}
                          onPress={() => { if (descontoTipo !== 'percentual') { setDescontoTipo('percentual'); setDescontoValor(''); } }}
                        >
                          <Text style={[styles.tipoButtonText, descontoTipo === 'percentual' && styles.tipoButtonTextActive]}>% Percentual</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.tipoButton, descontoTipo === 'valor' && styles.tipoButtonActive]}
                          onPress={() => { if (descontoTipo !== 'valor') { setDescontoTipo('valor'); setDescontoValor(''); } }}
                        >
                          <Text style={[styles.tipoButtonText, descontoTipo === 'valor' && styles.tipoButtonTextActive]}>R$ Valor fixo</Text>
                        </TouchableOpacity>
                      </View>
                      <View style={globalStyles.formGroup}>
                        <Text style={globalStyles.formLabel}>{descontoTipo === 'percentual' ? 'Percentual (%)' : 'Valor (R$)'}</Text>
                        <TextInput
                          style={[globalStyles.input, errors.desconto && styles.inputError]}
                          value={descontoValor}
                          onChangeText={t => { setDescontoValor(sanitizeDecimalInput(t)); setErrors(prev => ({ ...prev, desconto: '' })); }}
                          keyboardType="decimal-pad"
                          placeholder={descontoTipo === 'percentual' ? '10' : '50'}
                        />
                        {errors.desconto ? <Text style={styles.errorText}>{errors.desconto}</Text> : null}
                      </View>
                    </View>
                  )}

                  <View style={styles.itemPreview}>
                    {temDesconto && itemDescontoValor > 0 ? (
                      <>
                        <View style={styles.previewRow}>
                          <Text style={styles.itemPreviewLabel}>Subtotal:</Text>
                          <Text style={styles.itemPreviewValue}>{formatCurrency(itemSubtotal)}</Text>
                        </View>
                        <View style={styles.previewRow}>
                          <Text style={[styles.itemPreviewLabel, { color: Colors.red[600] }]}>Desconto:</Text>
                          <Text style={[styles.itemPreviewValue, { color: Colors.red[600] }]}>- {formatCurrency(itemDescontoValor)}</Text>
                        </View>
                        <View style={[styles.previewRow, { paddingTop: Spacing.xs, borderTopWidth: 1, borderTopColor: Colors.gray[100] }]}>
                          <Text style={[styles.itemPreviewLabel, { fontWeight: '700' }]}>Total do item:</Text>
                          <Text style={[styles.itemPreviewValue, { color: Colors.green[700] }]}>{formatCurrency(itemFinal)}</Text>
                        </View>
                      </>
                    ) : (
                      <>
                        <Text style={styles.itemPreviewLabel}>Valor do item:</Text>
                        <Text style={styles.itemPreviewValue}>{formatCurrency(itemSubtotal)}</Text>
                      </>
                    )}
                  </View>
                </View>
              ) : null}

              <TouchableOpacity style={[globalStyles.btnSecondary, styles.addToCartBtn]} onPress={handleAddToCart}>
                <Text style={globalStyles.btnSecondaryText}>+ Adicionar ao carrinho</Text>
              </TouchableOpacity>
            </View>

            {/* ── Carrinho ── */}
            {cartItems.length > 0 ? (
              <View style={styles.cartSection}>
                <Text style={styles.sectionLabel}>
                  CARRINHO — {cartItems.length} {cartItems.length === 1 ? 'ITEM' : 'ITENS'}
                </Text>
                {errors.cart ? <Text style={styles.errorText}>{errors.cart}</Text> : null}

                {cartItems.map(item => (
                  <View key={item.tempId} style={styles.cartItem}>
                    <View style={styles.cartItemInfo}>
                      <Text style={styles.cartItemName}>{item.produto}</Text>
                      <Text style={styles.cartItemDetail}>
                        {item.quantidade} un. × {formatCurrency(item.valorUnitario)}
                        {item.desconto ? (
                          item.descontoTipo === 'percentual'
                            ? ` · ${item.desconto}% OFF`
                            : ` · -${formatCurrency(item.desconto)}`
                        ) : ''}
                      </Text>
                    </View>
                    <View style={styles.cartItemRight}>
                      <View style={{ alignItems: 'flex-end' }}>
                        {item.valorComDesconto ? <Text style={styles.cartItemOriginal}>{formatCurrency(item.valorTotal)}</Text> : null}
                        <Text style={styles.cartItemTotal}>{formatCurrency(item.valorComDesconto ?? item.valorTotal)}</Text>
                      </View>
                      <TouchableOpacity style={styles.removeBtn} onPress={() => handleRemoveCartItem(item.tempId)}>
                        <Text style={styles.removeIcon}>✕</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}

                <View style={styles.cartTotalRow}>
                  <Text style={styles.cartTotalLabel}>Total do pedido:</Text>
                  <Text style={styles.cartTotalValue}>{formatCurrency(cartTotal)}</Text>
                </View>

                {/* ── Desconto no total do pedido ── */}
                <View style={styles.descontoSection}>
                  <View style={styles.descontoHeader}>
                    <Text style={globalStyles.formLabel}>Desconto no total do pedido</Text>
                    <Switch
                      value={temDescontoPedido}
                      onValueChange={v => {
                        setTemDescontoPedido(v);
                        if (!v) { setDescontoValorPedido(''); setDescontoTipoPedido('percentual'); }
                      }}
                      trackColor={{ false: Colors.gray[200], true: Colors.green[200] }}
                      thumbColor={temDescontoPedido ? Colors.green[600] : Colors.gray[400]}
                    />
                  </View>

                  {temDescontoPedido && (
                    <View style={styles.descontoInputs}>
                      <View style={styles.descontoTipoRow}>
                        <TouchableOpacity
                          style={[styles.tipoButton, descontoTipoPedido === 'percentual' && styles.tipoButtonActive]}
                          onPress={() => { if (descontoTipoPedido !== 'percentual') { setDescontoTipoPedido('percentual'); setDescontoValorPedido(''); } }}
                        >
                          <Text style={[styles.tipoButtonText, descontoTipoPedido === 'percentual' && styles.tipoButtonTextActive]}>% Percentual</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.tipoButton, descontoTipoPedido === 'valor' && styles.tipoButtonActive]}
                          onPress={() => { if (descontoTipoPedido !== 'valor') { setDescontoTipoPedido('valor'); setDescontoValorPedido(''); } }}
                        >
                          <Text style={[styles.tipoButtonText, descontoTipoPedido === 'valor' && styles.tipoButtonTextActive]}>R$ Valor fixo</Text>
                        </TouchableOpacity>
                      </View>
                      <View style={globalStyles.formGroup}>
                        <Text style={globalStyles.formLabel}>{descontoTipoPedido === 'percentual' ? 'Percentual (%)' : 'Valor (R$)'}</Text>
                        <TextInput
                          style={[globalStyles.input, errors.descontoPedido && styles.inputError]}
                          value={descontoValorPedido}
                          onChangeText={t => { setDescontoValorPedido(sanitizeDecimalInput(t)); setErrors(prev => ({ ...prev, descontoPedido: '' })); }}
                          keyboardType="decimal-pad"
                          placeholder={descontoTipoPedido === 'percentual' ? '10' : '50'}
                        />
                        {errors.descontoPedido ? <Text style={styles.errorText}>{errors.descontoPedido}</Text> : null}
                      </View>
                    </View>
                  )}

                  {temDescontoPedido && pedidoDescontoValor > 0 ? (
                    <View style={styles.itemPreview}>
                      <View style={styles.previewRow}>
                        <Text style={styles.itemPreviewLabel}>Subtotal:</Text>
                        <Text style={styles.itemPreviewValue}>{formatCurrency(cartTotal)}</Text>
                      </View>
                      <View style={styles.previewRow}>
                        <Text style={[styles.itemPreviewLabel, { color: Colors.red[600] }]}>Desconto:</Text>
                        <Text style={[styles.itemPreviewValue, { color: Colors.red[600] }]}>- {formatCurrency(pedidoDescontoValor)}</Text>
                      </View>
                      <View style={[styles.previewRow, { paddingTop: Spacing.xs, borderTopWidth: 1, borderTopColor: Colors.gray[100] }]}>
                        <Text style={[styles.itemPreviewLabel, { fontWeight: '700' }]}>Total final:</Text>
                        <Text style={[styles.itemPreviewValue, { color: Colors.green[700] }]}>{formatCurrency(pedidoFinal)}</Text>
                      </View>
                    </View>
                  ) : null}
                </View>
              </View>
            ) : null}

            {/* ── Botões de ação ── */}
            <View style={styles.buttonRow}>
              {hasCartOrEdit ? (
                <TouchableOpacity style={[globalStyles.btnSecondary, { flex: 1 }]} onPress={resetForm}>
                  <Text style={globalStyles.btnSecondaryText}>Cancelar</Text>
                </TouchableOpacity>
              ) : null}
              <TouchableOpacity
                style={[
                  globalStyles.btnPrimary,
                  hasCartOrEdit ? { flex: 2 } : { flex: 1 },
                  (loading || cartItems.length === 0) && styles.btnDisabled,
                ]}
                onPress={handleConfirmPedido}
                disabled={loading || cartItems.length === 0}
              >
                <Text style={globalStyles.btnPrimaryText}>
                  {loading ? 'Salvando...' : editingId ? 'Atualizar pedido' : 'Confirmar pedido'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* ── Lista de pedidos ── */}
          <Text style={globalStyles.sectionTitle}>Pedidos do mês</Text>
          <View style={globalStyles.card}>
            <SearchBar
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Buscar por fazenda ou produto..."
            />
            {appLoading ? (
              <Text style={styles.loadingText}>Carregando pedidos...</Text>
            ) : filteredPedidos.length === 0 ? (
              <Text style={styles.emptyText}>
                {searchQuery ? 'Nenhum pedido encontrado' : 'Nenhum pedido registrado'}
              </Text>
            ) : (
              filteredPedidos.map(pedido => (
                <PedidoItem
                  key={pedido.id}
                  pedido={pedido}
                  onEdit={handleEdit}
                  onDelete={confirmDelete}
                />
              ))
            )}
          </View>
        </View>
      </ScrollView>

      <ConfirmModal
        visible={deleteConfirm !== null}
        title="Excluir pedido?"
        message={`Excluir o pedido de ${deleteConfirm?.fazendaNome} (${deleteConfirm?.itens.length ?? 0} produto(s))?`}
        confirmText="Excluir"
        cancelText="Cancelar"
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirm(null)}
        destructive={true}
      />

      <ProductPickerModal
        visible={productModalVisible}
        onClose={() => setProductModalVisible(false)}
        onSelect={handleProductSelect}
        selectedId={produtoId}
        products={products}
      />

      <FarmPickerModal
        visible={farmModalVisible}
        onClose={() => setFarmModalVisible(false)}
        onSelect={handleFarmSelect}
        selectedId={fazendaId}
        farms={farms}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flex: 1,
  },
  formRow: {
    flexDirection: 'row',
    gap: 10,
  },
  pickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  pickerButtonText: {
    fontSize: FontSizes.base,
    color: Colors.gray[900],
    flex: 1,
  },
  pickerPlaceholder: {
    fontSize: FontSizes.base,
    color: Colors.gray[400],
    flex: 1,
  },
  dropdownIcon: {
    fontSize: FontSizes.xs,
    color: Colors.gray[500],
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
  sectionLabel: {
    fontSize: FontSizes.xs,
    fontWeight: '700',
    color: Colors.gray[400],
    letterSpacing: 0.8,
    marginBottom: Spacing.md,
  },
  addItemSection: {
    marginTop: Spacing.lg,
    paddingTop: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.gray[100],
  },
  descontoSection: {
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.gray[100],
  },
  descontoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  descontoInputs: {
    marginTop: Spacing.sm,
  },
  descontoTipoRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  tipoButton: {
    flex: 1,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderWidth: 1.5,
    borderColor: Colors.gray[200],
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.white,
    alignItems: 'center',
  },
  tipoButtonActive: {
    borderColor: Colors.green[500],
    backgroundColor: Colors.green[50],
  },
  tipoButtonText: {
    fontSize: FontSizes.sm,
    fontWeight: '500',
    color: Colors.gray[600],
  },
  tipoButtonTextActive: {
    color: Colors.green[700],
    fontWeight: '600',
  },
  itemPreview: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.green[50],
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.sm,
    gap: 4,
  },
  previewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemPreviewLabel: {
    fontSize: FontSizes.sm,
    color: Colors.gray[500],
  },
  itemPreviewValue: {
    fontSize: FontSizes.base,
    fontWeight: '700',
    color: Colors.green[700],
  },
  addToCartBtn: {
    marginTop: Spacing.xs,
  },
  cartSection: {
    marginTop: Spacing.lg,
    paddingTop: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.gray[100],
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[50],
  },
  cartItemInfo: {
    flex: 1,
  },
  cartItemName: {
    fontSize: FontSizes.base,
    fontWeight: '500',
    color: Colors.gray[900],
  },
  cartItemDetail: {
    fontSize: FontSizes.sm,
    color: Colors.gray[500],
    marginTop: 2,
  },
  cartItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  cartItemTotal: {
    fontSize: FontSizes.base,
    fontWeight: '600',
    color: Colors.gray[700],
  },
  cartItemOriginal: {
    fontSize: FontSizes.xs,
    color: Colors.gray[400],
    textDecorationLine: 'line-through',
    textAlign: 'right',
  },
  removeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.red[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeIcon: {
    fontSize: FontSizes.xs,
    color: Colors.red[600],
    fontWeight: '700',
  },
  cartTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.gray[100],
  },
  cartTotalLabel: {
    fontSize: FontSizes.base,
    fontWeight: '600',
    color: Colors.gray[700],
  },
  cartTotalValue: {
    fontSize: FontSizes.xl,
    fontWeight: '700',
    color: Colors.green[700],
  },
  buttonRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.lg,
  },
  btnDisabled: {
    opacity: 0.4,
  },
  loadingText: {
    textAlign: 'center',
    color: Colors.gray[500],
    fontSize: FontSizes.sm,
    paddingVertical: Spacing.lg,
  },
  emptyText: {
    textAlign: 'center',
    color: Colors.gray[500],
    fontSize: FontSizes.sm,
    paddingVertical: Spacing.lg,
  },
});
