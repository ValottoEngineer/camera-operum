import React, { useState } from 'react';
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { theme } from '../../styles/theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
  errorStyle?: TextStyle;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  containerStyle,
  inputStyle,
  labelStyle,
  errorStyle,
  secureTextEntry,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isSecure, setIsSecure] = useState(secureTextEntry);

  const inputContainerStyle = [
    styles.inputContainer,
    isFocused && styles.focused,
    error && styles.error,
    containerStyle,
  ];

  const inputStyleCombined = [
    styles.input,
    inputStyle,
  ];

  const labelStyleCombined = [
    styles.label,
    labelStyle,
  ];

  const errorStyleCombined = [
    styles.errorText,
    errorStyle,
  ];

  return (
    <View style={styles.container}>
      {label && <Text style={labelStyleCombined}>{label}</Text>}
      <View style={inputContainerStyle}>
        <TextInput
          style={inputStyleCombined}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={isSecure}
          placeholderTextColor={theme.colors.textSecondary}
          {...props}
        />
      </View>
      {error && <Text style={errorStyleCombined}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
  },
  label: {
    ...theme.typography.body,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
    fontWeight: '600',
  },
  inputContainer: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    minHeight: 48,
  },
  focused: {
    borderColor: theme.colors.primary,
    borderWidth: 2,
  },
  error: {
    borderColor: theme.colors.error,
    borderWidth: 2,
  },
  input: {
    ...theme.typography.body,
    color: theme.colors.textPrimary,
    flex: 1,
  },
  errorText: {
    ...theme.typography.caption,
    color: theme.colors.error,
    marginTop: theme.spacing.xs,
  },
});
