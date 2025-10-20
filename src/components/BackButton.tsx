import React from 'react';
import { TouchableOpacity, ViewStyle, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../styles/theme';

interface BackButtonProps {
  onPress: () => void;
  color?: string;
  disabled?: boolean;
  style?: ViewStyle;
}

export const BackButton: React.FC<BackButtonProps> = ({
  onPress,
  color = theme.colors.neon.electric,
  disabled = false,
  style,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
      accessibilityLabel="Voltar"
      accessibilityRole="button"
    >
      <Ionicons
        name="arrow-back"
        size={24}
        color={disabled ? theme.colors.neutral.secondary : color}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  disabled: {
    opacity: 0.5,
  },
});
