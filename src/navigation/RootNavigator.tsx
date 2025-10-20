import React from 'react';
import { useAuth } from '../context/AuthContext';
import { AuthStack } from './AuthStack';
import { AppStack } from './AppStack';
import { View, ActivityIndicator } from 'react-native';
import { theme } from '../styles/theme';

export const RootNavigator: React.FC = () => {
  const { currentUser, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: theme.colors.background,
        }}
      >
        <ActivityIndicator size="large" color={theme.colors.neon.electric} />
      </View>
    );
  }

  return currentUser ? <AppStack /> : <AuthStack />;
};
