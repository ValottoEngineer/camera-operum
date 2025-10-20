import React from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../styles/theme';

interface GradientContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
  gradient?: 'primary' | 'secondary' | 'tertiary';
  height?: number;
}

export const GradientContainer: React.FC<GradientContainerProps> = ({
  children,
  style,
  gradient = 'primary',
  height = 200,
}) => {
  return (
    <View style={[{ height }, style]}>
      <LinearGradient
        colors={theme.gradients[gradient]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradient}
      >
        {children}
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing['2xl'],
  },
});
