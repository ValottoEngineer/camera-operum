import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { useAuthStore } from '../../state/authStore';
import { onAuthStateChangedListener } from '../../services/firebase/auth';
import { RootStackParamList } from './types';
import { Loading } from '../../components/UI/Loading';

// Auth Screens
import { SignInScreen } from '../../screens/Auth/SignInScreen';
import { SignUpScreen } from '../../screens/Auth/SignUpScreen';

// App Screens
import { TabsNavigator } from './TabsNavigator';
import { ClientFormScreen } from '../../screens/Clients/ClientFormScreen';
import { ClientDetailScreen } from '../../screens/Clients/ClientDetailScreen';
import { WalletFormScreen } from '../../screens/Wallets/WalletFormScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AuthStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <Stack.Screen name="SignIn" component={SignInScreen} />
    <Stack.Screen name="SignUp" component={SignUpScreen} />
  </Stack.Navigator>
);

const AppStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: '#6402FF',
      },
      headerTintColor: '#FFFFFF',
      headerTitleStyle: {
        fontWeight: '600',
      },
    }}
  >
    <Stack.Screen
      name="Tabs"
      component={TabsNavigator}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="ClientForm"
      component={ClientFormScreen}
      options={{
        title: 'Novo Cliente',
        headerBackground: () => (
          <LinearGradient
            colors={['#EE0BFF', '#0B30FF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFillObject}
          />
        ),
      }}
    />
    <Stack.Screen
      name="ClientDetail"
      component={ClientDetailScreen}
      options={{
        title: 'Detalhes do Cliente',
        headerBackground: () => (
          <LinearGradient
            colors={['#EE0BFF', '#0B30FF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFillObject}
          />
        ),
      }}
    />
    <Stack.Screen
      name="WalletForm"
      component={WalletFormScreen}
      options={{
        title: 'Nova Carteira',
        headerBackground: () => (
          <LinearGradient
            colors={['#EE0BFF', '#0B30FF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFillObject}
          />
        ),
      }}
    />
  </Stack.Navigator>
);

export const RootNavigator: React.FC = () => {
  const { isAuthenticated, loading, setUser, setLoading } = useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChangedListener((user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, [setUser, setLoading]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <LinearGradient
          colors={['#EE0BFF', '#0B30FF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFillObject}
        />
        <Loading variant="fullscreen" message="Carregando Operum..." />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
  },
});
