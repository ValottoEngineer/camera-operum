import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, ViewStyle } from 'react-native';
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
      style={[
        {
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderColor: isDisabled ? theme.colors.neutral.secondary : theme.colors.neon.purple,
          borderRadius: theme.borderRadius.lg,
          paddingVertical: theme.spacing.md,
          paddingHorizontal: theme.spacing.lg,
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 48,
        },
        style,
      ]}
      onPress={onPress}
      disabled={isDisabled}
      accessibilityLabel={title}
      accessibilityRole="button"
    >
      {loading ? (
        <ActivityIndicator 
          color={isDisabled ? theme.colors.neutral.secondary : theme.colors.neon.purple} 
          size="small" 
        />
      ) : (
        <Text
          style={{
            color: isDisabled ? theme.colors.neutral.secondary : theme.colors.neon.purple,
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
