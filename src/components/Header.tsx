import React from 'react';
import { View, Text, ViewStyle, StyleSheet } from 'react-native';
import { GradientContainer } from './GradientContainer';
import { BackButton } from './BackButton';
import { IconButton } from './IconButton';
import { theme } from '../styles/theme';

interface HeaderProps {
  title: string;
  onBackPress?: () => void;
  rightIcon?: keyof typeof import('@expo/vector-icons').Ionicons.glyphMap;
  onRightIconPress?: () => void;
  showBackButton?: boolean;
  style?: ViewStyle;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  onBackPress,
  rightIcon,
  onRightIconPress,
  showBackButton = true,
  style,
}) => {
  return (
    <GradientContainer height={120} style={style}>
      <View style={styles.container}>
        {showBackButton && onBackPress && (
          <BackButton onPress={onBackPress} />
        )}
        
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
        </View>
        
        {rightIcon && onRightIconPress && (
          <IconButton
            iconName={rightIcon}
            onPress={onRightIconPress}
            color={theme.colors.surface}
          />
        )}
      </View>
    </GradientContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingTop: theme.spacing.lg,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: theme.spacing.lg,
  },
  title: {
    ...theme.typography.h2,
    color: theme.colors.surface,
    textAlign: 'center',
  },
});
