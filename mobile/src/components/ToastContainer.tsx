// ══════════════════════════════════════════════════════════
// TOAST CONTAINER - EXIBE NOTIFICAÇÕES
// ══════════════════════════════════════════════════════════

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Pressable } from 'react-native';
import { useToast, ToastType } from '../contexts/ToastContext';
import { Colors, BorderRadius, FontSizes } from '../config/theme';

export const ToastContainer: React.FC = () => {
  const { toasts, hideToast } = useToast();

  return (
    <View style={styles.container} pointerEvents="box-none">
      {toasts.map(toast => (
        <ToastItem
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onDismiss={() => hideToast(toast.id)}
        />
      ))}
    </View>
  );
};

interface ToastItemProps {
  message: string;
  type: ToastType;
  onDismiss: () => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ message, type, onDismiss }) => {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const translateY = React.useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return Colors.green[700];
      case 'error':
        return Colors.red[600];
      case 'warning':
        return Colors.amber[600];
      default:
        return Colors.gray[900];
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      default:
        return 'ℹ';
    }
  };

  return (
    <Animated.View
      style={[
        styles.toast,
        {
          backgroundColor: getBackgroundColor(),
          opacity: fadeAnim,
          transform: [{ translateY }],
        },
      ]}
    >
      <Pressable style={styles.toastContent} onPress={onDismiss}>
        <Text style={styles.icon}>{getIcon()}</Text>
        <Text style={styles.message} numberOfLines={2}>
          {message}
        </Text>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 9999,
    gap: 8,
  },
  toast: {
    maxWidth: '90%',
    minWidth: 200,
    borderRadius: BorderRadius.pill,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  toastContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  icon: {
    fontSize: 18,
    color: Colors.white,
  },
  message: {
    flex: 1,
    fontSize: FontSizes.base,
    color: Colors.white,
    fontWeight: '500',
  },
});
