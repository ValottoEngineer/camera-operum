import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../styles/theme';

interface GradientHeaderProps {
  title: string;
  onBackPress?: () => void;
  onRightPress?: () => void;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  rightText?: string;
  style?: ViewStyle;
  titleStyle?: TextStyle;
}

export const GradientHeader: React.FC<GradientHeaderProps> = ({
  title,
  onBackPress,
  onRightPress,
  rightIcon,
  rightText,
  style,
  titleStyle,
}) => {
  return (
    <LinearGradient
      colors={theme.colors.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={[styles.container, style]}
    >
      <View style={styles.content}>
        {onBackPress && (
          <TouchableOpacity
            style={styles.leftButton}
            onPress={onBackPress}
            activeOpacity={0.7}
          >
            <Ionicons
              name="arrow-back"
              size={24}
              color={theme.colors.white}
            />
          </TouchableOpacity>
        )}

        <Text style={[styles.title, titleStyle]} numberOfLines={1}>
          {title}
        </Text>

        {(onRightPress && (rightIcon || rightText)) && (
          <TouchableOpacity
            style={styles.rightButton}
            onPress={onRightPress}
            activeOpacity={0.7}
          >
            {rightIcon ? (
              <Ionicons
                name={rightIcon}
                size={24}
                color={theme.colors.white}
              />
            ) : (
              <Text style={styles.rightText}>{rightText}</Text>
            )}
          </TouchableOpacity>
        )}

        {/* Spacer para centralizar o título quando há botão de voltar mas não de direita */}
        {onBackPress && !onRightPress && <View style={styles.rightButton} />}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 50, // Status bar height
    paddingBottom: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 44,
  },
  leftButton: {
    padding: theme.spacing.sm,
    marginLeft: -theme.spacing.sm,
  },
  title: {
    ...theme.typography.h2,
    color: theme.colors.white,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: theme.spacing.md,
  },
  rightButton: {
    padding: theme.spacing.sm,
    marginRight: -theme.spacing.sm,
    minWidth: 44,
    alignItems: 'center',
  },
  rightText: {
    ...theme.typography.body,
    color: theme.colors.white,
    fontWeight: '600',
  },
});
