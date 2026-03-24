// ══════════════════════════════════════════════════════════
// HORIZONTAL PICKER - Seletor horizontal de itens
// ══════════════════════════════════════════════════════════

import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, Spacing, BorderRadius, FontSizes } from '../config/theme';

interface PickerItem {
  id: string;
  label: string;
}

interface HorizontalPickerProps {
  items: PickerItem[];
  selectedId: string;
  onSelect: (id: string) => void;
  label?: string;
}

export const HorizontalPicker: React.FC<HorizontalPickerProps> = ({
  items,
  selectedId,
  onSelect,
  label,
}) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {items.map((item) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => onSelect(item.id)}
            style={[
              styles.item,
              selectedId === item.id && styles.itemSelected,
            ]}
          >
            <Text
              style={[
                styles.itemText,
                selectedId === item.id && styles.itemTextSelected,
              ]}
              numberOfLines={2}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: FontSizes.sm,
    fontWeight: '500',
    color: Colors.gray[700],
    marginBottom: Spacing.sm,
  },
  scrollContent: {
    gap: Spacing.sm,
    paddingRight: Spacing.md,
  },
  item: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderWidth: 1.5,
    borderColor: Colors.gray[100],
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.white,
    minWidth: 100,
    maxWidth: 160,
  },
  itemSelected: {
    borderColor: Colors.green[600],
    backgroundColor: Colors.green[50],
  },
  itemText: {
    fontSize: FontSizes.sm,
    color: Colors.gray[700],
    textAlign: 'center',
  },
  itemTextSelected: {
    color: Colors.green[700],
    fontWeight: '600',
  },
});
