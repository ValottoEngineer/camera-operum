import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from './Button';
import { theme } from '../../styles/theme';

export interface ErrorViewProps {
  title?: string;
  message: string;
  actionTitle?: string;
  onActionPress?: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  style?: ViewStyle;
  titleStyle?: TextStyle;
  messageStyle?: TextStyle;
}

export const ErrorView: React.FC<ErrorViewProps> = ({
  title = 'Ops! Algo deu errado',
  message,
  actionTitle = 'Tentar novamente',
  onActionPress,
  icon = 'alert-circle-outline',
  style,
  titleStyle,
  messageStyle,
}) => {
  const getContainerStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: theme.spacing.xl,
      paddingVertical: theme.spacing.xxl,
    };

    return { ...baseStyle, ...style };
  };

  const getTitleStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      ...theme.typography.h3,
      color: theme.colors.error,
      textAlign: 'center',
      marginTop: theme.spacing.lg,
      marginBottom: theme.spacing.sm,
    };

    return { ...baseStyle, ...titleStyle };
  };

  const getMessageStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      lineHeight: 24,
      marginBottom: theme.spacing.xl,
    };

    return { ...baseStyle, ...messageStyle };
  };

  return (
    <View style={getContainerStyle()}>
      <View style={styles.iconContainer}>
        <Ionicons
          name={icon}
          size={64}
          color={theme.colors.error}
        />
      </View>
      
      <Text style={getTitleStyle()}>{title}</Text>
      
      <Text style={getMessageStyle()}>{message}</Text>
      
      {onActionPress && (
        <Button
          title={actionTitle}
          onPress={onActionPress}
          variant="primary"
          size="medium"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: theme.colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: theme.colors.error,
    ...theme.shadows.sm,
  },
});
