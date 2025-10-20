import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';

import { Header } from '../components/Header';
import { Card } from '../components/Card';
import { TextField } from '../components/TextField';
import { PrimaryButton } from '../components/PrimaryButton';
import { SecondaryButton } from '../components/SecondaryButton';
import { ConfirmPasswordModal } from '../components/ConfirmPasswordModal';
import { IconButton } from '../components/IconButton';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/auth';
import { updateNameSchema, updatePasswordSchema, UpdateNameFormData, UpdatePasswordFormData } from '../validation/schemas';
import { theme } from '../styles/theme';
import { AppStackParamList } from '../navigation/AppStack';

type ProfileScreenNavigationProp = NativeStackNavigationProp<AppStackParamList, 'Profile'>;

interface Props {
  navigation: ProfileScreenNavigationProp;
}

export const ProfileScreen: React.FC<Props> = ({ navigation }) => {
  const { currentUser, updateUserProfile, updateUserPassword, deleteAccount, logout, isLoading } = useAuth();
  const [isUpdatingName, setIsUpdatingName] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const {
    control: nameControl,
    handleSubmit: handleNameSubmit,
    formState: { errors: nameErrors },
    reset: resetNameForm,
  } = useForm<UpdateNameFormData>({
    resolver: zodResolver(updateNameSchema),
    defaultValues: {
      name: currentUser?.name || '',
    },
  });

  const {
    control: passwordControl,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    reset: resetPasswordForm,
  } = useForm<UpdatePasswordFormData>({
    resolver: zodResolver(updatePasswordSchema),
  });

  const onUpdateName = async (data: UpdateNameFormData) => {
    setIsUpdatingName(true);
    try {
      const result = await updateUserProfile(data.name);
      
      if (result.success) {
        Toast.show({
          type: 'success',
          text1: 'Nome atualizado',
          text2: 'Seu nome foi alterado com sucesso!',
        });
        resetNameForm({ name: data.name });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Erro ao atualizar nome',
          text2: result.error || 'Tente novamente.',
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Erro ao atualizar nome',
        text2: 'Tente novamente mais tarde.',
      });
    } finally {
      setIsUpdatingName(false);
    }
  };

  const onUpdatePassword = async (data: UpdatePasswordFormData) => {
    setIsUpdatingPassword(true);
    try {
      const result = await updateUserPassword(data.currentPassword, data.newPassword);
      
      if (result.success) {
        Toast.show({
          type: 'success',
          text1: 'Senha atualizada',
          text2: 'Sua senha foi alterada com sucesso!',
        });
        resetPasswordForm();
        setShowPasswordForm(false);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Erro ao atualizar senha',
          text2: result.error || 'Tente novamente.',
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Erro ao atualizar senha',
        text2: 'Tente novamente mais tarde.',
      });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const onDeleteAccount = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async (password: string) => {
    try {
      const result = await deleteAccount(password);
      
      if (result.success) {
        Toast.show({
          type: 'success',
          text1: 'Conta excluída',
          text2: 'Sua conta foi excluída com sucesso.',
        });
        setShowDeleteModal(false);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Erro ao excluir conta',
          text2: result.error || 'Tente novamente.',
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Erro ao excluir conta',
        text2: 'Tente novamente mais tarde.',
      });
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Header
        title="Perfil"
        onBackPress={() => navigation.goBack()}
      />
      
      <ScrollView
        style={{ flex: 1, backgroundColor: theme.colors.background }}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >

        <View
          style={{
            flex: 1,
            paddingHorizontal: theme.spacing.lg,
            paddingTop: theme.spacing.lg,
            paddingBottom: theme.spacing.xl,
          }}
        >
          {/* Informações do usuário */}
          <Card style={{ marginBottom: theme.spacing.xl }}>
            <Text
              style={{
                fontSize: theme.typography.sizes.xl,
                fontWeight: theme.typography.weights.bold,
                color: theme.colors.neutral.primary,
                marginBottom: theme.spacing.lg,
              }}
            >
              Informações da Conta
            </Text>
            
            <View style={{ marginBottom: theme.spacing.lg }}>
              <Text
                style={{
                  fontSize: theme.typography.sizes.sm,
                  fontWeight: theme.typography.weights.medium,
                  color: theme.colors.neutral.secondary,
                  marginBottom: theme.spacing.sm,
                }}
              >
                Nome
              </Text>
              <Text
                style={{
                  fontSize: theme.typography.sizes.base,
                  color: theme.colors.neutral.primary,
                }}
              >
                {currentUser?.name}
              </Text>
            </View>

            <View>
              <Text
                style={{
                  fontSize: theme.typography.sizes.sm,
                  fontWeight: theme.typography.weights.medium,
                  color: theme.colors.neutral.secondary,
                  marginBottom: theme.spacing.sm,
                }}
              >
                Email
              </Text>
              <Text
                style={{
                  fontSize: theme.typography.sizes.base,
                  color: theme.colors.neutral.primary,
                }}
              >
                {currentUser?.email}
              </Text>
            </View>
          </Card>

          {/* Atualizar nome */}
          <Card style={{ marginBottom: theme.spacing.xl }}>
            <Text
              style={{
                fontSize: theme.typography.sizes.xl,
                fontWeight: theme.typography.weights.bold,
                color: theme.colors.neutral.primary,
                marginBottom: theme.spacing.lg,
              }}
            >
              Alterar Nome
            </Text>

            <Controller
              control={nameControl}
              name="name"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextField
                  label="Novo nome"
                  placeholder="Digite seu novo nome"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={nameErrors.name?.message}
                  autoCapitalize="words"
                  autoCorrect={false}
                  style={{ marginBottom: theme.spacing.lg }}
                />
              )}
            />

            <PrimaryButton
              title="Atualizar Nome"
              onPress={handleNameSubmit(onUpdateName)}
              loading={isUpdatingName}
            />
          </Card>

          {/* Atualizar senha */}
          <Card style={{ marginBottom: theme.spacing.xl }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: theme.spacing.lg,
              }}
            >
              <Text
                style={{
                  fontSize: theme.typography.sizes.xl,
                  fontWeight: theme.typography.weights.bold,
                  color: theme.colors.neutral.primary,
                }}
              >
                Alterar Senha
              </Text>
              <TouchableOpacity
                onPress={() => setShowPasswordForm(!showPasswordForm)}
                style={{
                  paddingHorizontal: theme.spacing.md,
                  paddingVertical: theme.spacing.sm,
                  borderRadius: theme.borderRadius.md,
                  backgroundColor: showPasswordForm ? theme.colors.neon.electric : theme.colors.neutral.border,
                }}
              >
                <Text
                  style={{
                    color: showPasswordForm ? theme.colors.surface : theme.colors.neutral.primary,
                    fontSize: theme.typography.sizes.sm,
                    fontWeight: theme.typography.weights.medium,
                  }}
                >
                  {showPasswordForm ? 'Cancelar' : 'Alterar'}
                </Text>
              </TouchableOpacity>
            </View>

            {showPasswordForm && (
              <>
                <Controller
                  control={passwordControl}
                  name="currentPassword"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextField
                      label="Senha atual"
                      placeholder="Digite sua senha atual"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      error={passwordErrors.currentPassword?.message}
                      secureTextEntry
                      style={{ marginBottom: theme.spacing.lg }}
                    />
                  )}
                />

                <Controller
                  control={passwordControl}
                  name="newPassword"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextField
                      label="Nova senha"
                      placeholder="Digite sua nova senha"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      error={passwordErrors.newPassword?.message}
                      secureTextEntry
                      style={{ marginBottom: theme.spacing.lg }}
                    />
                  )}
                />

                <Controller
                  control={passwordControl}
                  name="confirmNewPassword"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextField
                      label="Confirmar nova senha"
                      placeholder="Confirme sua nova senha"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      error={passwordErrors.confirmNewPassword?.message}
                      secureTextEntry
                      style={{ marginBottom: theme.spacing.lg }}
                    />
                  )}
                />

                <PrimaryButton
                  title="Atualizar Senha"
                  onPress={handlePasswordSubmit(onUpdatePassword)}
                  loading={isUpdatingPassword}
                />
              </>
            )}
          </Card>

          {/* Ações perigosas */}
          <Card style={{ marginBottom: theme.spacing.xl }}>
            <Text
              style={{
                fontSize: theme.typography.sizes.xl,
                fontWeight: theme.typography.weights.bold,
                color: theme.colors.error,
                marginBottom: theme.spacing.lg,
              }}
            >
              Zona de Perigo
            </Text>

            <SecondaryButton
              title="Excluir Conta"
              onPress={onDeleteAccount}
              style={{
                borderColor: theme.colors.error,
                marginBottom: theme.spacing.xl,
              }}
            />

            <SecondaryButton
              title="Sair da Conta"
              onPress={handleLogout}
            />
          </Card>

          {/* Botão voltar */}
          <SecondaryButton
            title="Voltar ao Dashboard"
            onPress={() => navigation.goBack()}
            style={{ marginBottom: theme.spacing.xl }}
          />
        </View>
      </ScrollView>

      <ConfirmPasswordModal
        visible={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        loading={isLoading}
        title="Excluir Conta"
        message="Digite sua senha atual para confirmar a exclusão da conta. Esta ação é irreversível."
      />
    </KeyboardAvoidingView>
  );
};
