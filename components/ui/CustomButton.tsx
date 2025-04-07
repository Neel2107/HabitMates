import { useThemeStore } from '@/lib/stores/themeStore';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { Text, TouchableOpacity, ViewStyle, TextStyle, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

interface CustomButtonProps {
  onPress: () => void;
  title: string;
  isLoading?: boolean;
  disabled?: boolean;
  backgroundColor?: string;
  textColor?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  loadingText?: string;
}

export function CustomButton({
  onPress,
  title,
  isLoading = false,
  disabled = false,
  backgroundColor = '#059669',
  textColor = 'white',
  style = {},
  textStyle = {},
  loadingText,
}: CustomButtonProps) {
  const scale = useSharedValue(1);
  const isDisabled = disabled || isLoading;
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 12, stiffness: 150 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 12, stiffness: 150 });
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  // Determine background color based on disabled state
  const buttonBackgroundColor = isDisabled 
    ? '#9ca3af'
    : backgroundColor;

  return (
    <Animated.View 
      style={[
        animatedStyle, 
        { 
          overflow: 'hidden', 
          borderRadius: 12,
          opacity: isDisabled ? 0.7 : 1 
        }, 
        style
      ]}
    >
      <TouchableOpacity
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
        disabled={isDisabled}
        style={{ 
          overflow: 'hidden', 
          borderRadius: 12,
          backgroundColor: buttonBackgroundColor,
          paddingVertical: 16
        }}
      >
        <Text 
          className={`text-center font-inter-bold text-xl ${textColor === 'white' ? 'text-white' : ''}`}
          style={[
            textStyle,
            isDisabled && { opacity: 0.9 }
          ]}
        >
          {isLoading ? (loadingText || `${title}...`) : title}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}