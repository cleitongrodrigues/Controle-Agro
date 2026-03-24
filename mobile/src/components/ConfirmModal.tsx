// ══════════════════════════════════════════════════════════
// CONFIRM MODAL - Modal de confirmação de ações
// ══════════════════════════════════════════════════════════

import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, Spacing, BorderRadius, FontSizes, Shadows } from '../config/theme';

interface ConfirmModalProps {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  destructive?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  visible,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  onConfirm,
  onCancel,
  destructive = false,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <TouchableOpacity 
        style={styles.backdrop}
        activeOpacity={1}
        onPress={onCancel}
      >
        <View style={styles.container}>
          <View style={styles.content}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.message}>{message}</Text>
            
            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.button, styles.buttonCancel]}
                onPress={onCancel}
              >
                <Text style={styles.buttonCancelText}>{cancelText}</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.button,
                  styles.buttonConfirm,
                  destructive && styles.buttonDestructive,
                ]}
                onPress={onConfirm}
              >
                <Text style={styles.buttonConfirmText}>{confirmText}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  container: {
    width: '100%',
    maxWidth: 400,
  },
  content: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    padding: Spacing.xl,
    ...Shadows.lg,
  },
  title: {
    fontSize: FontSizes.xl,
    fontWeight: '600',
    color: Colors.gray[900],
    marginBottom: Spacing.sm,
  },
  message: {
    fontSize: FontSizes.base,
    color: Colors.gray[500],
    marginBottom: Spacing.xl,
    lineHeight: 22,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.md,
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
    fontWeight: '500',
    color: Colors.gray[700],
  },
  buttonConfirm: {
    backgroundColor: Colors.green[600],
  },
  buttonDestructive: {
    backgroundColor: Colors.red[600],
  },
  buttonConfirmText: {
    fontSize: FontSizes.base,
    fontWeight: '600',
    color: Colors.white,
  },
});
