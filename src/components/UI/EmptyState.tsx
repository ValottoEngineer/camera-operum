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

export interface EmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  message?: string;
  actionTitle?: string;
  onActionPress?: () => void;
  style?: ViewStyle;
  titleStyle?: TextStyle;
  messageStyle?: TextStyle;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'document-outline',
  title,
  message,
  actionTitle,
  onActionPress,
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
      color: theme.colors.textPrimary,
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
          color={theme.colors.textTertiary}
        />
      </View>
      
      <Text style={getTitleStyle()}>{title}</Text>
      
      {message && <Text style={getMessageStyle()}>{message}</Text>}
      
      {actionTitle && onActionPress && (
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
    ...theme.shadows.sm,
  },
});
