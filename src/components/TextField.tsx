import React, { useState } from 'react';
import { View, Text, TextInput, TextInputProps, ViewStyle, StyleSheet } from 'react-native';
import { theme } from '../styles/theme';

interface TextFieldProps extends TextInputProps {
  label: string;
  error?: string;
  containerStyle?: ViewStyle;
}

export const TextField: React.FC<TextFieldProps> = ({
  label,
  error,
  containerStyle,
  style,
  value,
  onFocus,
  onBlur,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = (e: any) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          isFocused && styles.inputFocused,
          error && styles.inputError,
          style,
        ]}
        placeholderTextColor={theme.colors.neutral.secondary}
        value={value || ''}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...props}
      />
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.lg,
  },
  label: {
    ...theme.typography.bodySmall,
    color: theme.colors.neutral.primary,
    marginBottom: theme.spacing.sm,
    fontWeight: theme.typography.weights.medium,
  },
  input: {
    height: 52,
    ...theme.glassmorphism.light,
    borderRadius: 12,
    paddingHorizontal: theme.spacing.lg,
    fontSize: theme.typography.sizes.base,
    color: theme.colors.neutral.primary,
  },
  inputFocused: {
    borderColor: theme.colors.neon.electric,
    borderWidth: 2,
  },
  inputError: {
    borderColor: theme.colors.error,
    borderWidth: 2,
  },
  errorText: {
    ...theme.typography.caption,
    color: theme.colors.error,
    marginTop: theme.spacing.xs,
  },
});
