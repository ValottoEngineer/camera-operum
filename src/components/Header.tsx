import React from 'react';
import { View, Text, TouchableOpacity, Platform, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../styles/theme';

interface HeaderProps {
  title: string;
  onBackPress?: () => void;
  rightComponent?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({ title, onBackPress, rightComponent }) => {
  return (
    <LinearGradient
      colors={theme.gradients.header}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={{ height: 100 }}
    >
      {Platform.OS === 'ios' && (
        <BlurView intensity={15} style={StyleSheet.absoluteFillObject} />
      )}
      
      <View style={{
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingTop: 40,
      }}>
        {onBackPress && (
          <TouchableOpacity
            onPress={onBackPress}
            style={{
              position: 'absolute',
              left: 20,
              top: 40,
              width: 40,
              height: 40,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        )}
        
        <Text style={{
          fontSize: 20,
          fontWeight: '600',
          color: '#FFFFFF',
          textAlign: 'center',
        }}>
          {title}
        </Text>
        
        {rightComponent && (
          <View style={{
            position: 'absolute',
            right: 20,
            top: 40,
          }}>
            {rightComponent}
          </View>
        )}
      </View>
    </LinearGradient>
  );
};

