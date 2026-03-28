// ══════════════════════════════════════════════════════════
// GOAL LIST SCREEN - Tela de Gerenciamento de Metas
// ══════════════════════════════════════════════════════════

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { AppHeader, GoalFormModal, ConfirmModal, SearchBar } from '../components';
import { globalStyles } from '../styles/global';
import { Colors, Spacing, BorderRadius, FontSizes, Shadows } from '../config/theme';
import { useApp } from '../contexts/AppContext';
import { useToast } from '../contexts/ToastContext';
import { Goal } from '../types';
import { formatCurrency } from '../utils/helpers';

interface GoalListScreenProps {
  visible: boolean;
  onClose: () => void;
}

export const GoalListScreen: React.FC<GoalListScreenProps> = ({ visible, onClose }) => {
  const { goals = [], addGoal, updateGoal, deleteGoal } = useApp();
  const { showToast } = useToast();
  
  const [goalFormVisible, setGoalFormVisible] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Goal | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // ============================================
  // GOAL HANDLERS
  // ============================================

  const handleAddGoal = () => {
    setEditingGoal(null);
    setGoalFormVisible(true);
  };

  const handleEditGoal = (goal: Goal) => {
    setEditingGoal(goal);
    setGoalFormVisible(true);
  };

  const handleSaveGoal = async (goal: Goal) => {
    try {
      if (editingGoal) {
        await updateGoal(goal.id, goal);
        showToast('Meta atualizada com sucesso!', 'success');
      } else {
        await addGoal(goal);
        showToast('Meta cadastrada com sucesso!', 'success');
      }
      setGoalFormVisible(false);
      setEditingGoal(null);
    } catch (error) {
      showToast('Erro ao salvar meta', 'error');
    }
  };

  const confirmDeleteGoal = (goal: Goal) => {
    setDeleteConfirm(goal);
  };

  const handleDeleteGoal = async () => {
    if (!deleteConfirm) return;
    
    try {
      await deleteGoal(deleteConfirm.id);
      showToast('Meta removida com sucesso!', 'success');
      setDeleteConfirm(null);
    } catch (error) {
      showToast('Erro ao remover meta', 'error');
    }
  };

  const filteredGoals = goals.filter(goal =>
    goal.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (goal.categoria && goal.categoria.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (!visible) return null;

  return (
    <View style={[globalStyles.container, styles.fullScreenOverlay]}>
      <AppHeader 
        title="Gerenciar Metas" 
        subtitle="Cadastre e edite metas"
        onBack={onClose}
      />
      
      <ScrollView style={styles.scrollContent}>
        <View style={globalStyles.section}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddGoal}
            >
              <Text style={styles.addButtonText}>➕ Nova Meta</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.searchContainer}>
            <SearchBar
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Buscar meta..."
            />
          </View>

          {filteredGoals.length === 0 ? (
            <View style={globalStyles.card}>
              <Text style={styles.emptyText}>
                {searchQuery ? 'Nenhuma meta encontrada' : 'Nenhuma meta cadastrada'}
              </Text>
            </View>
          ) : (
            filteredGoals.map((goal) => (
              <View key={goal.id} style={styles.goalCard}>
                <View style={styles.goalHeader}>
                  <View style={styles.goalTitleRow}>
                    <Text style={[styles.goalName, !goal.ativo && styles.goalNameInactive]}>
                      {goal.nome}
                    </Text>
                    {!goal.ativo && (
                      <View style={styles.inactiveBadge}>
                        <Text style={styles.inactiveBadgeText}>Inativa</Text>
                      </View>
                    )}
                  </View>
                </View>

                <View style={styles.goalBody}>
                  <View style={styles.metaRow}>
                    <Text style={styles.metaLabel}>Meta:</Text>
                    <Text style={styles.metaValue}>{formatCurrency(goal.valorMeta)}</Text>
                  </View>
                  {goal.categoria && (
                    <View style={styles.categoriaRow}>
                      <Text style={styles.categoriaIcon}>📁</Text>
                      <Text style={styles.categoriaText}>{goal.categoria}</Text>
                    </View>
                  )}
                </View>

                <View style={styles.goalFooter}>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => handleEditGoal(goal)}
                  >
                    <Text style={styles.editButtonIcon}>✏️</Text>
                    <Text style={styles.editButtonText}>Editar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => confirmDeleteGoal(goal)}
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

      {/* Goal Form Modal */}
      <GoalFormModal
        visible={goalFormVisible}
        goal={editingGoal}
        onSave={handleSaveGoal}
        onCancel={() => {
          setGoalFormVisible(false);
          setEditingGoal(null);
        }}
      />

      {/* Delete Confirmation */}
      <ConfirmModal
        visible={!!deleteConfirm}
        title="Excluir meta?"
        message={`Deseja realmente excluir a meta "${deleteConfirm?.nome}"?`}
        onConfirm={handleDeleteGoal}
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
  goalCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
    ...Shadows.sm,
    overflow: 'hidden',
  },
  goalHeader: {
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[100],
  },
  goalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  goalName: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    color: Colors.gray[900],
    flex: 1,
  },
  goalNameInactive: {
    color: Colors.gray[500],
  },
  inactiveBadge: {
    backgroundColor: Colors.gray[300],
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.pill,
  },
  inactiveBadgeText: {
    fontSize: FontSizes.xs,
    fontWeight: '600',
    color: Colors.gray[700],
  },
  goalBody: {
    padding: Spacing.md,
    gap: Spacing.xs,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaLabel: {
    fontSize: FontSizes.sm,
    color: Colors.gray[700],
    fontWeight: '500',
  },
  metaValue: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    color: Colors.green[600],
  },
  categoriaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  categoriaIcon: {
    fontSize: 16,
  },
  categoriaText: {
    fontSize: FontSizes.sm,
    color: Colors.gray[700],
  },
  goalFooter: {
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
