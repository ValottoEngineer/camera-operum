import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { theme } from '../../styles/theme';

interface PickerOption {
  label: string;
  value: string;
}

interface PickerProps {
  label?: string;
  selectedValue: string;
  onValueChange: (value: string) => void;
  options: PickerOption[];
  placeholder?: string;
  error?: string;
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
  errorStyle?: TextStyle;
  disabled?: boolean;
}

export const CustomPicker: React.FC<PickerProps> = ({
  label,
  selectedValue,
  onValueChange,
  options,
  placeholder = 'Selecione uma opção',
  error,
  containerStyle,
  labelStyle,
  errorStyle,
  disabled = false,
}) => {
  const labelStyleCombined = [
    styles.label,
    labelStyle,
  ];

  const errorStyleCombined = [
    styles.errorText,
    errorStyle,
  ];

  const pickerContainerStyle = [
    styles.pickerContainer,
    error && styles.error,
    disabled && styles.disabled,
    containerStyle,
  ];

  return (
    <View style={styles.container}>
      {label && <Text style={labelStyleCombined}>{label}</Text>}
      <View style={pickerContainerStyle}>
        <Picker
          selectedValue={selectedValue}
          onValueChange={onValueChange}
          enabled={!disabled}
          style={styles.picker}
          itemStyle={styles.pickerItem}
        >
          <Picker.Item
            label={placeholder}
            value=""
            color={theme.colors.textSecondary}
          />
          {options.map((option) => (
            <Picker.Item
              key={option.value}
              label={option.label}
              value={option.value}
              color={theme.colors.textPrimary}
            />
          ))}
        </Picker>
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
  pickerContainer: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: 'hidden',
  },
  error: {
    borderColor: theme.colors.error,
    borderWidth: 2,
  },
  disabled: {
    backgroundColor: theme.colors.background,
    opacity: 0.6,
  },
  picker: {
    height: 48,
  },
  pickerItem: {
    ...theme.typography.body,
    color: theme.colors.textPrimary,
  },
  errorText: {
    ...theme.typography.caption,
    color: theme.colors.error,
    marginTop: theme.spacing.xs,
  },
});
