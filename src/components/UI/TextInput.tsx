import React, { useState } from 'react';
import {
  View,
  TextInput as RNTextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TextInputProps as RNTextInputProps,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../styles/theme';

export interface TextInputProps extends RNTextInputProps {
  label?: string;
  error?: string;
  success?: boolean;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
}

export const TextInput: React.FC<TextInputProps> = ({
  label,
  error,
  success,
  leftIcon,
  rightIcon,
  onRightIconPress,
  containerStyle,
  inputStyle,
  labelStyle,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const getContainerStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      marginBottom: theme.spacing.md,
    };

    return { ...baseStyle, ...containerStyle };
  };

  const getInputContainerStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.card,
      borderRadius: theme.radius.md,
      borderWidth: 2,
      paddingHorizontal: theme.spacing.md,
      minHeight: 48,
    };

    let borderColor = theme.colors.border;
    if (isFocused) {
      borderColor = theme.colors.primary;
    } else if (error) {
      borderColor = theme.colors.error;
    } else if (success) {
      borderColor = theme.colors.success;
    }

    return {
      ...baseStyle,
      borderColor,
    };
  };

  const getInputStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      ...theme.typography.body,
      flex: 1,
      color: theme.colors.textPrimary,
      paddingVertical: theme.spacing.sm,
    };

    return { ...baseStyle, ...inputStyle };
  };

  const getLabelStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      ...theme.typography.bodySmall,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.xs,
    };

    return { ...baseStyle, ...labelStyle };
  };

  const getErrorStyle = (): TextStyle => {
    return {
      ...theme.typography.caption,
      color: theme.colors.error,
      marginTop: theme.spacing.xs,
    };
  };

  return (
    <View style={getContainerStyle()}>
      {label && <Text style={getLabelStyle()}>{label}</Text>}
      
      <View style={getInputContainerStyle()}>
        {leftIcon && (
          <Ionicons
            name={leftIcon}
            size={20}
            color={isFocused ? theme.colors.primary : theme.colors.textTertiary}
            style={{ marginRight: theme.spacing.sm }}
          />
        )}
        
        <RNTextInput
          style={getInputStyle()}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholderTextColor={theme.colors.textTertiary}
          {...props}
        />
        
        {rightIcon && (
          <TouchableOpacity
            onPress={onRightIconPress}
            style={{ marginLeft: theme.spacing.sm }}
            disabled={!onRightIconPress}
          >
            <Ionicons
              name={rightIcon}
              size={20}
              color={isFocused ? theme.colors.primary : theme.colors.textTertiary}
            />
          </TouchableOpacity>
        )}
      </View>
      
      {error && <Text style={getErrorStyle()}>{error}</Text>}
    </View>
  );
};
