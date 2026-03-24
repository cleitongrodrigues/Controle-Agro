// ══════════════════════════════════════════════════════════
// ESTILOS GLOBAIS COMPARTILHADOS
// ══════════════════════════════════════════════════════════

import { StyleSheet } from 'react-native';
import { Colors, Spacing, BorderRadius, FontSizes, Shadows } from '../config/theme';

export const globalStyles = StyleSheet.create({
  // Container padrão
  container: {
    flex: 1,
    backgroundColor: Colors.gray[50],
  },

  // Seções
  section: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
  },

  sectionTitle: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: Colors.gray[500],
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: Spacing.md,
  },

  // Cards
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.gray[100],
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },

  cardLabel: {
    fontSize: FontSizes.sm,
    color: Colors.gray[500],
    fontWeight: '500',
    letterSpacing: 0.4,
    marginBottom: 10,
  },

  // Badges
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.pill,
    fontSize: FontSizes.xs,
    fontWeight: '500',
  },

  badgeGreen: {
    backgroundColor: Colors.green[50],
    color: Colors.green[700],
  },

  badgeAmber: {
    backgroundColor: Colors.amber[100],
    color: Colors.amber[800],
  },

  badgeRed: {
    backgroundColor: Colors.red[100],
    color: Colors.red[600],
  },

  // Botões
  btnPrimary: {
    backgroundColor: Colors.green[800],
    paddingVertical: 14,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  btnPrimaryText: {
    color: Colors.green[50],
    fontSize: FontSizes.md,
    fontWeight: '600',
  },

  btnSecondary: {
    backgroundColor: Colors.gray[100],
    paddingVertical: 14,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  btnSecondaryText: {
    color: Colors.gray[700],
    fontSize: FontSizes.md,
    fontWeight: '600',
  },

  // Form
  formGroup: {
    marginBottom: 14,
  },

  formLabel: {
    fontSize: FontSizes.base,
    color: Colors.gray[500],
    fontWeight: '500',
    marginBottom: 6,
  },

  input: {
    width: '100%',
    paddingVertical: 11,
    paddingHorizontal: 14,
    fontSize: FontSizes.md,
    borderWidth: 1.5,
    borderColor: Colors.gray[100],
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.gray[50],
    color: Colors.gray[900],
  },

  inputFocused: {
    borderColor: Colors.green[500],
    backgroundColor: Colors.white,
  },

  // Separadores
  divider: {
    height: 1,
    backgroundColor: Colors.gray[100],
  },
});
