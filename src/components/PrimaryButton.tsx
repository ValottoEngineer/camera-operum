import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, ViewStyle, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../styles/theme';

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
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
      <LinearGradient
        colors={isDisabled ? [theme.colors.neutral.border, theme.colors.neutral.border] : theme.gradients.primary}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradient}
      >
        {loading ? (
          <ActivityIndicator color={theme.colors.surface} size="small" />
        ) : (
          <Text style={[styles.text, isDisabled && styles.disabledText]}>{title}</Text>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 52,
    borderRadius: 16,
    overflow: 'hidden',
    ...theme.shadows.md,
  },
  gradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
  },
  disabled: {
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
