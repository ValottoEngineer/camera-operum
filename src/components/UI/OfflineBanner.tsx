import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MotiView } from 'moti';

import { useOnline } from '../../hooks/useOnline';
import { theme } from '../../styles/theme';

export const OfflineBanner: React.FC = () => {
  const { isOnline } = useOnline();

  if (isOnline) {
    return null;
  }

  return (
    <MotiView
      from={{ opacity: 0, translateY: -50 }}
      animate={{ opacity: 1, translateY: 0 }}
      exit={{ opacity: 0, translateY: -50 }}
      transition={{ type: 'timing', duration: 300 }}
      style={styles.container}
    >
      <View style={styles.content}>
        <Ionicons name="wifi-outline" size={20} color={theme.colors.white} />
        <Text style={styles.text}>
          Sem conexão. Tentando reconectar...
        </Text>
        <View style={styles.loadingDots}>
          <MotiView
            from={{ opacity: 0.3 }}
            animate={{ opacity: 1 }}
            transition={{
              type: 'timing',
              duration: 1000,
              loop: true,
            }}
            style={styles.dot}
          />
          <MotiView
            from={{ opacity: 0.3 }}
            animate={{ opacity: 1 }}
            transition={{
              type: 'timing',
              duration: 1000,
              delay: 200,
              loop: true,
            }}
            style={styles.dot}
          />
          <MotiView
            from={{ opacity: 0.3 }}
            animate={{ opacity: 1 }}
            transition={{
              type: 'timing',
              duration: 1000,
              delay: 400,
              loop: true,
            }}
            style={styles.dot}
          />
        </View>
      </View>
    </MotiView>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: theme.colors.accent,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    ...theme.shadows.md,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
  },
  text: {
    ...theme.typography.bodySmall,
    color: theme.colors.white,
    fontWeight: '500',
    flex: 1,
  },
  loadingDots: {
    flexDirection: 'row',
    gap: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.white,
  },
});
