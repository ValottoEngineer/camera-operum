import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AppStackParamList } from '../types';
import { HomeScreen } from '../screens/App/HomeScreen';
import { ClienteFormScreen } from '../screens/App/ClienteFormScreen';

const Stack = createStackNavigator<AppStackParamList>();

interface AppStackProps {
  userId: string;
}

export const AppStack: React.FC<AppStackProps> = ({ userId }) => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
      }}
    >
      <Stack.Screen name="Home">
        {(props) => <HomeScreen {...props} userId={userId} />}
      </Stack.Screen>
      <Stack.Screen 
        name="ClienteForm"
        options={{
          presentation: 'modal',
          gestureEnabled: true,
        }}
      >
        {(props) => <ClienteFormScreen {...props} userId={userId} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
};
