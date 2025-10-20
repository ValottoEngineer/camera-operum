import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { TextField } from './TextField';
import { PrimaryButton } from './PrimaryButton';
import { SecondaryButton } from './SecondaryButton';
import { theme } from '../styles/theme';

interface ConfirmPasswordModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (password: string) => void;
  loading?: boolean;
  title?: string;
  message?: string;
}

export const ConfirmPasswordModal: React.FC<ConfirmPasswordModalProps> = ({
  visible,
  onClose,
  onConfirm,
  loading = false,
  title = 'Confirmar Ação',
  message = 'Digite sua senha atual para confirmar:',
}) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleConfirm = () => {
    if (!password.trim()) {
      setError('Senha é obrigatória');
      return;
    }

    setError('');
    onConfirm(password);
  };

  const handleClose = () => {
    setPassword('');
    setError('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'center',
          alignItems: 'center',
          padding: theme.spacing.lg,
        }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{
            backgroundColor: theme.colors.surface,
            borderRadius: theme.borderRadius.xl,
            padding: theme.spacing.xl,
            width: '100%',
            maxWidth: 400,
            ...theme.shadows.lg,
          }}
        >
          <Text
            style={{
              fontSize: theme.typography.sizes.xl,
              fontWeight: theme.typography.weights.bold,
              color: theme.colors.neutral.primary,
              textAlign: 'center',
              marginBottom: theme.spacing.sm,
            }}
          >
            {title}
          </Text>

          <Text
            style={{
              fontSize: theme.typography.sizes.base,
              color: theme.colors.neutral.secondary,
              textAlign: 'center',
              marginBottom: theme.spacing.lg,
            }}
          >
            {message}
          </Text>

          <TextField
            label="Senha atual"
            placeholder="Digite sua senha"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (error) setError('');
            }}
            error={error}
            secureTextEntry
            containerStyle={{ marginBottom: theme.spacing.lg }}
          />

          <View
            style={{
              flexDirection: 'row',
              gap: theme.spacing.md,
            }}
          >
            <SecondaryButton
              title="Cancelar"
              onPress={handleClose}
              style={{ flex: 1 }}
              disabled={loading}
            />

            <PrimaryButton
              title="Confirmar"
              onPress={handleConfirm}
              loading={loading}
              style={{ flex: 1 }}
            />
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};
