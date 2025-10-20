import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, StyleSheet } from 'react-native';

import { AuthStack } from './AuthStack';
import { AppStack } from './AppStack';
import { Loading } from '../components/UI/Loading';
import { theme } from '../styles/theme';
import { AuthUser } from '../types';
import { onAuthStateChanged } from '../services/auth';

const Stack = createStackNavigator();

export const RootNavigator: React.FC = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged((authUser) => {
      setUser(authUser);
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  const handleLoginSuccess = () => {
    // O listener onAuthStateChanged já vai atualizar o estado automaticamente
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Loading visible={true} message="Inicializando..." />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <Stack.Screen name="App">
            {(props) => <AppStack {...props} userId={user.uid} />}
          </Stack.Screen>
        ) : (
          <Stack.Screen name="Auth">
            {(props) => <AuthStack {...props} onLoginSuccess={handleLoginSuccess} />}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
