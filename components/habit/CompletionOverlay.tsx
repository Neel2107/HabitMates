import React from 'react';
import { Text, View } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';

interface CompletionOverlayProps {
    opacity: Animated.SharedValue<number>;
    scale: Animated.SharedValue<number>;
    isDark: boolean;
}

export const CompletionOverlay = ({ opacity, scale, isDark }: CompletionOverlayProps) => {
    const animatedStyle = useAnimatedStyle(() => {
        return {
            opacity: opacity.value,
            transform: [{ scale: scale.value }]
        };
    });

    return (
        <Animated.View 
            style={[
                { 
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1000,
                    backgroundColor: isDark ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.7)'
                },
                animatedStyle
            ]}
            pointerEvents="none"
        >
            <View className="bg-emerald-500 rounded-full p-6 mb-4">
                <Feather name="check" size={50} color="white" />
            </View>
            <Text className={`text-xl font-inter-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                Habit Completed!
            </Text>
        </Animated.View>
    );
};