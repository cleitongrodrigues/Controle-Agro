// ══════════════════════════════════════════════════════════
// MAPA SCREEN
// ══════════════════════════════════════════════════════════

import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { AppHeader, MetricCard, FarmItem, FarmHistoryModal, FarmFormModal, SearchBar, OfflineBanner, ConfirmModal } from '../components';
import { globalStyles } from '../styles/global';
import { Colors, Spacing, BorderRadius, FontSizes, Shadows } from '../config/theme';
import { FARM_HISTORY } from '../config/data';
import { Metric, Farm } from '../types';
import { useApp } from '../contexts/AppContext';
import { useToast } from '../contexts/ToastContext';

export const MapaScreen: React.FC = () => {
  const { isOffline, unsyncedCount, syncData, farms, addFarm, updateFarm, deleteFarm } = useApp();
  const { showToast } = useToast();
  const [selectedFarm, setSelectedFarm] = useState<Farm | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [formModalVisible, setFormModalVisible] = useState(false);
  const [editingFarm, setEditingFarm] = useState<Farm | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Farm | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [syncing, setSyncing] = useState(false);

  const metrics: Metric[] = [
    {
      label: 'Visitas hoje',
      value: '3',
      subtitle: 'de 5 planejadas',
      variant: 'default',
    },
    {
      label: 'Pendências',
      value: '2',
      subtitle: 'clientes urgentes',
      variant: 'warning',
    },
  ];

  const farmDescriptions: Record<string, string> = {
    '1': '12/06 · Herbicida Roundup + Sementes',
    '2': '05/06 · Soja RR2 + Fertilizante',
    '3': '10/06 · Fertilizante NPK',
    '4': 'Pendente: orçamento fungicida 24/25',
    '5': '⚠ Proposta vence em 2 dias!',
    '6': '08/06 · Adubo e Calcário',
    '7': 'Aguardando retorno sobre proposta',
    '8': '15/06 · Sementes de Algodão',
  };

  const handleFarmPress = (farm: Farm) => {
    setSelectedFarm(farm);
    setModalVisible(true);
  };


  // ============================================
  // FARM CRUD HANDLERS
  // ============================================

  const handleAddFarm = () => {
    setEditingFarm(null);
    setFormModalVisible(true);
  };

  const handleEditFarm = (farm: Farm) => {
    setEditingFarm(farm);
    setFormModalVisible(true);
  };

  const handleSaveFarm = async (farm: Farm) => {
    try {
      if (editingFarm) {
        await updateFarm(farm.id, farm);
        showToast('Fazenda atualizada com sucesso!', 'success');
      } else {
        await addFarm(farm);
        showToast('Fazenda cadastrada com sucesso!', 'success');
      }
      setFormModalVisible(false);
      setEditingFarm(null);
    } catch (error) {
      showToast('Erro ao salvar fazenda', 'error');
    }
  };

  const handleCancelForm = () => {
    setFormModalVisible(false);
    setEditingFarm(null);
  };

  const confirmDelete = (farm: Farm) => {
    setDeleteConfirm(farm);
  };

  const handleDeleteFarm = async () => {
    if (!deleteConfirm) return;
    
    try {
      await deleteFarm(deleteConfirm.id);
      showToast('Fazenda removida com sucesso!', 'success');
      setDeleteConfirm(null);
    } catch (error) {
      showToast('Erro ao remover fazenda', 'error');
    }
  };

  const handleSync = async () => {
    try {
      setSyncing(true);
      await syncData();
      showToast('Dados sincronizados!', 'success');
    } catch (error) {
      showToast('Erro ao sincronizar', 'error');
    } finally {
      setSyncing(false);
    }
  };

  // Filtrar fazendas por busca
  const filteredFarms = useMemo(() => {
    if (!searchQuery.trim()) return farms;
    
    const query = searchQuery.toLowerCase();
    return farms.filter(farm => 
      farm.nome.toLowerCase().includes(query) ||
      farm.proprietario.toLowerCase().includes(query) ||
      farm.localizacao.toLowerCase().includes(query)
    );
  }, [farms, searchQuery]);
  const handleCloseModal = () => {
    setModalVisible(false);
    setTimeout(() => setSelectedFarm(null), 300);
  };

  return (
    <View style={globalStyles.container}>
      <AppHeader 
        title="AgroVendas" 
        subtitle="Assistente do Vendedor"
        onSyncPress={handleSync}
        syncing={syncing}
      />
      
      {isOffline && <OfflineBanner visible={isOffline} unsyncedCount={unsyncedCount} />}
      
      <ScrollView style={styles.scrollContent}>
        {/* Métricas */}
        <View style={styles.metricGrid}>
          {metrics.map((metric, index) => (
            <MetricCard key={index} metric={metric} />
          ))}
        </View>

        {/* Mapa visual */}
        <View style={globalStyles.section}>
          <Text style={globalStyles.sectionTitle}>Mapa de rotas</Text>
          <View style={globalStyles.card}>
            <View style={styles.mapWrap}>
              <View style={styles.mapBg} />
              <View style={styles.roadH} />
              <View style={styles.roadV} />
              
              {/* Pins - visual simplificado */}
              <View style={[styles.pin, styles.pinGreen, { left: '24%', top: '28%' }]}>
                <Text style={styles.pinText}>✓</Text>
              </View>
              <View style={[styles.pin, styles.pinGreen, { left: '52%', top: '42%' }]}>
                <Text style={styles.pinText}>✓</Text>
              </View>
              <View style={[styles.pin, styles.pinGreen, { left: '40%', top: '16%' }]}>
                <Text style={styles.pinText}>✓</Text>
              </View>
              <View style={[styles.pin, styles.pinAmber, { left: '16%', top: '57%' }]}>
                <Text style={styles.pinText}>!</Text>
              </View>
              <View style={[styles.pin, styles.pinRed, { left: '67%', top: '62%' }]}>
                <Text style={styles.pinText}>!</Text>
              </View>
            </View>

            {/* Legenda */}
            <View style={styles.legend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: Colors.green[500] }]} />
                <Text style={styles.legendText}>Visitado</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: Colors.amber[400] }]} />
                <Text style={styles.legendText}>Pendente</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: Colors.red[600] }]} />
                <Text style={styles.legendText}>Urgente</Text>
              </View>
            </View>
          </View>

          {/* Lista de fazendas */}
          <View style={styles.farmHeader}>
            <Text style={globalStyles.sectionTitle}>Fazendas — histórico</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddFarm}
            >
              <Text style={styles.addButtonText}>➕ Adicionar</Text>
            </TouchableOpacity>
          </View>

          {/* Busca */}
          <View style={styles.searchContainer}>
            <SearchBar
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Buscar fazenda..."
            />
          </View>

          <View style={globalStyles.card}>
            {filteredFarms.length === 0 ? (
              <Text style={styles.emptyText}>
                {searchQuery ? 'Nenhuma fazenda encontrada' : 'Nenhuma fazenda cadastrada'}
              </Text>
            ) : (
              filteredFarms.map((farm, index) => (
                <View key={farm.id}>
                  <FarmItem
                    farm={farm}
                    description={farmDescriptions[farm.id] || 'Sem histórico recente'}
                    onPress={() => handleFarmPress(farm)}
                    onEdit={() => handleEditFarm(farm)}
                    onDelete={() => confirmDelete(farm)}
                    showActions
                  />
                  {index < filteredFarms.length - 1 && <View style={{ height: 0 }} />}
                </View>
              ))
            )}
          </View>
        </View>
      </ScrollView>

      {/* Modal de Histórico */}
      <FarmHistoryModal
        visible={modalVisible}
        onClose={handleCloseModal}
        farm={selectedFarm}
        history={selectedFarm ? (FARM_HISTORY[selectedFarm.id] || []) : []}
      />

      {/* Modal de Formulário */}
      <FarmFormModal
        visible={formModalVisible}
        farm={editingFarm}
        onSave={handleSaveFarm}
        onCancel={handleCancelForm}
      />

      {/* Modal de Confirmação de Delete */}
      <ConfirmModal
        visible={!!deleteConfirm}
        title="Excluir fazenda?"
        message={`Deseja realmente excluir a fazenda "${deleteConfirm?.nome}"?`}
        onConfirm={handleDeleteFarm}
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
  metricGrid: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
  },
  mapWrap: {
    backgroundColor: '#dde8d0',
    borderRadius: BorderRadius.md,
    height: 200,
    position: 'relative',
    overflow: 'hidden',
    marginBottom: 14,
  },
  mapBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
  },
  roadH: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: '#c8d4b8',
    top: '52%',
  },
  roadV: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: '#c8d4b8',
    left: '38%',
  },
  pin: {
    position: 'absolute',
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinGreen: {
    backgroundColor: Colors.green[500],
  },
  pinAmber: {
    backgroundColor: Colors.amber[400],
  },
  pinRed: {
    backgroundColor: Colors.red[600],
  },
  pinText: {
    fontSize: FontSizes.xs,
    fontWeight: '700',
    color: Colors.white,
  },
  legend: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: FontSizes.sm,
    color: Colors.gray[500],
  },
  farmHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  addButton: {
    backgroundColor: Colors.green[600],
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  addButtonText: {
    fontSize: FontSizes.sm,
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
});
