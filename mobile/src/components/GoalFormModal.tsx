// ══════════════════════════════════════════════════════════
// GOAL FORM MODAL - Formulário de Meta
// ══════════════════════════════════════════════════════════

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, ScrollView } from 'react-native';
import { Colors, Spacing, BorderRadius, FontSizes, Shadows } from '../config/theme';
import { Goal } from '../types';
import { generateId } from '../utils/helpers';

interface GoalFormModalProps {
  visible: boolean;
  goal?: Goal | null;
  onSave: (goal: Goal) => void;
  onCancel: () => void;
}

export const GoalFormModal: React.FC<GoalFormModalProps> = ({
  visible,
  goal,
  onSave,
  onCancel,
}) => {
  const [nome, setNome] = useState('');
  const [valorMeta, setValorMeta] = useState('');
  const [categoria, setCategoria] = useState('');
  const [ativo, setAtivo] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (goal) {
      setNome(goal.nome);
      setValorMeta(goal.valorMeta.toString());
      setCategoria(goal.categoria || '');
      setAtivo(goal.ativo);
    } else {
      resetForm();
    }
  }, [goal, visible]);

  const resetForm = () => {
    setNome('');
    setValorMeta('');
    setCategoria('');
    setAtivo(true);
    setErrors({});
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }

    const valor = parseFloat(valorMeta);
    if (!valorMeta || valor <= 0) {
      newErrors.valorMeta = 'Valor deve ser maior que zero';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    const goalData: Goal = {
      id: goal?.id || generateId(),
      nome: nome.trim(),
      valorMeta: parseFloat(valorMeta),
      categoria: categoria.trim() || undefined,
      ativo,
    };

    onSave(goalData);
    resetForm();
    onCancel();
  };

  const handleClose = () => {
    resetForm();
    onCancel();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.container}>
          <ScrollView style={styles.content}>
            <Text style={styles.title}>
              {goal ? 'Editar Meta' : 'Nova Meta'}
            </Text>
            <Text style={styles.subtitle}>
              {goal ? 'Altere os dados da meta' : 'Defina uma nova meta de vendas'}
            </Text>

            {/* Nome da Meta */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Nome da meta *</Text>
              <TextInput
                style={[styles.input, errors.nome && styles.inputError]}
                value={nome}
                onChangeText={(text) => {
                  setNome(text);
                  setErrors(prev => ({ ...prev, nome: '' }));
                }}
                placeholder="Ex: Herbicidas & Defensivos"
                placeholderTextColor={Colors.gray[400]}
              />
              {errors.nome && <Text style={styles.errorText}>{errors.nome}</Text>}
            </View>

            {/* Valor da Meta */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Valor da meta (R$) *</Text>
              <TextInput
                style={[styles.input, errors.valorMeta && styles.inputError]}
                value={valorMeta}
                onChangeText={(text) => {
                  setValorMeta(text);
                  setErrors(prev => ({ ...prev, valorMeta: '' }));
                }}
                placeholder="18000"
                keyboardType="numeric"
                placeholderTextColor={Colors.gray[400]}
              />
              {errors.valorMeta && <Text style={styles.errorText}>{errors.valorMeta}</Text>}
              <Text style={styles.helpText}>
                Valor mensal que deseja atingir
              </Text>
            </View>

            {/* Categoria (opcional) */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Categoria (opcional)</Text>
              <TextInput
                style={styles.input}
                value={categoria}
                onChangeText={setCategoria}
                placeholder="Ex: herbicidas, sementes, fertilizantes"
                placeholderTextColor={Colors.gray[400]}
              />
              <Text style={styles.helpText}>
                Ajuda a organizar as metas por tipo de produto
              </Text>
            </View>

            {/* Status Ativo/Inativo */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Status</Text>
              <View style={styles.statusOptions}>
                <TouchableOpacity
                  style={[styles.statusButton, ativo && styles.statusButtonActive]}
                  onPress={() => setAtivo(true)}
                >
                  <Text style={[styles.statusButtonText, ativo && styles.statusButtonTextActive]}>
                    Ativa
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.statusButton, !ativo && styles.statusButtonActive]}
                  onPress={() => setAtivo(false)}
                >
                  <Text style={[styles.statusButtonText, !ativo && styles.statusButtonTextActive]}>
                    Inativa
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Botões */}
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.button, styles.buttonSecondary]}
                onPress={handleClose}
              >
                <Text style={styles.buttonSecondaryText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.buttonPrimary]}
                onPress={handleSave}
              >
                <Text style={styles.buttonPrimaryText}>
                  {goal ? 'Salvar' : 'Criar meta'}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
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
  content: {
    padding: Spacing.xl,
  },
  title: {
    fontSize: FontSizes.xxl,
    fontWeight: '700',
    color: Colors.gray[900],
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: FontSizes.sm,
    color: Colors.gray[500],
    marginBottom: Spacing.xl,
  },
  formGroup: {
    marginBottom: Spacing.lg,
  },
  label: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: Colors.gray[700],
    marginBottom: Spacing.xs,
  },
  input: {
    borderWidth: 1.5,
    borderColor: Colors.gray[300],
    borderRadius: BorderRadius.sm,
    padding: Spacing.md,
    fontSize: FontSizes.base,
    color: Colors.gray[900],
    backgroundColor: Colors.white,
  },
  inputError: {
    borderColor: Colors.red[600],
  },
  errorText: {
    fontSize: FontSizes.xs,
    color: Colors.red[600],
    marginTop: 4,
  },
  helpText: {
    fontSize: FontSizes.xs,
    color: Colors.gray[500],
    marginTop: 4,
  },
  statusOptions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  statusButton: {
    flex: 1,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderWidth: 1.5,
    borderColor: Colors.gray[300],
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
  },
  statusButtonActive: {
    borderColor: Colors.green[500],
    backgroundColor: Colors.green[50],
  },
  statusButtonText: {
    fontSize: FontSizes.sm,
    fontWeight: '500',
    color: Colors.gray[700],
  },
  statusButtonTextActive: {
    color: Colors.green[800],
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
  },
  button: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonSecondary: {
    backgroundColor: Colors.gray[100],
  },
  buttonPrimary: {
    backgroundColor: Colors.green[700],
  },
  buttonSecondaryText: {
    fontSize: FontSizes.base,
    fontWeight: '600',
    color: Colors.gray[700],
  },
  buttonPrimaryText: {
    fontSize: FontSizes.base,
    fontWeight: '600',
    color: Colors.white,
  },
});
