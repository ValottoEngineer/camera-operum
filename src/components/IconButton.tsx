import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface IconButtonProps {
  iconName: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  color?: string;
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
}

export const IconButton: React.FC<IconButtonProps> = ({
  iconName,
  onPress,
  color = '#6402FF',
  size = 'medium',
  disabled = false,
}) => {
  const sizeMap = {
    small: 20,
    medium: 24,
    large: 28,
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.6}
      style={{
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <Ionicons name={iconName} size={sizeMap[size]} color={color} />
    </TouchableOpacity>
  );
};

