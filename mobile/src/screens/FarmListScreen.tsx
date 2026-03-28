// ══════════════════════════════════════════════════════════
// FARM LIST SCREEN - Gerenciamento de Fazendas
// ══════════════════════════════════════════════════════════

import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { AppHeader, FarmFormModal, ConfirmModal, SearchBar, FarmItem } from '../components';
import { globalStyles } from '../styles/global';
import { Colors, Spacing, BorderRadius, FontSizes, Shadows } from '../config/theme';
import { useApp } from '../contexts/AppContext';
import { useToast } from '../contexts/ToastContext';
import { Farm } from '../types';

interface FarmListScreenProps {
  visible: boolean;
  onClose: () => void;
}

export const FarmListScreen: React.FC<FarmListScreenProps> = ({ visible, onClose }) => {
  const { farms = [], addFarm, updateFarm, deleteFarm } = useApp();
  const { showToast } = useToast();
  
  const [farmFormVisible, setFarmFormVisible] = useState(false);
  const [editingFarm, setEditingFarm] = useState<Farm | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Farm | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // ============================================
  // FARM HANDLERS
  // ============================================

  const handleAddFarm = () => {
    setEditingFarm(null);
    setFarmFormVisible(true);
  };

  const handleEditFarm = (farm: Farm) => {
    setEditingFarm(farm);
    setFarmFormVisible(true);
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
      setFarmFormVisible(false);
      setEditingFarm(null);
    } catch (error) {
      showToast('Erro ao salvar fazenda', 'error');
    }
  };

  const confirmDeleteFarm = (farm: Farm) => {
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

  const filteredFarms = useMemo(() => {
    if (!searchQuery) return farms;
    const query = searchQuery.toLowerCase();
    return farms.filter(farm =>
      farm.nome.toLowerCase().includes(query) ||
      farm.proprietario.toLowerCase().includes(query) ||
      farm.localizacao.toLowerCase().includes(query)
    );
  }, [farms, searchQuery]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'visitado': return Colors.green[600];
      case 'urgente': return Colors.red[600];
      case 'pendente': return Colors.amber[600];
      default: return Colors.gray[500];
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'visitado': return 'Visitado';
      case 'urgente': return 'Urgente';
      case 'pendente': return 'Pendente';
      default: return status;
    }
  };
  if (!visible) return null;
  return (
    <View style={[globalStyles.container, styles.fullScreenOverlay]}>
      <AppHeader 
        title="Fazendas" 
        subtitle="Lista de fazendas"
        onBack={onClose}
      />
      
      <ScrollView style={styles.scrollContent}>
        <View style={globalStyles.section}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddFarm}
            >
              <Text style={styles.addButtonText}>➕ Nova Fazenda</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.searchContainer}>
            <SearchBar
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Buscar fazenda..."
            />
          </View>

          {filteredFarms.length === 0 ? (
            <View style={globalStyles.card}>
              <Text style={styles.emptyText}>
                {searchQuery ? 'Nenhuma fazenda encontrada' : 'Nenhuma fazenda cadastrada'}
              </Text>
            </View>
          ) : (
            filteredFarms.map((farm) => (
              <View key={farm.id} style={styles.farmCard}>
                <View style={styles.farmHeader}>
                  <View style={styles.farmTitleRow}>
                    <Text style={styles.farmName}>{farm.nome}</Text>
                    <View
                      style={[
                        styles.statusBadge,
                        { backgroundColor: getStatusColor(farm.status) },
                      ]}
                    >
                      <Text style={styles.statusText}>
                        {getStatusLabel(farm.status)}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.farmBody}>
                  <View style={styles.farmDetailRow}>
                    <Text style={styles.farmIcon}>👤</Text>
                    <Text style={styles.farmDetail}>{farm.proprietario}</Text>
                  </View>
                  <View style={styles.farmDetailRow}>
                    <Text style={styles.farmIcon}>📍</Text>
                    <Text style={styles.farmDetail}>{farm.localizacao}</Text>
                  </View>
                  <View style={styles.farmDetailRow}>
                    <Text style={styles.farmIcon}>🌾</Text>
                    <Text style={styles.farmDetail}>{farm.hectares} hectares</Text>
                  </View>
                  {farm.telefone && (
                    <View style={styles.farmDetailRow}>
                      <Text style={styles.farmIcon}>📞</Text>
                      <Text style={styles.farmDetail}>{farm.telefone}</Text>
                    </View>
                  )}
                </View>

                <View style={styles.farmFooter}>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => handleEditFarm(farm)}
                  >
                    <Text style={styles.editButtonIcon}>✏️</Text>
                    <Text style={styles.editButtonText}>Editar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => confirmDeleteFarm(farm)}
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

      {/* Farm Form Modal */}
      <FarmFormModal
        visible={farmFormVisible}
        farm={editingFarm}
        onSave={handleSaveFarm}
        onCancel={() => {
          setFarmFormVisible(false);
          setEditingFarm(null);
        }}
      />

      {/* Delete Confirmation */}
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
  farmCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
    ...Shadows.sm,
    overflow: 'hidden',
  },
  farmHeader: {
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[100],
  },
  farmTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  farmName: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    color: Colors.gray[900],
    flex: 1,
    marginRight: Spacing.sm,
  },
  farmBody: {
    padding: Spacing.md,
    gap: Spacing.xs,
  },
  farmDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  farmIcon: {
    fontSize: 16,
    width: 24,
  },
  farmDetail: {
    fontSize: FontSizes.sm,
    color: Colors.gray[700],
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.pill,
  },
  statusText: {
    fontSize: FontSizes.xs,
    fontWeight: '600',
    color: Colors.white,
  },
  farmFooter: {
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
