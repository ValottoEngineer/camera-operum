import React from 'react';
import { View, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { theme } from '../styles/theme';

interface GradientContainerProps {
  children: React.ReactNode;
  height?: number;
}

export const GradientContainer: React.FC<GradientContainerProps> = ({
  children,
  height = 200,
}) => {
  return (
    <LinearGradient
      colors={theme.gradients.primary}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={{ height }}
    >
      {Platform.OS === 'ios' && (
        <BlurView intensity={10} style={{ ...StyleSheet.absoluteFillObject }} />
      )}
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        {children}
      </View>
    </LinearGradient>
  );
};

