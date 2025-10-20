import React from 'react';
import { TextInput, View, Text, ViewStyle } from 'react-native';
import { theme } from '../styles/theme';

interface TextFieldProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  secureTextEntry?: boolean;
  style?: ViewStyle;
  editable?: boolean;
  onSubmitEditing?: () => void;
}

export const TextField: React.FC<TextFieldProps> = ({
  value,
  onChangeText,
  placeholder,
  label,
  error,
  secureTextEntry,
  style,
  editable = true,
  onSubmitEditing,
}) => {
  return (
    <View style={style}>
      {label && (
        <Text style={{
          fontSize: 14,
          fontWeight: '500',
          color: theme.colors.neutral.primary,
          marginBottom: 8,
        }}>
          {label}
        </Text>
      )}
      
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.neutral.secondary}
        secureTextEntry={secureTextEntry}
        editable={editable}
        onSubmitEditing={onSubmitEditing}
        style={{
          height: 50,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderRadius: 12,
          borderWidth: 1,
          borderColor: error ? theme.colors.error : theme.colors.neutral.card,
          paddingHorizontal: 16,
          fontSize: 16,
          color: theme.colors.neutral.primary,
        }}
      />
      
      {error && (
        <Text style={{
          fontSize: 12,
          color: theme.colors.error,
          marginTop: 4,
        }}>
          {error}
        </Text>
      )}
    </View>
  );
};

