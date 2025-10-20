import React from 'react';
import { View, ViewStyle } from 'react-native';
import { theme } from '../styles/theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: keyof typeof theme.spacing;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  padding = 'lg',
}) => {
  return (
    <View
      style={[
        {
          backgroundColor: theme.colors.neutral.card,
          borderRadius: theme.borderRadius.xl,
          borderWidth: 1,
          borderColor: theme.colors.neutral.secondary,
          padding: theme.spacing[padding],
          ...theme.shadows.md,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};
