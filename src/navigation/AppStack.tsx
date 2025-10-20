import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DashboardScreen } from '../screens/DashboardScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { SimulatorScreen } from '../screens/SimulatorScreen';
import { SearchScreen } from '../screens/SearchScreen';

export type AppStackParamList = {
  Dashboard: undefined;
  Profile: undefined;
  Simulator: undefined;
  Search: undefined;
};

const Stack = createNativeStackNavigator<AppStackParamList>();

export const AppStack: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#F2F2F2' },
      }}
    >
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Simulator" component={SimulatorScreen} />
        <Stack.Screen name="Search" component={SearchScreen} />
    </Stack.Navigator>
  );
};
