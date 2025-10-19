import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Button } from '../../components/UI/Button';
import { TextInput } from '../../components/UI/TextInput';
import { Loading } from '../../components/UI/Loading';
import { useAuthStore } from '../../state/authStore';
import { createClient, updateClient, getClientById, checkCpfExists } from '../../services/firebase/db';
import { useToast } from '../../hooks/useToast';
import { validateCPF, formatCPF } from '../../utils/cpf';
import { theme } from '../../styles/theme';
import { AppStackParamList } from '../navigation/types';

type ClientFormScreenNavigationProp = NativeStackNavigationProp<AppStackParamList, 'ClientForm'>;
type ClientFormScreenRouteProp = RouteProp<AppStackParamList, 'ClientForm'>;

const clientSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  cpf: z.string().refine(validateCPF, 'CPF inválido'),
  perfilRisco: z.enum(['conservador', 'moderado', 'agressivo']),
  objetivos: z.array(z.string()).min(1, 'Selecione ao menos um objetivo'),
  liquidezMensal: z.number().positive('Valor deve ser positivo'),
});

type ClientFormData = z.infer<typeof clientSchema>;

const OBJETIVOS_OPTIONS = [
  'Aposentadoria',
  'Educação',
  'Reserva de Emergência',
  'Compra de Imóvel',
  'Viagem',
  'Investimento',
];

export const ClientFormScreen: React.FC = () => {
  const navigation = useNavigation<ClientFormScreenNavigationProp>();
  const route = useRoute<ClientFormScreenRouteProp>();
  const { user } = useAuthStore();
  const { showToast } = useToast();

  const { clientId } = route.params || {};
  const isEditing = !!clientId;

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditing);
  const [selectedObjetivos, setSelectedObjetivos] = useState<string[]>([]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      nome: '',
      cpf: '',
      perfilRisco: 'conservador',
      objetivos: [],
      liquidezMensal: 0,
    },
  });

  const watchedPerfilRisco = watch('perfilRisco');

  // Load client data if editing
  useEffect(() => {
    if (isEditing && clientId) {
      loadClientData();
    }
  }, [clientId, isEditing]);

  const loadClientData = async () => {
    try {
      setInitialLoading(true);
      const client = await getClientById(clientId);
      if (client) {
        reset({
          nome: client.nome,
          cpf: client.cpf,
          perfilRisco: client.perfilRisco,
          objetivos: client.objetivos,
          liquidezMensal: client.liquidezMensal,
        });
        setSelectedObjetivos(client.objetivos);
      }
    } catch (error: any) {
      showToast({
        type: 'error',
        title: 'Erro ao carregar cliente',
        message: error.message,
      });
      navigation.goBack();
    } finally {
      setInitialLoading(false);
    }
  };

  const handleObjetivoToggle = (objetivo: string) => {
    const newObjetivos = selectedObjetivos.includes(objetivo)
      ? selectedObjetivos.filter(o => o !== objetivo)
      : [...selectedObjetivos, objetivo];
    
    setSelectedObjetivos(newObjetivos);
    setValue('objetivos', newObjetivos);
  };

  const onSubmit = async (data: ClientFormData) => {
    if (!user) return;

    try {
      setLoading(true);

      // Check CPF uniqueness (only for new clients or if CPF changed)
      if (!isEditing) {
        const cpfExists = await checkCpfExists(data.cpf, user.uid);
        if (cpfExists) {
          showToast({
            type: 'error',
            title: 'CPF já cadastrado',
            message: 'Este CPF já está em uso por outro cliente',
          });
          return;
        }
      }

      const clientData = {
        ...data,
        ownerUid: user.uid,
      };

      if (isEditing) {
        await updateClient(clientId, clientData);
        showToast({
          type: 'success',
          title: 'Cliente atualizado',
          message: `${data.nome} foi atualizado com sucesso`,
        });
      } else {
        await createClient(clientData);
        showToast({
          type: 'success',
          title: 'Cliente criado',
          message: `${data.nome} foi adicionado com sucesso`,
        });
      }

      navigation.goBack();
    } catch (error: any) {
      showToast({
        type: 'error',
        title: 'Erro ao salvar',
        message: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (isEditing) {
      Alert.alert(
        'Cancelar edição',
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

  if (initialLoading) {
    return <Loading variant="fullscreen" message="Carregando cliente..." />;
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <Text style={styles.title}>
            {isEditing ? 'Editar Cliente' : 'Novo Cliente'}
          </Text>

          {/* Nome */}
          <Controller
            control={control}
            name="nome"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Nome completo"
                placeholder="Digite o nome completo"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.nome?.message}
                leftIcon="person-outline"
                autoCapitalize="words"
              />
            )}
          />

          {/* CPF */}
          <Controller
            control={control}
            name="cpf"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="CPF"
                placeholder="000.000.000-00"
                value={value}
                onChangeText={(text) => {
                  const formatted = formatCPF(text);
                  onChange(formatted);
                }}
                onBlur={onBlur}
                error={errors.cpf?.message}
                leftIcon="card-outline"
                keyboardType="numeric"
                maxLength={14}
              />
            )}
          />

          {/* Perfil de Risco */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Perfil de Risco</Text>
            <View style={styles.riskOptions}>
              {[
                { value: 'conservador', label: 'Conservador', color: theme.colors.success },
                { value: 'moderado', label: 'Moderado', color: theme.colors.warning },
                { value: 'agressivo', label: 'Agressivo', color: theme.colors.error },
              ].map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.riskOption,
                    watchedPerfilRisco === option.value && styles.riskOptionSelected,
                    { borderColor: option.color },
                  ]}
                  onPress={() => setValue('perfilRisco', option.value as any)}
                >
                  <View style={[styles.riskIndicator, { backgroundColor: option.color }]} />
                  <Text style={[
                    styles.riskLabel,
                    watchedPerfilRisco === option.value && styles.riskLabelSelected,
                  ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Objetivos */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Objetivos de Investimento</Text>
            <View style={styles.objectivesGrid}>
              {OBJETIVOS_OPTIONS.map((objetivo) => (
                <TouchableOpacity
                  key={objetivo}
                  style={[
                    styles.objectiveChip,
                    selectedObjetivos.includes(objetivo) && styles.objectiveChipSelected,
                  ]}
                  onPress={() => handleObjetivoToggle(objetivo)}
                >
                  <Text style={[
                    styles.objectiveText,
                    selectedObjetivos.includes(objetivo) && styles.objectiveTextSelected,
                  ]}>
                    {objetivo}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {errors.objetivos && (
              <Text style={styles.errorText}>{errors.objetivos.message}</Text>
            )}
          </View>

          {/* Liquidez Mensal */}
          <Controller
            control={control}
            name="liquidezMensal"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Liquidez Mensal"
                placeholder="0,00"
                value={value > 0 ? value.toString() : ''}
                onChangeText={(text) => {
                  const numericValue = parseFloat(text.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
                  onChange(numericValue);
                }}
                onBlur={onBlur}
                error={errors.liquidezMensal?.message}
                leftIcon="cash-outline"
                keyboardType="numeric"
                rightIcon="logo-usd"
              />
            )}
          />

          {/* Action Buttons */}
          <View style={styles.actions}>
            <Button
              title="Cancelar"
              onPress={handleCancel}
              variant="outline"
              style={styles.cancelButton}
            />
            <Button
              title={isEditing ? 'Atualizar' : 'Criar Cliente'}
              onPress={handleSubmit(onSubmit)}
              loading={loading}
              disabled={loading}
              style={styles.submitButton}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    padding: theme.spacing.lg,
  },
  title: {
    ...theme.typography.h2,
    color: theme.colors.textPrimary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionLabel: {
    ...theme.typography.body,
    color: theme.colors.textPrimary,
    fontWeight: '600',
    marginBottom: theme.spacing.md,
  },
  riskOptions: {
    gap: theme.spacing.sm,
  },
  riskOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.md,
    borderWidth: 2,
    ...theme.shadows.sm,
  },
  riskOptionSelected: {
    backgroundColor: theme.colors.card,
  },
  riskIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: theme.spacing.sm,
  },
  riskLabel: {
    ...theme.typography.body,
    color: theme.colors.textPrimary,
  },
  riskLabelSelected: {
    fontWeight: '600',
  },
  objectivesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  objectiveChip: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.sm,
  },
  objectiveChipSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  objectiveText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textPrimary,
  },
  objectiveTextSelected: {
    color: theme.colors.white,
    fontWeight: '600',
  },
  errorText: {
    ...theme.typography.caption,
    color: theme.colors.error,
    marginTop: theme.spacing.xs,
  },
  actions: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginTop: theme.spacing.xl,
  },
  cancelButton: {
    flex: 1,
  },
  submitButton: {
    flex: 2,
  },
});
