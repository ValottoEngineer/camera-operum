import React from 'react';
import { TouchableOpacity, ViewStyle, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../styles/theme';

interface IconButtonProps {
  iconName: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  size?: 'small' | 'medium' | 'large';
  color?: string;
  disabled?: boolean;
  style?: ViewStyle;
}

const iconSizes = {
  small: 20,
  medium: 24,
  large: 32,
};

export const IconButton: React.FC<IconButtonProps> = ({
  iconName,
  onPress,
  size = 'medium',
  color = theme.colors.neon.ion,
  disabled = false,
  style,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        { width: 44, height: 44 },
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
      accessibilityRole="button"
    >
      <Ionicons
        name={iconName}
        size={iconSizes[size]}
        color={disabled ? theme.colors.neutral.secondary : color}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
    backgroundColor: 'transparent',
  },
  disabled: {
    opacity: 0.5,
  },
});
