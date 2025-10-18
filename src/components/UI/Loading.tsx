import React from 'react';
import {
  View,
  ActivityIndicator,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '@/styles/theme';

export interface LoadingProps {
  variant?: 'fullscreen' | 'inline' | 'overlay';
  message?: string;
  size?: 'small' | 'large';
  color?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Loading: React.FC<LoadingProps> = ({
  variant = 'inline',
  message = 'Carregando...',
  size = 'large',
  color = theme.colors.primary,
  style,
  textStyle,
}) => {
  const getContainerStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      alignItems: 'center',
      justifyContent: 'center',
    };

    const variantStyles: { [key: string]: ViewStyle } = {
      fullscreen: {
        flex: 1,
        backgroundColor: theme.colors.background,
      },
      inline: {
        padding: theme.spacing.lg,
      },
      overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 1000,
      },
    };

    return {
      ...baseStyle,
      ...variantStyles[variant],
      ...style,
    };
  };

  const getTextStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.md,
      textAlign: 'center',
    };

    return { ...baseStyle, ...textStyle };
  };

  const renderSpinner = () => {
    if (variant === 'fullscreen') {
      return (
        <LinearGradient
          colors={theme.colors.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientSpinner}
        >
          <ActivityIndicator
            size={size}
            color={theme.colors.white}
          />
        </LinearGradient>
      );
    }

    return (
      <ActivityIndicator
        size={size}
        color={color}
      />
    );
  };

  return (
    <View style={getContainerStyle()}>
      {renderSpinner()}
      {message && <Text style={getTextStyle()}>{message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  gradientSpinner: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.lg,
  },
});
