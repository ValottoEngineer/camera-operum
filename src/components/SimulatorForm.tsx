import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Card } from './Card';
import { TextField } from './TextField';
import { PrimaryButton } from './PrimaryButton';
import { theme } from '../styles/theme';
import { SimulatorInputs, SIMULATOR_PRESETS } from '../types/simulator';

const simulatorSchema = z.object({
  initialAmount: z.number().min(100, 'Valor mínimo: R$ 100').max(1000000, 'Valor máximo: R$ 1.000.000'),
  monthlyContribution: z.number().min(0, 'Aporte não pode ser negativo').max(100000, 'Aporte máximo: R$ 100.000'),
  period: z.number().min(1, 'Período mínimo: 1 ano').max(30, 'Período máximo: 30 anos'),
  selectedStocks: z.array(z.string()).min(1, 'Selecione pelo menos uma ação'),
});

type SimulatorFormData = z.infer<typeof simulatorSchema>;

interface SimulatorFormProps {
  onSubmit: (data: SimulatorInputs) => void;
  loading?: boolean;
  initialValues?: Partial<SimulatorInputs>;
}

export const SimulatorForm: React.FC<SimulatorFormProps> = ({
  onSubmit,
  loading = false,
  initialValues,
}) => {
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SimulatorFormData>({
    resolver: zodResolver(simulatorSchema),
    defaultValues: {
      initialAmount: initialValues?.initialAmount || 10000,
      monthlyContribution: initialValues?.monthlyContribution || 500,
      period: initialValues?.period || 10,
      selectedStocks: initialValues?.selectedStocks || ['ITUB4'],
    },
  });

  const selectedStocks = watch('selectedStocks');

  const handlePresetSelect = (preset: typeof SIMULATOR_PRESETS[0]) => {
    setSelectedPreset(preset.id);
    setValue('initialAmount', preset.inputs.initialAmount || 10000);
    setValue('monthlyContribution', preset.inputs.monthlyContribution || 500);
    setValue('period', preset.inputs.period || 10);
    setValue('selectedStocks', preset.inputs.selectedStocks || ['ITUB4']);
  };

  const toggleStock = (symbol: string) => {
    const current = selectedStocks || [];
    const updated = current.includes(symbol)
      ? current.filter(s => s !== symbol)
      : [...current, symbol];
    setValue('selectedStocks', updated);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatSliderValue = (value: number, type: 'currency' | 'years') => {
    if (type === 'currency') {
      return formatCurrency(value);
    }
    return `${value} ${value === 1 ? 'ano' : 'anos'}`;
  };

  return (
    <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
      <View style={{ padding: theme.spacing.lg }}>
        {/* Presets */}
        <Card style={{ marginBottom: theme.spacing.lg }}>
          <Text
            style={{
              fontSize: theme.typography.sizes.lg,
              fontWeight: theme.typography.weights.bold,
              color: theme.colors.neutral.primary,
              marginBottom: theme.spacing.md,
            }}
          >
            Perfis de Investimento
          </Text>
          
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm }}>
            {SIMULATOR_PRESETS.map((preset) => (
              <TouchableOpacity
                key={preset.id}
                onPress={() => handlePresetSelect(preset)}
                style={{
                  flex: 1,
                  minWidth: '45%',
                  padding: theme.spacing.md,
                  borderRadius: theme.borderRadius.md,
                  borderWidth: 2,
                  borderColor: selectedPreset === preset.id ? preset.color : theme.colors.neutral.border,
                  backgroundColor: selectedPreset === preset.id ? `${preset.color}10` : theme.colors.surface,
                  alignItems: 'center',
                }}
              >
                <Text style={{ fontSize: 24, marginBottom: theme.spacing.xs }}>
                  {preset.icon}
                </Text>
                <Text
                  style={{
                    fontSize: theme.typography.sizes.sm,
                    fontWeight: theme.typography.weights.semibold,
                    color: theme.colors.neutral.primary,
                    textAlign: 'center',
                    marginBottom: theme.spacing.xs,
                  }}
                >
                  {preset.name}
                </Text>
                <Text
                  style={{
                    fontSize: theme.typography.sizes.xs,
                    color: theme.colors.neutral.secondary,
                    textAlign: 'center',
                  }}
                >
                  {preset.description}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Formulário */}
        <Card style={{ marginBottom: theme.spacing.lg }}>
          <Text
            style={{
              fontSize: theme.typography.sizes.lg,
              fontWeight: theme.typography.weights.bold,
              color: theme.colors.neutral.primary,
              marginBottom: theme.spacing.lg,
            }}
          >
            Parâmetros da Simulação
          </Text>

          {/* Valor Inicial */}
          <Controller
            control={control}
            name="initialAmount"
            render={({ field: { onChange, value } }) => (
              <View style={{ marginBottom: theme.spacing.lg }}>
                <Text
                  style={{
                    fontSize: theme.typography.sizes.base,
                    fontWeight: theme.typography.weights.medium,
                    color: theme.colors.neutral.primary,
                    marginBottom: theme.spacing.sm,
                  }}
                >
                  Valor Inicial
                </Text>
                <TextField
                  placeholder="R$ 10.000"
                  value={formatCurrency(value)}
                  onChangeText={(text) => {
                    const numericValue = parseFloat(text.replace(/[^\d]/g, '')) || 0;
                    onChange(numericValue);
                  }}
                  error={errors.initialAmount?.message}
                  keyboardType="numeric"
                />
              </View>
            )}
          />

          {/* Aporte Mensal */}
          <Controller
            control={control}
            name="monthlyContribution"
            render={({ field: { onChange, value } }) => (
              <View style={{ marginBottom: theme.spacing.lg }}>
                <Text
                  style={{
                    fontSize: theme.typography.sizes.base,
                    fontWeight: theme.typography.weights.medium,
                    color: theme.colors.neutral.primary,
                    marginBottom: theme.spacing.sm,
                  }}
                >
                  Aporte Mensal
                </Text>
                <TextField
                  placeholder="R$ 500"
                  value={formatCurrency(value)}
                  onChangeText={(text) => {
                    const numericValue = parseFloat(text.replace(/[^\d]/g, '')) || 0;
                    onChange(numericValue);
                  }}
                  error={errors.monthlyContribution?.message}
                  keyboardType="numeric"
                />
              </View>
            )}
          />

          {/* Período */}
          <Controller
            control={control}
            name="period"
            render={({ field: { onChange, value } }) => (
              <View style={{ marginBottom: theme.spacing.lg }}>
                <Text
                  style={{
                    fontSize: theme.typography.sizes.base,
                    fontWeight: theme.typography.weights.medium,
                    color: theme.colors.neutral.primary,
                    marginBottom: theme.spacing.sm,
                  }}
                >
                  Período de Investimento
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: theme.spacing.sm,
                  }}
                >
                  <Text style={{ fontSize: theme.typography.sizes.sm, color: theme.colors.neutral.secondary }}>
                    1 ano
                  </Text>
                  <Text
                    style={{
                      fontSize: theme.typography.sizes.base,
                      fontWeight: theme.typography.weights.semibold,
                      color: theme.colors.neon.electric,
                    }}
                  >
                    {formatSliderValue(value, 'years')}
                  </Text>
                  <Text style={{ fontSize: theme.typography.sizes.sm, color: theme.colors.neutral.secondary }}>
                    30 anos
                  </Text>
                </View>
                <View
                  style={{
                    height: 40,
                    backgroundColor: theme.colors.neutral.border,
                    borderRadius: theme.borderRadius.sm,
                    justifyContent: 'center',
                    paddingHorizontal: theme.spacing.sm,
                  }}
                >
                  <View
                    style={{
                      height: 4,
                      backgroundColor: theme.colors.neon.electric,
                      borderRadius: 2,
                      width: `${((value - 1) / 29) * 100}%`,
                    }}
                  />
                </View>
                <TouchableOpacity
                  onPress={() => {
                    const newValue = Math.max(1, value - 1);
                    onChange(newValue);
                  }}
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width: 40,
                    height: 40,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ fontSize: 18, color: theme.colors.neon.electric }}>-</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    const newValue = Math.min(30, value + 1);
                    onChange(newValue);
                  }}
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: 0,
                    width: 40,
                    height: 40,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ fontSize: 18, color: theme.colors.neon.electric }}>+</Text>
                </TouchableOpacity>
              </View>
            )}
          />

          {/* Seleção de Ações */}
          <View style={{ marginBottom: theme.spacing.lg }}>
            <Text
              style={{
                fontSize: theme.typography.sizes.base,
                fontWeight: theme.typography.weights.medium,
                color: theme.colors.neutral.primary,
                marginBottom: theme.spacing.sm,
              }}
            >
              Ações para Investimento
            </Text>
            <Text
              style={{
                fontSize: theme.typography.sizes.sm,
                color: theme.colors.neutral.secondary,
                marginBottom: theme.spacing.md,
              }}
            >
              Selecione as ações que deseja incluir na simulação:
            </Text>
            
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm }}>
              {[
                { symbol: 'ITUB4', name: 'Itaú Unibanco', color: '#2196F3' },
                { symbol: 'PETR4', name: 'Petrobras', color: '#FF5722' },
                { symbol: 'VALE3', name: 'Vale', color: '#4CAF50' },
                { symbol: 'MGLU3', name: 'Magazine Luiza', color: '#E91E63' },
              ].map((stock) => {
                const isSelected = selectedStocks?.includes(stock.symbol) || false;
                return (
                  <TouchableOpacity
                    key={stock.symbol}
                    onPress={() => toggleStock(stock.symbol)}
                    style={{
                      flex: 1,
                      minWidth: '45%',
                      padding: theme.spacing.md,
                      borderRadius: theme.borderRadius.md,
                      borderWidth: 2,
                      borderColor: isSelected ? stock.color : theme.colors.neutral.border,
                      backgroundColor: isSelected ? `${stock.color}10` : theme.colors.surface,
                      alignItems: 'center',
                    }}
                  >
                    <Text
                      style={{
                        fontSize: theme.typography.sizes.sm,
                        fontWeight: theme.typography.weights.semibold,
                        color: isSelected ? stock.color : theme.colors.neutral.primary,
                        textAlign: 'center',
                        marginBottom: theme.spacing.xs,
                      }}
                    >
                      {stock.symbol}
                    </Text>
                    <Text
                      style={{
                        fontSize: theme.typography.sizes.xs,
                        color: isSelected ? stock.color : theme.colors.neutral.secondary,
                        textAlign: 'center',
                      }}
                    >
                      {stock.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            
            {errors.selectedStocks && (
              <Text
                style={{
                  fontSize: theme.typography.sizes.sm,
                  color: theme.colors.error,
                  marginTop: theme.spacing.sm,
                }}
              >
                {errors.selectedStocks.message}
              </Text>
            )}
          </View>

          {/* Botão de Simulação */}
          <PrimaryButton
            title="Simular Investimento"
            onPress={handleSubmit(onSubmit)}
            loading={loading}
            disabled={loading}
          />
        </Card>
      </View>
    </ScrollView>
  );
};
