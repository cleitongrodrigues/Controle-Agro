// ══════════════════════════════════════════════════════════
// FARM FORM MODAL - Modal de cadastro/edição de fazendas
// ══════════════════════════════════════════════════════════

import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Colors, Spacing, BorderRadius, FontSizes, Shadows } from '../config/theme';
import { Farm, FarmStatus } from '../types';

interface FarmFormModalProps {
  visible: boolean;
  farm?: Farm | null;
  onSave: (farm: Farm) => void;
  onCancel: () => void;
}

export const FarmFormModal: React.FC<FarmFormModalProps> = ({
  visible,
  farm,
  onSave,
  onCancel,
}) => {
  const [nome, setNome] = useState('');
  const [proprietario, setProprietario] = useState('');
  const [hectares, setHectares] = useState('');
  const [localizacao, setLocalizacao] = useState('');
  const [telefone, setTelefone] = useState('');
  const [status, setStatus] = useState<FarmStatus>('pendente');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEditing = !!farm;

  useEffect(() => {
    if (farm) {
      setNome(farm.nome);
      setProprietario(farm.proprietario);
      setHectares(farm.hectares.toString());
      setLocalizacao(farm.localizacao);
      setTelefone(farm.telefone || '');
      setStatus(farm.status);
    } else {
      resetForm();
    }
  }, [farm, visible]);

  const resetForm = () => {
    setNome('');
    setProprietario('');
    setHectares('');
    setLocalizacao('');
    setTelefone('');
    setStatus('pendente');
    setErrors({});
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }

    if (!proprietario.trim()) {
      newErrors.proprietario = 'Proprietário é obrigatório';
    }

    const hect = parseFloat(hectares);
    if (!hectares || isNaN(hect) || hect <= 0) {
      newErrors.hectares = 'Hectares deve ser maior que zero';
    }

    if (!localizacao.trim()) {
      newErrors.localizacao = 'Localização é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    const farmData: Farm = {
      id: farm?.id || Date.now().toString(),
      nome: nome.trim(),
      proprietario: proprietario.trim(),
      hectares: parseFloat(hectares),
      localizacao: localizacao.trim(),
      telefone: telefone.trim() || undefined,
      status,
    };

    onSave(farmData);
    resetForm();
  };

  const handleCancel = () => {
    resetForm();
    onCancel();
  };

  const statusOptions: { value: FarmStatus; label: string; color: string }[] = [
    { value: 'visitado', label: 'Visitado', color: Colors.green[600] },
    { value: 'pendente', label: 'Pendente', color: Colors.amber[600] },
    { value: 'urgente', label: 'Urgente', color: Colors.red[600] },
  ];

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
              {isEditing ? '✏️ Editar Fazenda' : '➕ Nova Fazenda'}
            </Text>
            <TouchableOpacity onPress={handleCancel} style={styles.closeButton}>
              <Text style={styles.closeIcon}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            {/* Nome */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Nome da Fazenda *</Text>
              <TextInput
                style={[styles.input, errors.nome && styles.inputError]}
                value={nome}
                onChangeText={(text) => {
                  setNome(text);
                  setErrors(prev => ({ ...prev, nome: '' }));
                }}
                placeholder="Ex: Fazenda Boa Vista"
                placeholderTextColor={Colors.gray[300]}
              />
              {errors.nome && <Text style={styles.errorText}>{errors.nome}</Text>}
            </View>

            {/* Proprietário */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Proprietário *</Text>
              <TextInput
                style={[styles.input, errors.proprietario && styles.inputError]}
                value={proprietario}
                onChangeText={(text) => {
                  setProprietario(text);
                  setErrors(prev => ({ ...prev, proprietario: '' }));
                }}
                placeholder="Ex: João Silva"
                placeholderTextColor={Colors.gray[300]}
              />
              {errors.proprietario && <Text style={styles.errorText}>{errors.proprietario}</Text>}
            </View>

            {/* Hectares */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Hectares *</Text>
              <TextInput
                style={[styles.input, errors.hectares && styles.inputError]}
                value={hectares}
                onChangeText={(text) => {
                  setHectares(text);
                  setErrors(prev => ({ ...prev, hectares: '' }));
                }}
                placeholder="Ex: 1200"
                keyboardType="numeric"
                placeholderTextColor={Colors.gray[300]}
              />
              {errors.hectares && <Text style={styles.errorText}>{errors.hectares}</Text>}
            </View>

            {/* Localização */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Localização *</Text>
              <TextInput
                style={[styles.input, errors.localizacao && styles.inputError]}
                value={localizacao}
                onChangeText={(text) => {
                  setLocalizacao(text);
                  setErrors(prev => ({ ...prev, localizacao: '' }));
                }}
                placeholder="Ex: MT-246, km 18"
                placeholderTextColor={Colors.gray[300]}
              />
              {errors.localizacao && <Text style={styles.errorText}>{errors.localizacao}</Text>}
            </View>

            {/* Telefone (opcional) */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Telefone (opcional)</Text>
              <TextInput
                style={styles.input}
                value={telefone}
                onChangeText={setTelefone}
                placeholder="Ex: (65) 99999-9999"
                keyboardType="phone-pad"
                placeholderTextColor={Colors.gray[300]}
              />
            </View>

            {/* Status */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Status *</Text>
              <View style={styles.statusRow}>
                {statusOptions.map(option => (
                  <TouchableOpacity
                    key={option.value}
                    onPress={() => setStatus(option.value)}
                    style={[
                      styles.statusOption,
                      status === option.value && {
                        borderColor: option.color,
                        backgroundColor: `${option.color}15`,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        status === option.value && { color: option.color, fontWeight: '600' },
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
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
  statusRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  statusOption: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderWidth: 1.5,
    borderColor: Colors.gray[100],
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  statusText: {
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
