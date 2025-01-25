import { Text, Pressable } from 'react-native';
import React from 'react';
import Animated, { 
  useAnimatedStyle, 
  withSpring,
  useSharedValue,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

interface ButtonProps {
  onPress: () => void;
  title: string;
  variant?: 'primary' | 'secondary';
}

export function Button({ onPress, title, variant = 'primary' }: ButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPressIn={() => {
          scale.value = withSpring(0.95);
        }}
        onPressOut={() => {
          scale.value = withSpring(1);
        }}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onPress();
        }}
        className={`px-6 py-3 rounded-xl ${
          variant === 'primary'
            ? 'bg-blue-500 active:bg-blue-600'
            : 'bg-gray-200 active:bg-gray-300'
        }`}
      >
        <Text
          className={`text-center font-semibold ${
            variant === 'primary' ? 'text-white' : 'text-gray-800'
          }`}
        >
          {title}
        </Text>
      </Pressable>
    </Animated.View>
  );
}