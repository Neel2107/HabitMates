import { useThemeStore } from '@/lib/stores/themeStore';
import * as Haptics from 'expo-haptics';
import React from "react";
import { ActivityIndicator, Text, TouchableOpacity } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from "react-native-reanimated";

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
  const isDark = useThemeStore((state) => state.isDark);
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
        className={`w-full py-4 items-center justify-center rounded-2xl ${disabled || isLoading
            ? 'bg-slate-300 dark:bg-slate-700'
            : variant === 'primary'
              ? 'bg-blue-500 dark:bg-blue-600'
              : 'bg-slate-100 dark:bg-slate-800'
          } ${className}`}
      >
        {isLoading ? (
          <ActivityIndicator color={variant === 'primary' ? "#FFFFFF" : isDark ? "#94a3b8" : "#1e293b"} />
        ) : (
          <Text
            className={`font-semibold text-lg ${variant === 'primary'
                ? 'text-white'
                : isDark ? 'text-slate-200' : 'text-slate-800'
              }`}
          >
            {title}
          </Text>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
}