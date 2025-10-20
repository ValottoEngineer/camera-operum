import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { theme } from '../styles/theme';

interface SecondaryButtonProps {
  onPress: () => void;
  title: string;
  disabled?: boolean;
  loading?: boolean;
}

export const SecondaryButton: React.FC<SecondaryButtonProps> = ({
  onPress,
  title,
  disabled = false,
  loading = false,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={{
        height: 50,
        borderRadius: 12,
        backgroundColor: theme.colors.neon.purple,
        justifyContent: 'center',
        alignItems: 'center',
        opacity: disabled ? 0.5 : 1,
      }}
    >
      {loading ? (
        <ActivityIndicator color="#FFFFFF" />
      ) : (
        <Text style={{
          color: '#FFFFFF',
          fontSize: 16,
          fontWeight: '600',
        }}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

