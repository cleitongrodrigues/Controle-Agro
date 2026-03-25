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
  const { farms, addFarm, updateFarm, deleteFarm } = useApp();
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

          <View style={globalStyles.card}>
            {filteredFarms.length === 0 ? (
              <Text style={styles.emptyText}>
                {searchQuery ? 'Nenhuma fazenda encontrada' : 'Nenhuma fazenda cadastrada'}
              </Text>
            ) : (
              filteredFarms.map((farm, index) => (
                <View key={farm.id} style={styles.farmItem}>
                  <View style={styles.farmInfo}>
                    <Text style={styles.farmName}>{farm.nome}</Text>
                    <Text style={styles.farmDetail}>👤 {farm.proprietario}</Text>
                    <Text style={styles.farmDetail}>📍 {farm.localizacao}</Text>
                    <Text style={styles.farmDetail}>🌾 {farm.hectares} hectares</Text>
                    {farm.telefone && (
                      <Text style={styles.farmDetail}>📞 {farm.telefone}</Text>
                    )}
                    <View
                      style={[
                        styles.statusBadge,
                        { backgroundColor: `${getStatusColor(farm.status)}20` },
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusText,
                          { color: getStatusColor(farm.status) },
                        ]}
                      >
                        {getStatusLabel(farm.status)}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.actions}>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleEditFarm(farm)}
                    >
                      <Text style={styles.actionIcon}>✏️</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.actionButton, styles.deleteButton]}
                      onPress={() => confirmDeleteFarm(farm)}
                    >
                      <Text style={styles.actionIcon}>🗑️</Text>
                    </TouchableOpacity>
                  </View>
                  {index < filteredFarms.length - 1 && (
                    <View style={styles.divider} />
                  )}
                </View>
              ))
            )}
          </View>
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
  farmItem: {
    position: 'relative',
    paddingVertical: Spacing.md,
  },
  farmInfo: {
    flex: 1,
    paddingBottom: Spacing.sm,
  },
  farmName: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: Colors.gray[900],
    marginBottom: Spacing.xs,
  },
  farmDetail: {
    fontSize: FontSizes.sm,
    color: Colors.gray[700],
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.pill,
    alignSelf: 'flex-start',
    marginTop: Spacing.xs,
  },
  statusText: {
    fontSize: FontSizes.xs,
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
