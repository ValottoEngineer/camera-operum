import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthStackParamList } from '../types';
import { LoginScreen } from '../screens/Auth/LoginScreen';

const Stack = createStackNavigator<AuthStackParamList>();

interface AuthStackProps {
  onLoginSuccess: () => void;
}

export const AuthStack: React.FC<AuthStackProps> = ({ onLoginSuccess }) => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
      }}
    >
      <Stack.Screen name="Login">
        {(props) => <LoginScreen {...props} onLoginSuccess={onLoginSuccess} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
};
