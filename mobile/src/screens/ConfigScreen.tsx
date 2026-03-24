// ══════════════════════════════════════════════════════════
// CONFIG SCREEN - Hub de Configurações
// ══════════════════════════════════════════════════════════

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { AppHeader, ProductListScreen, FarmListScreen, SettingsScreen, DataSyncScreen } from '../components';
import { globalStyles } from '../styles/global';
import { Colors, Spacing, BorderRadius, FontSizes, Shadows } from '../config/theme';
import { useApp } from '../contexts/AppContext';
import { useFocusEffect } from '@react-navigation/native';
import { useNavigation, useRoute } from '@react-navigation/native';

export const ConfigScreen: React.FC = () => {
  const { products, farms } = useApp();
  const [productListVisible, setProductListVisible] = useState(false);
  const [farmListVisible, setFarmListVisible] = useState(false);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [dataSyncVisible, setDataSyncVisible] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();

  // Fechar todas as modals quando a tela recebe foco
  useFocusEffect(
    React.useCallback(() => {
      setProductListVisible(false);
      setFarmListVisible(false);
      setSettingsVisible(false);
      setDataSyncVisible(false);
    }, [])
  );

  // Listener para detectar quando a aba Config é pressionada novamente
  useEffect(() => {
    const unsubscribe = navigation.addListener('tabPress' as any, (e: any) => {
      // Se alguma modal estiver aberta, fechar todas
      if (productListVisible || farmListVisible || settingsVisible || dataSyncVisible) {
        setProductListVisible(false);
        setFarmListVisible(false);
        setSettingsVisible(false);
        setDataSyncVisible(false);
      }
    });

    return unsubscribe;
  }, [navigation, productListVisible, farmListVisible, settingsVisible, dataSyncVisible]);

  const configCards = [
    {
      id: 'products',
      title: 'Gerenciar Produtos',
      subtitle: `${products.length} ${products.length === 1 ? 'produto cadastrado' : 'produtos cadastrados'}`,
      icon: '📦',
      color: Colors.green[600],
      onPress: () => setProductListVisible(true),
    },
    {
      id: 'farms',
      title: 'Gerenciar Fazendas',
      subtitle: `${farms.length} ${farms.length === 1 ? 'fazenda cadastrada' : 'fazendas cadastradas'}`,
      icon: '🚜',
      color: Colors.amber[600],
      onPress: () => setFarmListVisible(true),
    },
    {
      id: 'settings',
      title: 'Configurações Gerais',
      subtitle: 'Nome vendedor, metas e preços',
      icon: '⚙️',
      color: '#8b5cf6',
      onPress: () => setSettingsVisible(true),
    },
    {
      id: 'sync',
      title: 'Dados e Sincronização',
      subtitle: 'Gerenciar cache e sincronização',
      icon: '🔄',
      color: '#3b82f6',
      onPress: () => setDataSyncVisible(true),
    },
  ];

  return (
    <View style={globalStyles.container}>
      <AppHeader title="Configurações" subtitle="Gerencie seu sistema" />
      
      <ScrollView style={styles.scrollContent}>
        <View style={globalStyles.section}>
          {configCards.map(card => (
            <TouchableOpacity
              key={card.id}
              style={styles.card}
              onPress={card.onPress}
              activeOpacity={0.7}
            >
              <View style={[styles.iconContainer, { backgroundColor: `${card.color}20` }]}>
                <Text style={styles.icon}>{card.icon}</Text>
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{card.title}</Text>
                <Text style={styles.cardSubtitle}>{card.subtitle}</Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Info Section */}
        <View style={globalStyles.section}>
          <Text style={styles.infoTitle}>Sobre o App</Text>
          <View style={globalStyles.card}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Versão</Text>
              <Text style={styles.infoValue}>1.0.0</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Desenvolvido por</Text>
              <Text style={styles.infoValue}>CopilotAGRO</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Product List Modal Screen */}
      <ProductListScreen
        visible={productListVisible}
        onClose={() => setProductListVisible(false)}
      />

      {/* Farm List Modal Screen */}
      <FarmListScreen
        visible={farmListVisible}
        onClose={() => setFarmListVisible(false)}
      />

      {/* Settings Modal Screen */}
      <SettingsScreen
        visible={settingsVisible}
        onClose={() => setSettingsVisible(false)}
      />

      {/* Data Sync Modal Screen */}
      <DataSyncScreen
        visible={dataSyncVisible}
        onClose={() => setDataSyncVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flex: 1,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  icon: {
    fontSize: 24,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: FontSizes.base,
    fontWeight: '600',
    color: Colors.gray[900],
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: FontSizes.sm,
    color: Colors.gray[500],
  },
  chevron: {
    fontSize: 28,
    color: Colors.gray[300],
    fontWeight: '300',
  },
  infoTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: Colors.gray[900],
    marginBottom: Spacing.md,
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
});
