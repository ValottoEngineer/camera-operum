import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { GradientHeader } from '../../components/Layout/GradientHeader';
import { Button } from '../../components/UI/Button';
import { Input } from '../../components/UI/Input';
import { CustomPicker } from '../../components/UI/Picker';
import { Loading } from '../../components/UI/Loading';
import { theme } from '../../styles/theme';
import { Cliente, ClienteFormData, AppStackParamList, PERFIL_RISCO_OPTIONS, LIQUIDEZ_OPTIONS } from '../../types';
import { createCliente, updateCliente } from '../../services/db';
import { getErrorMessage, getSuccessMessage } from '../../utils/errorMessages';

type ClienteFormScreenNavigationProp = StackNavigationProp<AppStackParamList, 'ClienteForm'>;
type ClienteFormScreenRouteProp = RouteProp<AppStackParamList, 'ClienteForm'>;

// Schema de validação
const clienteSchema = z.object({
  nome: z
    .string()
    .min(1, 'Nome é obrigatório')
    .min(2, 'Nome deve ter pelo menos 2 caracteres'),
  perfilRisco: z.enum(['conservador', 'moderado', 'agressivo'], {
    required_error: 'Perfil de risco é obrigatório',
  }),
  liquidez: z.enum(['baixa', 'média', 'alta'], {
    required_error: 'Liquidez é obrigatória',
  }),
  objetivos: z
    .string()
    .optional()
    .transform((val) => val || ''),
});

type ClienteFormType = z.infer<typeof clienteSchema>;

interface ClienteFormScreenProps {
  userId: string;
}

export const ClienteFormScreen: React.FC<ClienteFormScreenProps> = ({ userId }) => {
  const navigation = useNavigation<ClienteFormScreenNavigationProp>();
  const route = useRoute<ClienteFormScreenRouteProp>();
  const { cliente } = route.params || {};

  const [isLoading, setIsLoading] = useState(false);
  const isEditing = !!cliente;

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<ClienteFormType>({
    resolver: zodResolver(clienteSchema),
    defaultValues: {
      nome: cliente?.nome || '',
      perfilRisco: cliente?.perfilRisco || '',
      liquidez: cliente?.liquidez || '',
      objetivos: cliente?.objetivos || '',
    },
    mode: 'onChange',
  });

  useEffect(() => {
    if (cliente) {
      reset({
        nome: cliente.nome,
        perfilRisco: cliente.perfilRisco,
        liquidez: cliente.liquidez,
        objetivos: cliente.objetivos,
      });
    }
  }, [cliente, reset]);

  const handleSave = async (data: ClienteFormType) => {
    try {
      setIsLoading(true);

      const clienteData: ClienteFormData = {
        nome: data.nome.trim(),
        perfilRisco: data.perfilRisco,
        liquidez: data.liquidez,
        objetivos: data.objetivos.trim(),
      };

      if (isEditing && cliente) {
        await updateCliente(userId, cliente.id, clienteData);
        Alert.alert('Sucesso!', getSuccessMessage('cliente-updated'));
      } else {
        await createCliente(userId, clienteData);
        Alert.alert('Sucesso!', getSuccessMessage('cliente-created'));
      }

      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Erro', getErrorMessage(error.message));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (isValid) {
      Alert.alert(
        'Cancelar',
        'Tem certeza que deseja cancelar? As alterações serão perdidas.',
        [
          { text: 'Continuar editando', style: 'cancel' },
          { text: 'Cancelar', style: 'destructive', onPress: () => navigation.goBack() },
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <GradientHeader
        title={isEditing ? 'Editar Cliente' : 'Novo Cliente'}
        onBackPress={handleCancel}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.form}>
            {/* Nome */}
            <Controller
              control={control}
              name="nome"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Nome Completo *"
                  placeholder="Digite o nome completo do cliente"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.nome?.message}
                  autoCapitalize="words"
                  autoCorrect={false}
                />
              )}
            />

            {/* Perfil de Risco */}
            <Controller
              control={control}
              name="perfilRisco"
              render={({ field: { onChange, value } }) => (
                <CustomPicker
                  label="Perfil de Risco *"
                  selectedValue={value}
                  onValueChange={onChange}
                  options={PERFIL_RISCO_OPTIONS}
                  placeholder="Selecione o perfil de risco"
                  error={errors.perfilRisco?.message}
                />
              )}
            />

            {/* Liquidez */}
            <Controller
              control={control}
              name="liquidez"
              render={({ field: { onChange, value } }) => (
                <CustomPicker
                  label="Liquidez *"
                  selectedValue={value}
                  onValueChange={onChange}
                  options={LIQUIDEZ_OPTIONS}
                  placeholder="Selecione a liquidez"
                  error={errors.liquidez?.message}
                />
              )}
            />

            {/* Objetivos */}
            <Controller
              control={control}
              name="objetivos"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Objetivos de Investimento"
                  placeholder="Descreva os objetivos do cliente (opcional)"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.objetivos?.message}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  style={styles.multilineInput}
                />
              )}
            />

            {/* Info sobre LGPD */}
            <View style={styles.lgpdInfo}>
              <Text style={styles.lgpdText}>
                ℹ️ Os dados são armazenados de forma segura e utilizados apenas para 
                recomendações de investimento, em conformidade com a LGPD.
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Bottom Buttons */}
        <View style={styles.bottomButtons}>
          <Button
            title="Cancelar"
            onPress={handleCancel}
            variant="outline"
            style={styles.cancelButton}
          />
          <Button
            title={isEditing ? 'Atualizar' : 'Salvar'}
            onPress={handleSubmit(handleSave)}
            loading={isLoading}
            disabled={!isValid || isLoading}
            style={styles.saveButton}
          />
        </View>
      </KeyboardAvoidingView>

      <Loading visible={isLoading} message="Salvando..." />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing.lg,
  },
  form: {
    flex: 1,
  },
  multilineInput: {
    minHeight: 100,
  },
  lgpdInfo: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    marginTop: theme.spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.info,
  },
  lgpdText: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    lineHeight: 18,
  },
  bottomButtons: {
    flexDirection: 'row',
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
    backgroundColor: theme.colors.white,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  cancelButton: {
    flex: 1,
  },
  saveButton: {
    flex: 1,
  },
});
