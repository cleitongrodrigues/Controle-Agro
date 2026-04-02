// ══════════════════════════════════════════════════════════
// FARM HISTORY MODAL - MODAL DE HISTÓRICO DA FAZENDA
// ══════════════════════════════════════════════════════════

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
} from 'react-native';
import { Colors, BorderRadius, FontSizes, Spacing } from '../config/theme';
import { Farm, FarmStatus, Sale } from '../types';
import { formatCurrency } from '../utils/helpers';

interface FarmHistoryModalProps {
  visible: boolean;
  onClose: () => void;
  farm: Farm | null;
  sales: Sale[];
  onStatusChange: (farmId: string, newStatus: FarmStatus) => void;
}

const SCREEN_HEIGHT = Dimensions.get('window').height;

const STATUS_OPTIONS: { value: FarmStatus; label: string; color: string; icon: string }[] = [
  { value: 'visitado', label: 'Visitado', color: Colors.green[600], icon: '✓' },
  { value: 'pendente', label: 'Pendente', color: Colors.amber[600], icon: '⏳' },
  { value: 'urgente',  label: 'Urgente',  color: Colors.red[600],   icon: '⚠' },
];

export const FarmHistoryModal: React.FC<FarmHistoryModalProps> = ({
  visible,
  onClose,
  farm,
  sales,
  onStatusChange,
}) => {
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 65,
          friction: 11,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: SCREEN_HEIGHT,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  if (!farm) return null;

  const farmSales = sales.filter(s => s.fazendaId === farm.id);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Animated.View style={[styles.overlayBg, { opacity: fadeAnim }]} />
      </Pressable>

      <Animated.View
        style={[
          styles.modalSheet,
          { transform: [{ translateY: slideAnim }] },
        ]}
      >
        <View style={styles.handle} />

        {/* Cabeçalho */}
        <View style={styles.header}>
          <Text style={styles.title}>{farm.nome}</Text>
          <Text style={styles.subtitle}>
            {farm.proprietario} · {farm.hectares} ha · {farm.localizacao}
          </Text>
        </View>

        {/* Seletor de status */}
        <View style={styles.statusSection}>
          <Text style={styles.statusLabel}>Status da visita</Text>
          <View style={styles.statusRow}>
            {STATUS_OPTIONS.map(opt => {
              const isActive = farm.status === opt.value;
              return (
                <TouchableOpacity
                  key={opt.value}
                  style={[
                    styles.statusBtn,
                    { borderColor: opt.color },
                    isActive && { backgroundColor: opt.color },
                  ]}
                  onPress={() => {
                    if (!isActive) onStatusChange(farm.id, opt.value);
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.statusBtnText, isActive && styles.statusBtnTextActive]}>
                    {opt.icon} {opt.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Histórico de vendas */}
        <Text style={styles.histTitle}>Vendas registradas</Text>
        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          bounces
        >
          {farmSales.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>📦</Text>
              <Text style={styles.emptyText}>Nenhuma venda registrada</Text>
              <Text style={styles.emptySubtext}>
                As vendas aparecerão aqui após o registro
              </Text>
            </View>
          ) : (
            farmSales.map((sale) => (
              <View key={sale.id} style={styles.histItem}>
                <Text style={styles.histDate}>
                  {new Date(sale.data).toLocaleDateString('pt-BR')}
                </Text>
                <Text style={styles.histProd}>{sale.produto}</Text>
                <Text style={styles.histVal}>
                  {formatCurrency(sale.valorComDesconto ?? sale.valorTotal)}
                </Text>
                {sale.quantidade > 0 && (
                  <Text style={styles.histNote}>
                    {sale.quantidade} un · {formatCurrency(sale.valorUnitario)}/un
                  </Text>
                )}
              </View>
            ))
          )}
        </ScrollView>

        <Pressable style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>Fechar</Text>
        </Pressable>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlayBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalSheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: BorderRadius.lg,
    borderTopRightRadius: BorderRadius.lg,
    paddingTop: 12,
    paddingHorizontal: Spacing.xl,
    paddingBottom: 40,
    maxHeight: SCREEN_HEIGHT * 0.85,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 16,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.gray[300],
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: FontSizes.xl,
    fontWeight: '600',
    color: Colors.gray[900],
    marginBottom: 4,
  },
  subtitle: {
    fontSize: FontSizes.base,
    color: Colors.gray[500],
  },
  statusSection: {
    marginBottom: 20,
  },
  statusLabel: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: Colors.gray[600],
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statusRow: {
    flexDirection: 'row',
    gap: 8,
  },
  statusBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: BorderRadius.sm,
    borderWidth: 2,
    alignItems: 'center',
  },
  statusBtnText: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: Colors.gray[700],
  },
  statusBtnTextActive: {
    color: Colors.white,
  },
  histTitle: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: Colors.gray[600],
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  content: {
    flex: 1,
  },
  histItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[100],
  },
  histDate: {
    fontSize: FontSizes.sm,
    color: Colors.gray[500],
    marginBottom: 4,
  },
  histProd: {
    fontSize: FontSizes.md,
    fontWeight: '500',
    color: Colors.gray[900],
    marginBottom: 3,
  },
  histVal: {
    fontSize: FontSizes.base,
    color: Colors.green[600],
    fontWeight: '600',
    marginTop: 3,
  },
  histNote: {
    fontSize: FontSizes.base,
    color: Colors.gray[500],
    marginTop: 4,
    fontStyle: 'italic',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: Colors.gray[700],
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: FontSizes.base,
    color: Colors.gray[500],
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: Colors.green[800],
    paddingVertical: 14,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    marginTop: 20,
  },
  closeButtonText: {
    color: Colors.white,
    fontSize: FontSizes.md,
    fontWeight: '600',
  },
});
