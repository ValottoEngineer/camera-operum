import React from 'react';
import { View, Text, TextInput, TextInputProps, ViewStyle } from 'react-native';
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
  ...props
}) => {
  return (
    <View style={[{ marginBottom: theme.spacing.md }, containerStyle]}>
      <Text
        style={{
          fontSize: theme.typography.sizes.sm,
          fontWeight: theme.typography.weights.medium,
          color: theme.colors.neutral.primary,
          marginBottom: theme.spacing.xs,
        }}
      >
        {label}
      </Text>
      <TextInput
        style={[
          {
            borderWidth: 1,
            borderColor: error ? theme.colors.error : theme.colors.neutral.border,
            borderRadius: theme.borderRadius.md,
            paddingHorizontal: theme.spacing.md,
            paddingVertical: theme.spacing.sm,
            fontSize: theme.typography.sizes.base,
            color: theme.colors.neutral.primary,
            backgroundColor: theme.colors.surface,
            minHeight: 48,
          },
          style,
        ]}
        placeholderTextColor={theme.colors.neutral.secondary}
        value={value || ''}
        {...props}
      />
      {error && (
        <Text
          style={{
            color: theme.colors.error,
            fontSize: theme.typography.sizes.xs,
            marginTop: theme.spacing.xs,
          }}
        >
          {error}
        </Text>
      )}
    </View>
  );
};
