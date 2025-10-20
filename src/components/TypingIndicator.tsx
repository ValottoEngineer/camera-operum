import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';
import { theme } from '../styles/theme';

export const TypingIndicator: React.FC = () => {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animate = (dot: Animated.Value, delay: number) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, {
            toValue: 1,
            duration: 400,
            useNativeDriver: false,
          }),
          Animated.timing(dot, {
            toValue: 0,
            duration: 400,
            useNativeDriver: false,
          }),
        ])
      ).start();
    };

    animate(dot1, 0);
    animate(dot2, 200);
    animate(dot3, 400);
  }, []);

  const Dot = ({ animatedValue }: { animatedValue: Animated.Value }) => (
    <Animated.View
      style={{
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: theme.colors.neutral.secondary,
        marginHorizontal: 2,
        opacity: animatedValue,
      }}
    />
  );

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Dot animatedValue={dot1} />
      <Dot animatedValue={dot2} />
      <Dot animatedValue={dot3} />
    </View>
  );
};
