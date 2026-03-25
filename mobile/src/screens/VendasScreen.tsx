// ══════════════════════════════════════════════════════════
// VENDAS SCREEN
// ══════════════════════════════════════════════════════════

import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import { AppHeader, SaleItem, HorizontalPicker, SearchBar, ConfirmModal, OfflineBanner, ProductPickerModal } from '../components';
import { globalStyles } from '../styles/global';
import { Colors, Spacing, BorderRadius, FontSizes } from '../config/theme';
import { PRODUCTS } from '../config/data';
import { Sale, Product } from '../types';
import { calculateSaleTotal, generateId, formatDate } from '../utils/helpers';
import { useToast } from '../contexts/ToastContext';
import { useApp } from '../contexts/AppContext';

export const VendasScreen: React.FC = () => {
  const { showToast } = useToast();
  const { farms, sales, products, addSale, updateSale, deleteSale, loading: appLoading, isOffline, unsyncedCount, syncData } = useApp();
  
  const [fazendaId, setFazendaId] = useState(farms[0]?.id || '');
  const [produtoId, setProdutoId] = useState(products[0]?.id || PRODUCTS[0].id);
  const [quantidade, setQuantidade] = useState('10');
  const [valorUnitario, setValorUnitario] = useState('185');
  const [temDesconto, setTemDesconto] = useState(false);
  const [descontoTipo, setDescontoTipo] = useState<'percentual' | 'valor'>('percentual');
  const [descontoValor, setDescontoValor] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Sale | null>(null);
  const [productModalVisible, setProductModalVisible] = useState(false);

  // Vendas iniciais mockadas
  const initialSales: Sale[] = [
    {
      id: '1',
      fazendaId: '1',
      fazendaNome: 'Faz. Boa Vista',
      produto: 'Herbicida Roundup 20L',
      quantidade: 20,
      valorUnitario: 185,
      valorTotal: 3700,
      data: formatDate(new Date()),
      sincronizado: false,
    },
    {
      id: '2',
      fazendaId: '2',
      fazendaNome: 'Faz. São João',
      produto: 'Semente Soja RR2 50kg',
      quantidade: 20,
      valorUnitario: 412.50,
      valorTotal: 8250,
      data: formatDate(new Date()),
      sincronizado: false,
    },
    {
      id: '3',
      fazendaId: '3',
      fazendaNome: 'Faz. Esperança',
      produto: 'Fertilizante NPK 20kg',
      quantidade: 50,
      valorUnitario: 82,
      valorTotal: 4100,
      data: formatDate(new Date()),
      sincronizado: false,
    },
  ];

  const allSales = [...sales, ...initialSales];
  
  // Filtered sales based on search
  const filteredSales = useMemo(() => {
    if (!searchQuery) return allSales;
    const query = searchQuery.toLowerCase();
    return allSales.filter(sale => 
      sale.produto.toLowerCase().includes(query) ||
      sale.fazendaNome.toLowerCase().includes(query)
    );
  }, [allSales, searchQuery]);

  const qtd = parseFloat(quantidade) || 0;
  const valor = parseFloat(valorUnitario) || 0;
  const subtotal = calculateSaleTotal(qtd, valor);
  
  // Cálculo do desconto
  const desconto = parseFloat(descontoValor) || 0;
  let valorDesconto = 0;
  if (temDesconto && desconto > 0) {
    if (descontoTipo === 'percentual') {
      valorDesconto = (subtotal * desconto) / 100;
    } else {
      valorDesconto = desconto;
    }
  }
  const total = subtotal - valorDesconto;

  const handleProductChange = (prodId: string) => {
    setProdutoId(prodId);
    const allProducts = [...products, ...PRODUCTS];
    const product = allProducts.find(p => p.id === prodId);
    if (product && product.preco > 0) {
      setValorUnitario(product.preco.toString());
    } else {
      setValorUnitario('');
    }
    setErrors(prev => ({ ...prev, produto: '' }));
  };

  const handleProductSelect = (product: Product) => {
    setProdutoId(product.id);
    if (product.preco > 0) {
      setValorUnitario(product.preco.toString());
    } else {
      setValorUnitario('');
    }
    setErrors(prev => ({ ...prev, produto: '' }));
    setProductModalVisible(false);
  };

  const allProducts = [...products, ...PRODUCTS];
  const selectedProduct = allProducts.find(p => p.id === produtoId);

  const handleEdit = (sale: Sale) => {
    setEditingId(sale.id);
    setFazendaId(sale.fazendaId);
    const allProducts = [...products, ...PRODUCTS];
    setProdutoId(allProducts.find(p => p.nome === sale.produto)?.id || allProducts[0].id);
    setQuantidade(sale.quantidade.toString());
    setValorUnitario(sale.valorUnitario.toString());
    
    // Restaurar desconto se existir
    if (sale.desconto && sale.desconto > 0) {
      setTemDesconto(true);
      setDescontoTipo(sale.descontoTipo || 'percentual');
      setDescontoValor(sale.desconto.toString());
    } else {
      setTemDesconto(false);
      setDescontoValor('');
    }
    
    showToast('Modo de edição ativado', 'info');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setQuantidade('10');
    const allProducts = [...products, ...PRODUCTS];
    setProdutoId(allProducts[0].id);
    setValorUnitario(allProducts[0].preco.toString());
    setTemDesconto(false);
    setDescontoValor('');
    setDescontoTipo('percentual');
  };

  const confirmDelete = (sale: Sale) => {
    setDeleteConfirm(sale);
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    
    try {
      await deleteSale(deleteConfirm.id);
      showToast('Venda excluída', 'success');
      setDeleteConfirm(null);
    } catch (error) {
      showToast('Erro ao excluir venda', 'error');
    }
  };

  const handleSync = async () => {
    if (unsyncedCount === 0) return;
    
    setSyncing(true);
    try {
      await syncData();
      showToast(`${unsyncedCount} ${unsyncedCount === 1 ? 'venda sincronizada' : 'vendas sincronizadas'}!`, 'success');
    } catch (error) {
      showToast('Erro ao sincronizar', 'error');
    } finally {
      setSyncing(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!fazendaId) {
      newErrors.fazenda = 'Selecione uma fazenda';
    }

    if (!produtoId) {
      newErrors.produto = 'Selecione um produto';
    }

    if (qtd <= 0) {
      newErrors.quantidade = 'Quantidade deve ser maior que zero';
    }

    if (valor <= 0) {
      newErrors.valor = 'Valor deve ser maior que zero';
    }

    if (qtd > 10000) {
      newErrors.quantidade = 'Quantidade muito alta';
    }

    // Validar desconto
    if (temDesconto) {
      const desc = parseFloat(descontoValor) || 0;
      if (desc <= 0) {
        newErrors.desconto = 'Desconto deve ser maior que zero';
      }
      if (descontoTipo === 'percentual' && desc > 100) {
        newErrors.desconto = 'Percentual não pode ser maior que 100%';
      }
      if (descontoTipo === 'valor' && desc > total) {
        newErrors.desconto = 'Desconto não pode ser maior que o subtotal';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddSale = async () => {
    if (!validateForm()) {
      showToast('Preencha todos os campos corretamente', 'error');
      return;
    }

    const fazenda = farms.find(f => f.id === fazendaId);
    const allProducts = [...products, ...PRODUCTS];
    const produto = allProducts.find(p => p.id === produtoId);

    if (!fazenda || !produto) {
      showToast('Erro ao processar venda', 'error');
      return;
    }

    setLoading(true);

    try {
      const saleData: Sale = {
        id: editingId || generateId(),
        fazendaId,
        fazendaNome: fazenda.nome,
        produto: produto.nome,
        quantidade: qtd,
        valorUnitario: valor,
        valorTotal: subtotal,
        desconto: temDesconto ? desconto : undefined,
        descontoTipo: temDesconto ? descontoTipo : undefined,
        valorComDesconto: temDesconto ? total : undefined,
        data: formatDate(new Date()),
        sincronizado: false,
      };

      if (editingId) {
        await updateSale(editingId, saleData);
        showToast('✅ Venda atualizada com sucesso!', 'success');
      } else {
        await addSale(saleData);
        showToast('✅ Venda registrada com sucesso!', 'success');
      }
      
      // Reset form
      setEditingId(null);
      setQuantidade('10');
      const allProducts = [...products, ...PRODUCTS];
      setProdutoId(allProducts[0].id);
      setValorUnitario(allProducts[0].preco.toString());
      setTemDesconto(false);
      setDescontoValor('');
      setDescontoTipo('percentual');
    } catch (error) {
      showToast(editingId ? 'Erro ao atualizar venda' : 'Erro ao registrar venda', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={globalStyles.container}>
      <AppHeader 
        title="Vendas" 
        subtitle="Registre e consulte vendas"
        onSyncPress={handleSync}
        syncing={syncing}
      />
      <OfflineBanner visible={isOffline} unsyncedCount={unsyncedCount} />
      
      <ScrollView style={styles.scrollContent}>
        <View style={globalStyles.section}>
          {/* Formulário */}
          <Text style={globalStyles.sectionTitle}>
            {editingId ? '✏️ Editar venda' : 'Nova venda'}
          </Text>
          <View style={globalStyles.card}>
            <HorizontalPicker
              label="Fazenda"
              items={farms.map(f => ({ id: f.id, label: f.nome }))}
              selectedId={fazendaId}
              onSelect={(id) => {
                setFazendaId(id);
                setErrors(prev => ({ ...prev, fazenda: '' }));
              }}
            />
            {errors.fazenda && <Text style={styles.errorText}>{errors.fazenda}</Text>}

            <View style={globalStyles.formGroup}>
              <Text style={globalStyles.formLabel}>Produto</Text>
              <TouchableOpacity
                style={[
                  globalStyles.input,
                  styles.productButton,
                  errors.produto && styles.inputError
                ]}
                onPress={() => setProductModalVisible(true)}
              >
                <Text style={selectedProduct ? styles.productButtonText : styles.productPlaceholder}>
                  {selectedProduct ? selectedProduct.nome : 'Selecione um produto'}
                </Text>
                <Text style={styles.dropdownIcon}>▼</Text>
              </TouchableOpacity>
              {errors.produto && <Text style={styles.errorText}>{errors.produto}</Text>}
            </View>

            <View style={styles.formRow}>
              <View style={[globalStyles.formGroup, { flex: 1 }]}>
                <Text style={globalStyles.formLabel}>Quantidade</Text>
                <TextInput
                  style={[
                    globalStyles.input,
                    errors.quantidade && styles.inputError
                  ]}
                  value={quantidade}
                  onChangeText={(text) => {
                    setQuantidade(text);
                    setErrors(prev => ({ ...prev, quantidade: '' }));
                  }}
                  keyboardType="numeric"
                  placeholder="10"
                />
                {errors.quantidade && <Text style={styles.errorText}>{errors.quantidade}</Text>}
              </View>
              <View style={[globalStyles.formGroup, { flex: 1 }]}>
                <Text style={globalStyles.formLabel}>Valor unit. (R$)</Text>
                <TextInput
                  style={[
                    globalStyles.input,
                    errors.valor && styles.inputError
                  ]}
                  value={valorUnitario}
                  onChangeText={(text) => {
                    setValorUnitario(text);
                    setErrors(prev => ({ ...prev, valor: '' }));
                  }}
                  keyboardType="numeric"
                  placeholder="185"
                />
                {errors.valor && <Text style={styles.errorText}>{errors.valor}</Text>}
              </View>
            </View>

            {/* Seção de Desconto */}
            <View style={styles.descontoSection}>
              <View style={styles.descontoHeader}>
                <Text style={globalStyles.formLabel}>Aplicar desconto</Text>
                <Switch
                  value={temDesconto}
                  onValueChange={(value) => {
                    setTemDesconto(value);
                    if (!value) {
                      setDescontoValor('');
                      setErrors(prev => ({ ...prev, desconto: '' }));
                    }
                  }}
                  trackColor={{ false: Colors.gray[200], true: Colors.green[200] }}
                  thumbColor={temDesconto ? Colors.green[600] : Colors.gray[400]}
                />
              </View>

              {temDesconto && (
                <View style={styles.descontoInputs}>
                  {/* Seletor de tipo de desconto */}
                  <View style={styles.descontoTipoRow}>
                    <TouchableOpacity
                      style={[
                        styles.tipoButton,
                        descontoTipo === 'percentual' && styles.tipoButtonActive
                      ]}
                      onPress={() => {
                        setDescontoTipo('percentual');
                        setDescontoValor('');
                      }}
                    >
                      <Text style={[
                        styles.tipoButtonText,
                        descontoTipo === 'percentual' && styles.tipoButtonTextActive
                      ]}>
                        % Percentual
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.tipoButton,
                        descontoTipo === 'valor' && styles.tipoButtonActive
                      ]}
                      onPress={() => {
                        setDescontoTipo('valor');
                        setDescontoValor('');
                      }}
                    >
                      <Text style={[
                        styles.tipoButtonText,
                        descontoTipo === 'valor' && styles.tipoButtonTextActive
                      ]}>
                        R$ Valor fixo
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* Input do valor do desconto */}
                  <View style={globalStyles.formGroup}>
                    <Text style={globalStyles.formLabel}>
                      {descontoTipo === 'percentual' ? 'Percentual (%)' : 'Valor (R$)'}
                    </Text>
                    <TextInput
                      style={[
                        globalStyles.input,
                        errors.desconto && styles.inputError
                      ]}
                      value={descontoValor}
                      onChangeText={(text) => {
                        setDescontoValor(text);
                        setErrors(prev => ({ ...prev, desconto: '' }));
                      }}
                      keyboardType="numeric"
                      placeholder={descontoTipo === 'percentual' ? '10' : '50'}
                    />
                    {errors.desconto && <Text style={styles.errorText}>{errors.desconto}</Text>}
                  </View>

                  {/* Resumo de valores */}
                  <View style={styles.resumoDesconto}>
                    <View style={styles.resumoRow}>
                      <Text style={styles.resumoLabel}>Subtotal:</Text>
                      <Text style={styles.resumoValor}>R$ {subtotal.toFixed(2).replace('.', ',')}</Text>
                    </View>
                    {valorDesconto > 0 && (
                      <View style={styles.resumoRow}>
                        <Text style={[styles.resumoLabel, styles.descontoText]}>
                          Desconto ({descontoTipo === 'percentual' ? `${desconto}%` : 'R$'}):
                        </Text>
                        <Text style={[styles.resumoValor, styles.descontoText]}>
                          - R$ {valorDesconto.toFixed(2).replace('.', ',')}
                        </Text>
                      </View>
                    )}
                    <View style={[styles.resumoRow, styles.totalRow]}>
                      <Text style={styles.totalLabel}>Total:</Text>
                      <Text style={styles.totalValor}>R$ {total.toFixed(2).replace('.', ',')}</Text>
                    </View>
                  </View>
                </View>
              )}

              {/* Resumo simples quando não tem desconto */}
              {!temDesconto && (
                <View style={styles.resumoSimples}>
                  <Text style={styles.resumoLabel}>Valor total:</Text>
                  <Text style={styles.totalValor}>R$ {total.toFixed(2).replace('.', ',')}</Text>
                </View>
              )}
            </View>

            <View style={styles.buttonRow}>
              {editingId && (
                <TouchableOpacity 
                  style={[globalStyles.btnSecondary, { flex: 1 }]}
                  onPress={handleCancelEdit}
                >
                  <Text style={globalStyles.btnSecondaryText}>Cancelar</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity 
                style={[
                  globalStyles.btnPrimary,
                  editingId ? { flex: 2 } : { flex: 1 },
                  loading && styles.btnDisabled
                ]}
                onPress={handleAddSale}
                disabled={loading}
              >
                <Text style={globalStyles.btnPrimaryText}>
                  {loading ? 'Salvando...' : editingId ? 'Salvar alterações' : 'Adicionar venda'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Lista de vendas */}
          <Text style={globalStyles.sectionTitle}>Vendas do mês</Text>
          <View style={globalStyles.card}>
            <SearchBar 
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Buscar por produto ou fazenda..."
            />
            
            {appLoading ? (
              <Text style={styles.loadingText}>Carregando vendas...</Text>
            ) : filteredSales.length === 0 ? (
              <Text style={styles.emptyText}>
                {searchQuery ? 'Nenhuma venda encontrada' : 'Nenhuma venda registrada'}
              </Text>
            ) : (
              filteredSales.map(sale =>  (
                <SaleItem 
                  key={sale.id} 
                  sale={sale}
                  onEdit={handleEdit}
                  onDelete={confirmDelete}
                  showActions={true}
                />
              ))
            )}
          </View>
        </View>
      </ScrollView>
      
      <ConfirmModal
        visible={deleteConfirm !== null}
        title="Excluir venda?"
        message={`Tem certeza que deseja excluir esta venda de ${deleteConfirm?.produto}?`}
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
        products={allProducts}
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
  pickerWrapper: {
    gap: 8,
  },
  pickerOption: {
    padding: 12,
    borderWidth: 1.5,
    borderColor: Colors.gray[100],
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.gray[50],
  },
  pickerOptionSelected: {
    borderColor: Colors.green[500],
    backgroundColor: Colors.green[50],
  },
  pickerText: {
    fontSize: FontSizes.md,
    color: Colors.gray[900],
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
  btnDisabled: {
    opacity: 0.5,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: Spacing.md,
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
  productButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  productButtonText: {
    fontSize: FontSizes.base,
    color: Colors.gray[900],
    flex: 1,
  },
  productPlaceholder: {
    fontSize: FontSizes.base,
    color: Colors.gray[400],
    flex: 1,
  },
  dropdownIcon: {
    fontSize: FontSizes.xs,
    color: Colors.gray[500],
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
    marginTop: Spacing.md,
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
  resumoDesconto: {
    marginTop: Spacing.md,
    padding: Spacing.md,
    backgroundColor: Colors.gray[50],
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.gray[100],
  },
  resumoSimples: {
    marginTop: Spacing.md,
    padding: Spacing.md,
    backgroundColor: Colors.green[50],
    borderRadius: BorderRadius.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resumoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  totalRow: {
    marginTop: Spacing.xs,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.gray[200],
    marginBottom: 0,
  },
  resumoLabel: {
    fontSize: FontSizes.sm,
    color: Colors.gray[600],
  },
  resumoValor: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: Colors.gray[700],
    fontVariant: ['tabular-nums'],
  },
  descontoText: {
    color: Colors.red[600],
  },
  totalLabel: {
    fontSize: FontSizes.base,
    fontWeight: '600',
    color: Colors.gray[900],
  },
  totalValor: {
    fontSize: FontSizes.xl,
    fontWeight: '700',
    color: Colors.green[700],
    fontVariant: ['tabular-nums'],
  },
});
