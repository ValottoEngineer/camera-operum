import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { theme } from '../styles/theme';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  debounceMs?: number;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = 'Buscar ações...',
  debounceMs = 300,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [query, onSearch, debounceMs]);

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.neutral.secondary}
          value={query}
          onChangeText={setQuery}
          autoCapitalize="characters"
          autoCorrect={false}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
            <Text style={styles.clearIcon}>✕</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.neutral.border,
    ...theme.shadows.sm,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: theme.spacing.sm,
    color: theme.colors.neutral.secondary,
  },
  input: {
    flex: 1,
    fontSize: theme.typography.sizes.base,
    color: theme.colors.neutral.primary,
    paddingVertical: theme.spacing.xs,
  },
  clearButton: {
    padding: theme.spacing.xs,
    marginLeft: theme.spacing.sm,
  },
  clearIcon: {
    fontSize: 16,
    color: theme.colors.neutral.secondary,
  },
});
