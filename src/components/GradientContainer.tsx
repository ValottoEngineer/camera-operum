import React from 'react';
import { View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme, gradientBackground } from '../styles/theme';

interface GradientContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
  gradient?: 'primary' | 'secondary' | 'neutral';
  height?: number;
}

export const GradientContainer: React.FC<GradientContainerProps> = ({
  children,
  style,
  gradient = 'primary',
  height = 200,
}) => {
  const gradientColors = gradientBackground[gradient];

  return (
    <View style={[{ height }, style]}>
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {children}
      </LinearGradient>
    </View>
  );
};
