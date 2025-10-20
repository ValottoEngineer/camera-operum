import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, ViewStyle, StyleSheet } from 'react-native';
import { theme } from '../styles/theme';

interface SecondaryButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

export const SecondaryButton: React.FC<SecondaryButtonProps> = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  style,
}) => {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[styles.container, isDisabled && styles.disabled, style]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
      accessibilityLabel={title}
      accessibilityRole="button"
    >
      {loading ? (
        <ActivityIndicator color={theme.colors.surface} size="small" />
      ) : (
        <Text style={[styles.text, isDisabled && styles.disabledText]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 52,
    backgroundColor: theme.colors.neon.purple,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    ...theme.shadows.sm,
  },
  disabled: {
    backgroundColor: theme.colors.neutral.border,
    opacity: 0.6,
  },
  text: {
    ...theme.typography.button,
    color: theme.colors.surface,
  },
  disabledText: {
    color: theme.colors.neutral.secondary,
  },
});
