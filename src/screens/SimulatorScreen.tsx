import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Header } from '../components/Header';
import { SimulatorForm } from '../components/SimulatorForm';
import { SimulatorResults } from '../components/SimulatorResults';
import { IconButton } from '../components/IconButton';
import { simulatorService } from '../services/simulatorService';
import { theme } from '../styles/theme';
import { SimulatorInputs, SimulatorResults as SimulatorResultsType } from '../types/simulator';
import { AppStackParamList } from '../navigation/AppStack';

type SimulatorScreenNavigationProp = NativeStackNavigationProp<AppStackParamList, 'Simulator'>;

interface Props {
  navigation: SimulatorScreenNavigationProp;
}

export const SimulatorScreen: React.FC<Props> = ({ navigation }) => {
  const [results, setResults] = useState<SimulatorResultsType | null>(null);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleSimulation = async (inputs: SimulatorInputs) => {
    setLoading(true);
    setShowResults(false);
    
    try {
      const simulationResults = await simulatorService.simulateInvestment(inputs);
      setResults(simulationResults);
      setShowResults(true);
    } catch (error) {
      console.error('Erro na simulação:', error);
      Alert.alert(
        'Erro na Simulação',
        'Não foi possível calcular a simulação. Tente novamente.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  const handleNewSimulation = () => {
    setShowResults(false);
    setResults(null);
  };

  const handleViewRecommendedPortfolio = () => {
    // Navegar para a tela de carteiras recomendadas
    navigation.navigate('Dashboard');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Header
        title="Simulador de Investimentos"
        onBackPress={() => navigation.goBack()}
        rightComponent={
          <IconButton
            iconName="refresh"
            onPress={handleNewSimulation}
            color="#FFFFFF"
            size="medium"
          />
        }
      />

      <View style={{ flex: 1 }}>
        {!showResults ? (
          <SimulatorForm
            onSubmit={handleSimulation}
            loading={loading}
          />
        ) : (
          <SimulatorResults
            results={results!}
            loading={loading}
          />
        )}
      </View>

      {/* Botão de Carteira Recomendada */}
      {showResults && (
        <View
          style={{
            padding: theme.spacing.lg,
            backgroundColor: theme.colors.surface,
            borderTopWidth: 1,
            borderTopColor: theme.colors.neutral.border,
          }}
        >
          <TouchableOpacity
            onPress={handleViewRecommendedPortfolio}
            style={{
              backgroundColor: theme.colors.neon.electric,
              padding: theme.spacing.lg,
              borderRadius: theme.borderRadius.lg,
              alignItems: 'center',
              ...theme.shadows.md,
            }}
          >
            <Text
              style={{
                fontSize: theme.typography.sizes.lg,
                fontWeight: theme.typography.weights.bold,
                color: theme.colors.surface,
              }}
            >
              Ver Carteira Recomendada
            </Text>
            <Text
              style={{
                fontSize: theme.typography.sizes.sm,
                color: theme.colors.surface,
                marginTop: theme.spacing.xs,
                opacity: 0.9,
              }}
            >
              Baseada na sua simulação
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};
