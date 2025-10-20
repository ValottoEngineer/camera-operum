import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { SimpleLoginScreen } from '../screens/SimpleLoginScreen';
import { SimpleHomeScreen } from '../screens/SimpleHomeScreen';
import { SimpleSignUpScreen } from '../screens/SimpleSignUpScreen';

const Stack = createStackNavigator();

export const SimpleNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Login">
          {(props) => (
            <SimpleLoginScreen 
              {...props} 
              onLogin={() => props.navigation.navigate('Home')} 
              onGoToSignUp={() => props.navigation.navigate('SignUp')}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="SignUp">
          {(props) => (
            <SimpleSignUpScreen 
              {...props} 
              onSignedUp={() => props.navigation.navigate('Home')} 
              onGoToLogin={() => props.navigation.navigate('Login')}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="Home">
          {(props) => (
            <SimpleHomeScreen 
              {...props} 
              onLogout={() => props.navigation.navigate('Login')} 
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};
