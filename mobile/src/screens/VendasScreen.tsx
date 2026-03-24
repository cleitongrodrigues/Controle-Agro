// ══════════════════════════════════════════════════════════
// VENDAS SCREEN
// ══════════════════════════════════════════════════════════

import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { AppHeader, SaleItem, BarterCard, HorizontalPicker, SearchBar, ConfirmModal, OfflineBanner } from '../components';
import { globalStyles } from '../styles/global';
import { Colors, Spacing, BorderRadius, FontSizes } from '../config/theme';
import { PRODUCTS, SOJA_PRICE_PER_SACK } from '../config/data';
import { Sale } from '../types';
import { calculateBarterSacks, calculateSaleTotal, generateId, formatDate } from '../utils/helpers';
import { useToast } from '../contexts/ToastContext';
import { useApp } from '../contexts/AppContext';

export const VendasScreen: React.FC = () => {
  const { showToast } = useToast();
  const { farms, sales, addSale, updateSale, deleteSale, loading: appLoading, isOffline, unsyncedCount, syncData } = useApp();
  
  const [fazendaId, setFazendaId] = useState(farms[0]?.id || '');
  const [produtoId, setProdutoId] = useState(PRODUCTS[0].id);
  const [quantidade, setQuantidade] = useState('10');
  const [valorUnitario, setValorUnitario] = useState('185');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Sale | null>(null);

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
      sacasSoja: 23.1,
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
      sacasSoja: 51.6,
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
      sacasSoja: 25.6,
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
  const total = calculateSaleTotal(qtd, valor);
  const sacas = calculateBarterSacks(total);

  const handleProductChange = (prodId: string) => {
    setProdutoId(prodId);
    const product = PRODUCTS.find(p => p.id === prodId);
    if (product && product.preco > 0) {
      setValorUnitario(product.preco.toString());
    } else {
      setValorUnitario('');
    }
    setErrors(prev => ({ ...prev, produto: '' }));
  };

  const handleEdit = (sale: Sale) => {
    setEditingId(sale.id);
    setFazendaId(sale.fazendaId);
    setProdutoId(PRODUCTS.find(p => p.nome === sale.produto)?.id || PRODUCTS[0].id);
    setQuantidade(sale.quantidade.toString());
    setValorUnitario(sale.valorUnitario.toString());
    showToast('Editando venda', 'info');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setQuantidade('10');
    setProdutoId(PRODUCTS[0].id);
    setValorUnitario(PRODUCTS[0].preco.toString());
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddSale = async () => {
    if (!validateForm()) {
      showToast('Preencha todos os campos corretamente', 'error');
      return;
    }

    const fazenda = farms.find(f => f.id === fazendaId);
    const produto = PRODUCTS.find(p => p.id === produtoId);

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
        valorTotal: total,
        sacasSoja: sacas,
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
      setProdutoId(PRODUCTS[0].id);
      setValorUnitario(PRODUCTS[0].preco.toString());
    } catch (error) {
      showToast(editingId ? 'Erro ao atualizar venda' : 'Erro ao registrar venda', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={globalStyles.container}>
      <AppHeader 
        title="Caderno de Vendas" 
        subtitle="Registre e consulte pedidos"
        onSyncPress={handleSync}
        syncing={syncing}
      />
      <OfflineBanner visible={isOffline} unsyncedCount={unsyncedCount} />
      
      <ScrollView style={styles.scrollContent}>
        <View style={globalStyles.section}>
          {/* Formulário */}
          <Text style={globalStyles.sectionTitle}>
            {editingId ? '✏️ Editando venda' : 'Registrar venda'}
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

            <HorizontalPicker
              label="Produto"
              items={PRODUCTS.map(p => ({ id: p.id, label: p.nome }))}
              selectedId={produtoId}
              onSelect={handleProductChange}
            />
            {errors.produto && <Text style={styles.errorText}>{errors.produto}</Text>}

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

            <BarterCard sacas={sacas} pricePerSack={SOJA_PRICE_PER_SACK} />

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
                  {loading ? 'Salvando...' : editingId ? 'Atualizar venda' : 'Lançar venda'}
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
});
