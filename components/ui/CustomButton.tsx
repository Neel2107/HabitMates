import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { ActivityIndicator, Text, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
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
    icon?: string;
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
    icon,
}: CustomButtonProps) {
    const scale = useSharedValue(1);
    const isDisabled = disabled || isLoading;

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const handlePressIn = () => {
        if (isDisabled) return;
        scale.value = withSpring(0.95, { damping: 12, stiffness: 150 });
    };

    const handlePressOut = () => {
        if (isDisabled) return;
        scale.value = withSpring(1, { damping: 12, stiffness: 150 });
    };

    const handlePress = () => {
        if (isDisabled) return;
        try {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onPress();
        } catch (error) {
            console.log('Error in button press:', error);
        }
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
                    paddingVertical: 12
                }}
            >
                <View className="flex-row items-center justify-center">
                    {isLoading ? (
                        <ActivityIndicator size="small" color={textColor} style={{ marginRight: 8 }} />
                    ) : icon ? (
                        <Feather
                            name={icon as any}
                            size={18}
                            color={textColor}
                            style={{ marginRight: 8 }}
                        />
                    ) : null}
                    <Text
                        className={`text-center font-inter-bold text-lg ${textColor === 'white' ? 'text-white' : ''}`}
                        style={[
                            textStyle,
                            isDisabled && { opacity: 0.9 }
                        ]}
                    >
                        {isLoading ? (loadingText || `${title}...`) : title}
                    </Text>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
}