import React from 'react';
import { View, TouchableOpacity, ViewStyle } from 'react-native';
import { theme } from '../styles/theme';

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  variant?: 'default' | 'elevated' | 'outlined';
}

export const Card: React.FC<CardProps> = ({
  children,
  onPress,
  style,
  variant = 'default',
}) => {
  const cardStyles: ViewStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.colors.neutral.card,
    ...theme.shadows.card,
  };

  if (variant === 'elevated') {
    cardStyles.backgroundColor = '#FFFFFF';
    cardStyles.shadowOpacity = 0.12;
  }

  if (variant === 'outlined') {
    cardStyles.backgroundColor = 'transparent';
    cardStyles.shadowOpacity = 0;
  }

  const Component = onPress ? TouchableOpacity : View;

  return (
    <Component
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      style={[cardStyles, style]}
    >
      {children}
    </Component>
  );
};

