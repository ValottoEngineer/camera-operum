import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../styles/theme';

export const AIBadge: React.FC = () => {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.neon.purple,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
      }}
    >
      <Ionicons name="flash" size={12} color="white" />
      <Text
        style={{
          fontSize: 10,
          color: 'white',
          fontWeight: '600',
          marginLeft: 4,
        }}
      >
        IA
      </Text>
    </View>
  );
};
