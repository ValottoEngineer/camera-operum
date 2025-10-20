import React from 'react';
import { TouchableOpacity, Text, ViewStyle } from 'react-native';
import { theme } from '../styles/theme';

interface InlineLinkProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
}

export const InlineLink: React.FC<InlineLinkProps> = ({
  title,
  onPress,
  style,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[{ paddingVertical: theme.spacing.sm }, style]}
      accessibilityLabel={title}
      accessibilityRole="button"
    >
      <Text
        style={{
          color: theme.colors.neon.future,
          fontSize: theme.typography.sizes.sm,
          fontWeight: theme.typography.weights.medium,
          textAlign: 'center',
          textDecorationLine: 'underline',
        }}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};
