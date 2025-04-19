import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: string;
    isDark: boolean;
}

export const StatCard = ({ title, value, icon, isDark }: StatCardProps) => {
    const scale = useSharedValue(1);

    const handlePressIn = () => {
        scale.value = withSpring(0.95);
    };

    const handlePressOut = () => {
        scale.value = withSpring(1);
    };

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scale.value }],
        };
    });

    return (
        <Animated.View
            style={animatedStyle}
            entering={FadeInDown.duration(400)}
            className={`p-4 rounded-xl ${isDark ? 'bg-zinc-800' : 'bg-white'} shadow-sm flex-1`}
        >
            <TouchableOpacity
                activeOpacity={0.8}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                className="flex-row items-center"
            >
                <View className={`w-10 h-10 rounded-full items-center justify-center ${isDark ? 'bg-zinc-700' : 'bg-emerald-50'}`}>
                    <Feather name={icon as any} size={18} color="#059669" />
                </View>
                <View className="ml-3">
                    <Text className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{title}</Text>
                    <Text className={`text-lg font-inter-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>{value}</Text>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
};