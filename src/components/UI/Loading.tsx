import React from 'react';
import {
  View,
  ActivityIndicator,
  Text,
  StyleSheet,
  Modal,
  ViewStyle,
} from 'react-native';
import { theme } from '../../styles/theme';

interface LoadingProps {
  visible: boolean;
  message?: string;
  overlay?: boolean;
  style?: ViewStyle;
}

export const Loading: React.FC<LoadingProps> = ({
  visible,
  message = 'Carregando...',
  overlay = true,
  style,
}) => {
  if (!visible) return null;

  const content = (
    <View style={[styles.container, style]}>
      <ActivityIndicator
        size="large"
        color={theme.colors.primary}
      />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );

  if (overlay) {
    return (
      <Modal
        transparent
        visible={visible}
        animationType="fade"
        statusBarTranslucent
      >
        <View style={styles.overlay}>
          {content}
        </View>
      </Modal>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 120,
    ...theme.shadows.lg,
  },
  message: {
    ...theme.typography.body,
    color: theme.colors.textPrimary,
    marginTop: theme.spacing.md,
    textAlign: 'center',
  },
});
