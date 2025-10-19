import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Button } from '../../components/UI/Button';
import { TextInput } from '../../components/UI/TextInput';
import { Loading } from '../../components/UI/Loading';
import { useAuthStore } from '../../state/authStore';
import { 
  createWallet, 
  updateWallet, 
  getWalletById, 
  getClientById, 
  Client 
} from '../../services/firebase/db';
import { useToast } from '../../hooks/useToast';
import { generateWalletExplanation } from '../../utils/xai';
import { theme } from '../../styles/theme';
import { AppStackParamList } from '../navigation/types';

type WalletFormScreenNavigationProp = NativeStackNavigationProp<AppStackParamList, 'WalletForm'>;
type WalletFormScreenRouteProp = RouteProp<AppStackParamList, 'WalletForm'>;

const assetSchema = z.object({
  ticker: z.string().min(4, 'Ticker deve ter pelo menos 4 caracteres').max(6, 'Ticker deve ter no máximo 6 caracteres'),
  percentual: z.number().min(0, 'Percentual deve ser positivo').max(100, 'Percentual não pode ser maior que 100'),
});

const walletSchema = z.object({
  nomeCarteira: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  clientId: z.string().min(1, 'Cliente é obrigatório'),
  ativos: z.array(assetSchema).min(1, 'Adicione pelo menos um ativo'),
}).refine((data) => {
  const total = data.ativos.reduce((sum, ativo) => sum + ativo.percentual, 0);
  return total === 100;
}, {
  message: 'A soma dos percentuais deve ser 100%',
  path: ['ativos'],
});

type WalletFormData = z.infer<typeof walletSchema>;

interface Asset {
  ticker: string;
  percentual: number;
}

const SUGGESTED_TICKERS = [
  'PETR4', 'VALE3', 'ITUB4', 'BBDC4', 'ABEV3',
  'WEGE3', 'MGLU3', 'RENT3', 'LREN3', 'B3SA3',
  'SUZB3', 'RADL3', 'JBSS3', 'HAPV3', 'VIVT3',
];

export const WalletFormScreen: React.FC = () => {
  const navigation = useNavigation<WalletFormScreenNavigationProp>();
  const route = useRoute<WalletFormScreenRouteProp>();
  const { user } = useAuthStore();
  const { showToast } = useToast();

  const { clientId: routeClientId, walletId } = route.params || {};
  const isEditing = !!walletId;

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditing);
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [ativos, setAtivos] = useState<Asset[]>([
    { ticker: '', percentual: 0 },
  ]);
  const [explicacao, setExplicacao] = useState('');

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<WalletFormData>({
    resolver: zodResolver(walletSchema),
    defaultValues: {
      nomeCarteira: '',
      clientId: routeClientId || '',
      ativos: [],
    },
  });

  const watchedClientId = watch('clientId');

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (watchedClientId) {
      loadClientData(watchedClientId);
    }
  }, [watchedClientId]);

  const loadInitialData = async () => {
    try {
      setInitialLoading(true);
      
      // Load clients if no specific client is selected
      if (!routeClientId) {
        // TODO: Load clients list
        setClients([]);
      } else {
        const client = await getClientById(routeClientId);
        if (client) {
          setSelectedClient(client);
          setClients([client]);
        }
      }

      // Load wallet data if editing
      if (isEditing && walletId) {
        const wallet = await getWalletById(walletId);
        if (wallet) {
          reset({
            nomeCarteira: wallet.nomeCarteira,
            clientId: wallet.clientId,
            ativos: wallet.ativos,
          });
          setAtivos(wallet.ativos);
          setExplicacao(wallet.explicacao);
        }
      }
    } catch (error: any) {
      showToast({
        type: 'error',
        title: 'Erro ao carregar dados',
        message: error.message,
      });
      navigation.goBack();
    } finally {
      setInitialLoading(false);
    }
  };

  const loadClientData = async (clientId: string) => {
    try {
      const client = await getClientById(clientId);
      if (client) {
        setSelectedClient(client);
      }
    } catch (error: any) {
      showToast({
        type: 'error',
        title: 'Erro ao carregar cliente',
        message: error.message,
      });
    }
  };

  const addAtivo = () => {
    if (ativos.length < 10) {
      setAtivos([...ativos, { ticker: '', percentual: 0 }]);
    }
  };

  const removeAtivo = (index: number) => {
    if (ativos.length > 1) {
      const newAtivos = ativos.filter((_, i) => i !== index);
      setAtivos(newAtivos);
      setValue('ativos', newAtivos);
    }
  };

  const updateAtivo = (index: number, field: keyof Asset, value: string | number) => {
    const newAtivos = [...ativos];
    newAtivos[index] = { ...newAtivos[index], [field]: value };
    setAtivos(newAtivos);
    setValue('ativos', newAtivos);
  };

  const getTotalPercentage = () => {
    return ativos.reduce((sum, ativo) => sum + ativo.percentual, 0);
  };

  const generateExplanation = async () => {
    if (!selectedClient || ativos.length === 0) return;

    try {
      const explanation = generateWalletExplanation(
        {
          perfilRisco: selectedClient.perfilRisco,
          liquidezMensal: selectedClient.liquidezMensal,
        },
        ativos
      );
      setExplicacao(explanation);
    } catch (error: any) {
      showToast({
        type: 'error',
        title: 'Erro ao gerar explicação',
        message: error.message,
      });
    }
  };

  const onSubmit = async (data: WalletFormData) => {
    if (!user) return;

    try {
      setLoading(true);

      // Generate explanation if not already generated
      let finalExplicacao = explicacao;
      if (!finalExplicacao) {
        finalExplicacao = generateWalletExplanation(
          {
            perfilRisco: selectedClient!.perfilRisco,
            liquidezMensal: selectedClient!.liquidezMensal,
          },
          ativos
        );
      }

      const walletData = {
        ...data,
        explicacao: finalExplicacao,
        ownerUid: user.uid,
      };

      if (isEditing) {
        await updateWallet(walletId, walletData);
        showToast({
          type: 'success',
          title: 'Carteira atualizada',
          message: `${data.nomeCarteira} foi atualizada com sucesso`,
        });
      } else {
        await createWallet(walletData);
        showToast({
          type: 'success',
          title: 'Carteira criada',
          message: `${data.nomeCarteira} foi criada com sucesso`,
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
    return <Loading variant="fullscreen" message="Carregando dados..." />;
  }

  const totalPercentage = getTotalPercentage();
  const isComplete = totalPercentage === 100;

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
            {isEditing ? 'Editar Carteira' : 'Nova Carteira'}
          </Text>

          {/* Nome da Carteira */}
          <Controller
            control={control}
            name="nomeCarteira"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Nome da Carteira"
                placeholder="Ex: Carteira Conservadora"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.nomeCarteira?.message}
                leftIcon="wallet-outline"
              />
            )}
          />

          {/* Cliente (se não veio da tela de cliente) */}
          {!routeClientId && (
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Cliente</Text>
              <Text style={styles.clientName}>
                {selectedClient ? selectedClient.nome : 'Selecione um cliente'}
              </Text>
            </View>
          )}

          {/* Ativos */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionLabel}>Ativos</Text>
              <View style={styles.percentageContainer}>
                <Text style={[
                  styles.percentageText,
                  { color: isComplete ? theme.colors.success : theme.colors.warning }
                ]}>
                  {totalPercentage.toFixed(0)}%
                </Text>
                <Text style={styles.percentageLabel}>de 100%</Text>
              </View>
            </View>

            {ativos.map((ativo, index) => (
              <View key={index} style={styles.ativoRow}>
                <View style={styles.ativoInputs}>
                  <TextInput
                    placeholder="Ex: PETR4"
                    value={ativo.ticker}
                    onChangeText={(text) => updateAtivo(index, 'ticker', text.toUpperCase())}
                    style={styles.tickerInput}
                    maxLength={6}
                    autoCapitalize="characters"
                  />
                  <TextInput
                    placeholder="%"
                    value={ativo.percentual > 0 ? ativo.percentual.toString() : ''}
                    onChangeText={(text) => {
                      const value = parseFloat(text) || 0;
                      updateAtivo(index, 'percentual', value);
                    }}
                    style={styles.percentInput}
                    keyboardType="numeric"
                    maxLength={3}
                  />
                </View>
                
                {ativos.length > 1 && (
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => removeAtivo(index)}
                  >
                    <Ionicons name="trash" size={16} color={theme.colors.error} />
                  </TouchableOpacity>
                )}
              </View>
            ))}

            {ativos.length < 10 && (
              <TouchableOpacity style={styles.addButton} onPress={addAtivo}>
                <Ionicons name="add" size={16} color={theme.colors.primary} />
                <Text style={styles.addButtonText}>Adicionar Ativo</Text>
              </TouchableOpacity>
            )}

            {errors.ativos && (
              <Text style={styles.errorText}>{errors.ativos.message}</Text>
            )}
          </View>

          {/* Tickers Sugeridos */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Tickers Sugeridos</Text>
            <View style={styles.tickersGrid}>
              {SUGGESTED_TICKERS.map((ticker) => (
                <TouchableOpacity
                  key={ticker}
                  style={styles.tickerChip}
                  onPress={() => {
                    const emptyIndex = ativos.findIndex(a => !a.ticker);
                    if (emptyIndex !== -1) {
                      updateAtivo(emptyIndex, 'ticker', ticker);
                    }
                  }}
                >
                  <Text style={styles.tickerText}>{ticker}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Explicação */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionLabel}>Explicação da Carteira</Text>
              <TouchableOpacity
                style={styles.generateButton}
                onPress={generateExplanation}
                disabled={!selectedClient || ativos.length === 0}
              >
                <Ionicons name="refresh" size={16} color={theme.colors.primary} />
                <Text style={styles.generateButtonText}>Gerar</Text>
              </TouchableOpacity>
            </View>
            
            <TextInput
              placeholder="A explicação será gerada automaticamente baseada no perfil do cliente e ativos selecionados..."
              value={explicacao}
              onChangeText={setExplicacao}
              multiline
              numberOfLines={4}
              style={styles.explanationInput}
            />
          </View>

          {/* Action Buttons */}
          <View style={styles.actions}>
            <Button
              title="Cancelar"
              onPress={handleCancel}
              variant="outline"
              style={styles.cancelButton}
            />
            <Button
              title={isEditing ? 'Atualizar' : 'Criar Carteira'}
              onPress={handleSubmit(onSubmit)}
              loading={loading}
              disabled={loading || !isComplete}
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  sectionLabel: {
    ...theme.typography.body,
    color: theme.colors.textPrimary,
    fontWeight: '600',
  },
  clientName: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
  },
  percentageContainer: {
    alignItems: 'center',
  },
  percentageText: {
    ...theme.typography.h3,
    fontWeight: '700',
  },
  percentageLabel: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  ativoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  ativoInputs: {
    flex: 1,
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  tickerInput: {
    flex: 1,
  },
  percentInput: {
    width: 80,
  },
  removeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    gap: theme.spacing.sm,
  },
  addButtonText: {
    ...theme.typography.bodySmall,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  tickersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  tickerChip: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.sm,
  },
  tickerText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textPrimary,
    fontWeight: '600',
  },
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    gap: theme.spacing.xs,
  },
  generateButtonText: {
    ...theme.typography.bodySmall,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  explanationInput: {
    minHeight: 100,
    textAlignVertical: 'top',
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
