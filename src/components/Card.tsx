import React from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';
import { theme } from '../styles/theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: keyof typeof theme.spacing;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  variant = 'default',
  padding = 'lg',
}) => {
  return (
    <View
      style={[
        styles.container,
        styles[variant],
        { padding: theme.spacing[padding] },
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
  },
  default: {
    ...theme.glassmorphism.light,
    ...theme.shadows.sm,
  },
  elevated: {
    ...theme.glassmorphism.light,
    ...theme.shadows.lg,
  },
  outlined: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.neutral.border,
    ...theme.shadows.sm,
  },
});
