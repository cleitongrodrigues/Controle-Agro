// ══════════════════════════════════════════════════════════
// SETTINGS SCREEN - Configurações Gerais
// ══════════════════════════════════════════════════════════

import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { AppHeader } from '../components';
import { globalStyles } from '../styles/global';
import { Colors, Spacing, BorderRadius, FontSizes } from '../config/theme';
import { useToast } from '../contexts/ToastContext';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';

interface SettingsScreenProps {
  visible: boolean;
  onClose: () => void;
}

const NIVEL_LABEL: Record<string, string> = {
  admin: 'Administrador',
  supervisor: 'Supervisor',
  vendedor: 'Vendedor',
};

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ visible, onClose }) => {
  const { showToast } = useToast();
  const { usuario, logout } = useAuth();
  const { sales, farms, products, goals, recarregar } = useApp();
  const [syncing, setSyncing] = useState(false);

  const handleSync = async () => {
    setSyncing(true);
    try {
      await recarregar();
      showToast('Dados sincronizados com sucesso!', 'success');
    } catch {
      showToast('Erro ao sincronizar dados', 'error');
    } finally {
      setSyncing(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Sair',
      'Deseja realmente sair da conta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: async () => {
            onClose();
            await logout();
          },
        },
      ]
    );
  };

  if (!visible) return null;

  return (
    <View style={[globalStyles.container, styles.fullScreenOverlay]}>
      <AppHeader 
        title="Configurações" 
        subtitle="Ajustes do sistema"
        onBack={onClose}
      />
      
      <ScrollView style={styles.scrollContent}>
        <View style={globalStyles.section}>

          {/* Conta */}
          <Text style={styles.sectionTitle}>👤 Conta</Text>
          <View style={globalStyles.card}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Nome</Text>
              <Text style={styles.infoValue}>{usuario?.nome ?? '—'}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>E-mail</Text>
              <Text style={styles.infoValue}>{usuario?.email ?? '—'}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Nível</Text>
              <Text style={styles.infoValue}>
                {usuario?.nivel ? NIVEL_LABEL[usuario.nivel] ?? usuario.nivel : '—'}
              </Text>
            </View>
          </View>

          {/* Dados do sistema */}
          <Text style={styles.sectionTitle}>📊 Dados</Text>
          <View style={globalStyles.card}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Vendas cadastradas</Text>
              <Text style={styles.infoValue}>{sales.length}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Fazendas cadastradas</Text>
              <Text style={styles.infoValue}>{farms.length}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Produtos cadastrados</Text>
              <Text style={styles.infoValue}>{products.length}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Metas cadastradas</Text>
              <Text style={styles.infoValue}>{goals.length}</Text>
            </View>
          </View>

          {/* Ações */}
          <Text style={styles.sectionTitle}>⚙️ Ações</Text>
          <View style={globalStyles.card}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleSync}
              disabled={syncing}
            >
              <Text style={styles.actionIcon}>🔄</Text>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>
                  {syncing ? 'Sincronizando...' : 'Forçar Sincronização'}
                </Text>
                <Text style={styles.actionSubtitle}>Recarregar todos os dados do servidor</Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          </View>

          {/* Sobre */}
          <Text style={styles.sectionTitle}>ℹ️ Sobre</Text>
          <View style={globalStyles.card}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Versão do App</Text>
              <Text style={styles.infoValue}>1.0.0</Text>
            </View>
          </View>

          {/* Sair */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>🚪 Sair da conta</Text>
          </TouchableOpacity>

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
  logoutButton: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.xl,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.red[600],
    alignItems: 'center',
  },
  logoutText: {
    fontSize: FontSizes.base,
    fontWeight: '600',
    color: Colors.red[600],
  },
});
