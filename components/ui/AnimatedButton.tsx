import React from "react";
import { ActivityIndicator, Text, TouchableOpacity } from "react-native";
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring 
} from "react-native-reanimated";
import * as Haptics from 'expo-haptics';

interface AnimatedButtonProps {
  onPress: () => void;
  isLoading?: boolean;
  title: string;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
  className?: string;
}

export function AnimatedButton({
  onPress,
  isLoading = false,
  title,
  disabled = false,
  variant = 'primary',
  className = "",
}: AnimatedButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <TouchableOpacity
      disabled={disabled || isLoading}
      activeOpacity={1}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
      }}
      onPressIn={() => {
        scale.value = withSpring(0.95);
      }}
      onPressOut={() => {
        scale.value = withSpring(1);
      }}
    >
      <Animated.View
        style={animatedStyle}
        className={`w-full py-4 items-center justify-center rounded-2xl ${
          disabled || isLoading 
            ? 'bg-gray-300' 
            : variant === 'primary' 
              ? 'bg-blue-500' 
              : 'bg-gray-100'
        } ${className}`}
      >
        {isLoading ? (
          <ActivityIndicator color={variant === 'primary' ? "#FFFFFF" : "#000000"} />
        ) : (
          <Text 
            className={`font-semibold text-lg ${
              variant === 'primary' ? 'text-white' : 'text-gray-800'
            }`}
          >
            {title}
          </Text>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
}