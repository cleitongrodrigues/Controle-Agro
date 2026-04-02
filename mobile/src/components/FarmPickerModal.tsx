// ══════════════════════════════════════════════════════════
// FARM PICKER MODAL - Modal de seleção de fazenda com busca
// ══════════════════════════════════════════════════════════

import React, { useState, useMemo } from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Colors, Spacing, BorderRadius, FontSizes, Shadows } from '../config/theme';
import { Farm } from '../types';
import { SearchBar } from './SearchBar';

interface FarmPickerModalProps {
  visible: boolean;
  farms: Farm[];
  selectedId?: string;
  onSelect: (farm: Farm) => void;
  onClose: () => void;
}

const STATUS_COLORS: Record<string, string> = {
  visitado: Colors.green[600],
  pendente: Colors.amber[600],
  urgente: Colors.red[600],
};

export const FarmPickerModal: React.FC<FarmPickerModalProps> = ({
  visible,
  farms,
  selectedId,
  onSelect,
  onClose,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFarms = useMemo(() => {
    if (!searchQuery.trim()) return farms;
    const query = searchQuery.toLowerCase();
    return farms.filter(farm =>
      farm.nome.toLowerCase().includes(query) ||
      farm.responsavel.toLowerCase().includes(query) ||
      farm.localizacao.toLowerCase().includes(query)
    );
  }, [farms, searchQuery]);

  const handleSelect = (farm: Farm) => {
    onSelect(farm);
    setSearchQuery('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Selecionar Fazenda</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeIcon}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.searchContainer}>
            <SearchBar
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Buscar fazenda..."
            />
          </View>

          <ScrollView style={styles.content}>
            {filteredFarms.length === 0 ? (
              <Text style={styles.emptyText}>
                {searchQuery ? 'Nenhuma fazenda encontrada' : 'Nenhuma fazenda cadastrada'}
              </Text>
            ) : (
              filteredFarms.map((farm) => {
                const statusColor = STATUS_COLORS[farm.status] ?? Colors.gray[500];
                return (
                  <TouchableOpacity
                    key={farm.id}
                    style={[
                      styles.farmItem,
                      selectedId === farm.id && styles.farmItemSelected,
                    ]}
                    onPress={() => handleSelect(farm)}
                  >
                    <View style={styles.farmInfo}>
                      <Text style={styles.farmName}>{farm.nome}</Text>
                      <View style={styles.farmMeta}>
                        <View
                          style={[
                            styles.statusBadge,
                            { backgroundColor: `${statusColor}20` },
                          ]}
                        >
                          <Text style={[styles.statusText, { color: statusColor }]}>
                            {farm.status}
                          </Text>
                        </View>
                        <Text style={styles.farmDetail}>
                          {farm.responsavel} · {farm.hectares} ha
                        </Text>
                      </View>
                    </View>
                    {selectedId === farm.id && (
                      <Text style={styles.checkIcon}>✓</Text>
                    )}
                  </TouchableOpacity>
                );
              })
            )}
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
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: BorderRadius.lg,
    borderTopRightRadius: BorderRadius.lg,
    maxHeight: '80%',
    flex: 1,
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
  searchContainer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  emptyText: {
    fontSize: FontSizes.base,
    color: Colors.gray[400],
    textAlign: 'center',
    paddingVertical: Spacing.xxl,
  },
  farmItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.sm,
    backgroundColor: Colors.gray[50],
  },
  farmItemSelected: {
    backgroundColor: Colors.green[50],
    borderWidth: 1,
    borderColor: Colors.green[600],
  },
  farmInfo: {
    flex: 1,
  },
  farmName: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.gray[900],
    marginBottom: 4,
  },
  farmMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  statusText: {
    fontSize: FontSizes.xs,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  farmDetail: {
    fontSize: FontSizes.sm,
    color: Colors.gray[500],
  },
  checkIcon: {
    fontSize: FontSizes.xl,
    color: Colors.green[600],
    fontWeight: '700',
    marginLeft: Spacing.sm,
  },
});
