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

          <View style={globalStyles.card}>
            {filteredGoals.length === 0 ? (
              <Text style={styles.emptyText}>
                {searchQuery ? 'Nenhuma meta encontrada' : 'Nenhuma meta cadastrada'}
              </Text>
            ) : (
              filteredGoals.map((goal, index) => (
                <View key={goal.id} style={styles.goalItem}>
                  <View style={styles.goalInfo}>
                    <View style={styles.goalHeader}>
                      <Text style={[styles.goalName, !goal.ativo && styles.goalNameInactive]}>
                        {goal.nome}
                      </Text>
                      {!goal.ativo && (
                        <View style={styles.inactiveBadge}>
                          <Text style={styles.inactiveBadgeText}>Inativa</Text>
                        </View>
                      )}
                    </View>
                    <View style={styles.goalMeta}>
                      <Text style={styles.goalValue}>
                        Meta: {formatCurrency(goal.valorMeta)}
                      </Text>
                      {goal.categoria && (
                        <Text style={styles.goalCategory}>
                          📁 {goal.categoria}
                        </Text>
                      )}
                    </View>
                  </View>
                  <View style={styles.actions}>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleEditGoal(goal)}
                    >
                      <Text style={styles.actionIcon}>✏️</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.actionButton, styles.deleteButton]}
                      onPress={() => confirmDeleteGoal(goal)}
                    >
                      <Text style={styles.actionIcon}>🗑️</Text>
                    </TouchableOpacity>
                  </View>
                  {index < filteredGoals.length - 1 && (
                    <View style={styles.divider} />
                  )}
                </View>
              ))
            )}
          </View>
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
  goalItem: {
    position: 'relative',
  },
  goalInfo: {
    flex: 1,
    paddingVertical: Spacing.md,
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: 4,
  },
  goalName: {
    fontSize: FontSizes.base,
    fontWeight: '600',
    color: Colors.gray[900],
  },
  goalNameInactive: {
    color: Colors.gray[500],
  },
  inactiveBadge: {
    backgroundColor: Colors.gray[300],
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  inactiveBadgeText: {
    fontSize: FontSizes.xs,
    fontWeight: '600',
    color: Colors.gray[700],
  },
  goalMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    flexWrap: 'wrap',
  },
  goalValue: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    color: Colors.green[700],
  },
  goalCategory: {
    fontSize: FontSizes.sm,
    color: Colors.gray[500],
  },
  actions: {
    position: 'absolute',
    right: 0,
    top: Spacing.md,
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.gray[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButton: {
    backgroundColor: Colors.red[100],
  },
  actionIcon: {
    fontSize: FontSizes.lg,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.gray[100],
    marginTop: Spacing.md,
  },
});
