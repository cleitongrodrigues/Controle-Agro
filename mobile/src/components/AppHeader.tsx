// ══════════════════════════════════════════════════════════
// HEADER COMPONENT
// ══════════════════════════════════════════════════════════

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Spacing, FontSizes } from '../config/theme';
import { SyncBadge } from './SyncBadge';
import { useApp } from '../contexts/AppContext';

interface AppHeaderProps {
  title: string;
  subtitle: string;
  initials?: string;
  onSyncPress?: () => void;
  syncing?: boolean;
  onBack?: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  subtitle,
  initials = 'JS',
  onSyncPress,
  syncing = false,
  onBack,
}) => {
  const { unsyncedCount } = useApp();

  return (
    <View style={styles.header}>
      <View style={styles.decorCircle1} />
      <View style={styles.decorCircle2} />
      
      <View style={styles.headerRow}>
        <View style={styles.leftContent}>
          {onBack && (
            <TouchableOpacity onPress={onBack} style={styles.backButton}>
              <Text style={styles.backIcon}>‹</Text>
            </TouchableOpacity>
          )}
          <View>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
          </View>
        </View>
        <View style={styles.rightContent}>
          <SyncBadge 
            count={unsyncedCount} 
            onPress={onSyncPress}
            syncing={syncing}
          />
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.green[800],
    paddingTop: 52,
    paddingBottom: 18,
    paddingHorizontal: Spacing.xl,
    position: 'relative',
    overflow: 'hidden',
  },
  decorCircle1: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  decorCircle2: {
    position: 'absolute',
    bottom: -20,
    left: 40,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 1,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  backButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  backIcon: {
    fontSize: 32,
    color: Colors.green[50],
    fontWeight: '300',
  },
  title: {
    fontSize: FontSizes.xxl,
    fontWeight: '600',
    color: Colors.green[50],
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: FontSizes.sm,
    color: Colors.green[200],
    marginTop: 2,
  },
  rightContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.green[700],
    borderWidth: 2,
    borderColor: Colors.green[600],
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.green[100],
  },
});
