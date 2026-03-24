// ══════════════════════════════════════════════════════════
// SETTINGS SCREEN - Configurações Gerais
// ══════════════════════════════════════════════════════════

import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { AppHeader } from '../components';
import { globalStyles } from '../styles/global';
import { Colors, Spacing, BorderRadius, FontSizes } from '../config/theme';
import { useToast } from '../contexts/ToastContext';

interface SettingsScreenProps {
  visible: boolean;
  onClose: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ visible, onClose }) => {
  const { showToast } = useToast();
  
  // Estados das configurações
  const [vendorName, setVendorName] = useState('João Silva');
  const [monthlyGoal, setMonthlyGoal] = useState('50000');
  const [sojaPrice, setSojaPrice] = useState('160');
  const [companyName, setCompanyName] = useState('AgroVendas');
  
  const [hasChanges, setHasChanges] = useState(false);

  const handleSave = () => {
    // TODO: Salvar no AsyncStorage
    showToast('✅ Configurações salvas com sucesso!', 'success');
    setHasChanges(false);
  };

  const handleReset = () => {
    setVendorName('João Silva');
    setMonthlyGoal('50000');
    setSojaPrice('160');
    setCompanyName('AgroVendas');
    setHasChanges(false);
    showToast('Configurações restauradas', 'info');
  };

  const markChanged = () => {
    if (!hasChanges) setHasChanges(true);
  };

  if (!visible) return null;

  return (
    <View style={[globalStyles.container, styles.fullScreenOverlay]}>
      <AppHeader 
        title="Configurações Gerais" 
        subtitle="Personalize o sistema"
        onBack={onClose}
      />
      
      <ScrollView style={styles.scrollContent}>
        <View style={globalStyles.section}>
          {/* Informações do Vendedor */}
          <Text style={styles.sectionTitle}>👤 Informações do Vendedor</Text>
          <View style={globalStyles.card}>
            <View style={globalStyles.formGroup}>
              <Text style={globalStyles.formLabel}>Nome completo</Text>
              <TextInput
                style={globalStyles.input}
                value={vendorName}
                onChangeText={(text) => {
                  setVendorName(text);
                  markChanged();
                }}
                placeholder="Digite seu nome"
              />
              <Text style={styles.helpText}>
                Seu nome aparecerá nos relatórios e documentos
              </Text>
            </View>

            <View style={globalStyles.formGroup}>
              <Text style={globalStyles.formLabel}>Empresa</Text>
              <TextInput
                style={globalStyles.input}
                value={companyName}
                onChangeText={(text) => {
                  setCompanyName(text);
                  markChanged();
                }}
                placeholder="Nome da empresa"
              />
            </View>
          </View>

          {/* Metas e Valores */}
          <Text style={styles.sectionTitle}>🎯 Metas e Valores</Text>
          <View style={globalStyles.card}>
            <View style={globalStyles.formGroup}>
              <Text style={globalStyles.formLabel}>Meta mensal (R$)</Text>
              <TextInput
                style={globalStyles.input}
                value={monthlyGoal}
                onChangeText={(text) => {
                  setMonthlyGoal(text);
                  markChanged();
                }}
                placeholder="50000"
                keyboardType="numeric"
              />
              <Text style={styles.helpText}>
                Meta de vendas para o mês atual
              </Text>
            </View>

            <View style={globalStyles.formGroup}>
              <Text style={globalStyles.formLabel}>Preço da soja (R$/saca)</Text>
              <TextInput
                style={globalStyles.input}
                value={sojaPrice}
                onChangeText={(text) => {
                  setSojaPrice(text);
                  markChanged();
                }}
                placeholder="160"
                keyboardType="numeric"
              />
              <Text style={styles.helpText}>
                Valor usado para conversão em sacas de soja
              </Text>
            </View>
          </View>

          {/* Sobre o Sistema */}
          <Text style={styles.sectionTitle}>ℹ️ Sobre o Sistema</Text>
          <View style={globalStyles.card}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Versão do App</Text>
              <Text style={styles.infoValue}>1.0.0</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Última sincronização</Text>
              <Text style={styles.infoValue}>Hoje, 14:32</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Vendas cadastradas</Text>
              <Text style={styles.infoValue}>12</Text>
            </View>
          </View>

          {/* Ações do Sistema */}
          <Text style={styles.sectionTitle}>⚙️ Ações do Sistema</Text>
          <View style={globalStyles.card}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => showToast('Sincronizando dados...', 'info')}
            >
              <Text style={styles.actionIcon}>🔄</Text>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>Forçar Sincronização</Text>
                <Text style={styles.actionSubtitle}>Sincronizar dados com o servidor</Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => showToast('Cache limpo com sucesso', 'success')}
            >
              <Text style={styles.actionIcon}>🗑️</Text>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>Limpar Cache</Text>
                <Text style={styles.actionSubtitle}>Liberar espaço de armazenamento</Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleReset}
            >
              <Text style={styles.actionIcon}>↺</Text>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>Restaurar Padrões</Text>
                <Text style={[styles.actionSubtitle, styles.warningText]}>
                  Resetar configurações para valores padrão
                </Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          </View>

          {/* Botões de ação */}
          {hasChanges && (
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={[globalStyles.btnSecondary, { flex: 1 }]}
                onPress={handleReset}
              >
                <Text style={globalStyles.btnSecondaryText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[globalStyles.btnPrimary, { flex: 2 }]}
                onPress={handleSave}
              >
                <Text style={globalStyles.btnPrimaryText}>Salvar Alterações</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
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
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: Colors.gray[900],
    marginBottom: Spacing.md,
    marginTop: Spacing.md,
  },
  helpText: {
    fontSize: FontSizes.xs,
    color: Colors.gray[500],
    marginTop: 4,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
  },
  infoLabel: {
    fontSize: FontSizes.base,
    color: Colors.gray[500],
  },
  infoValue: {
    fontSize: FontSizes.base,
    fontWeight: '500',
    color: Colors.gray[900],
  },
  divider: {
    height: 1,
    backgroundColor: Colors.gray[100],
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  actionIcon: {
    fontSize: 24,
    marginRight: Spacing.md,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: FontSizes.base,
    fontWeight: '500',
    color: Colors.gray[900],
    marginBottom: 2,
  },
  actionSubtitle: {
    fontSize: FontSizes.sm,
    color: Colors.gray[500],
  },
  warningText: {
    color: Colors.amber[600],
  },
  chevron: {
    fontSize: 28,
    color: Colors.gray[300],
    fontWeight: '300',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.lg,
  },
});
