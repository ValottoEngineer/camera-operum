import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, ViewStyle } from 'react-native';
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
      style={[
        {
          backgroundColor: isDisabled ? theme.colors.neutral.secondary : theme.colors.neon.electric,
          borderRadius: theme.borderRadius.lg,
          paddingVertical: theme.spacing.md,
          paddingHorizontal: theme.spacing.lg,
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 48,
          ...theme.shadows.sm,
        },
        style,
      ]}
      onPress={onPress}
      disabled={isDisabled}
      accessibilityLabel={title}
      accessibilityRole="button"
    >
      {loading ? (
        <ActivityIndicator color={theme.colors.surface} size="small" />
      ) : (
        <Text
          style={{
            color: theme.colors.surface,
            fontSize: theme.typography.sizes.base,
            fontWeight: theme.typography.weights.semibold,
          }}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};
