// ══════════════════════════════════════════════════════════
// SEARCH BAR - Barra de busca com ícone
// ══════════════════════════════════════════════════════════

import React from 'react';
import { View, TextInput, StyleSheet, Text } from 'react-native';
import { Colors, Spacing, BorderRadius, FontSizes } from '../config/theme';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = 'Buscar...',
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>🔍</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.gray[300]}
        autoCapitalize="none"
        autoCorrect={false}
      />
      {value.length > 0 && (
        <Text style={styles.clearIcon} onPress={() => onChangeText('')}>
          ✕
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray[50],
    borderWidth: 1,
    borderColor: Colors.gray[100],
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginBottom: Spacing.md,
  },
  icon: {
    fontSize: FontSizes.lg,
    marginRight: Spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: FontSizes.base,
    color: Colors.gray[900],
    padding: 0,
  },
  clearIcon: {
    fontSize: FontSizes.lg,
    color: Colors.gray[300],
    marginLeft: Spacing.sm,
  },
});
