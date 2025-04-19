import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';

interface HabitHeaderProps {
    isDark: boolean;
    onShare: () => void;
    onEdit: () => void;
}

export const HabitHeader = ({ isDark, onShare, onEdit }: HabitHeaderProps) => {
    // Animation values for header buttons
    const backButtonScale = useSharedValue(1);
    const shareButtonScale = useSharedValue(1);
    const editButtonScale = useSharedValue(1);
    
    // Animation handlers for header buttons
    const animateButton = (scaleValue: Animated.SharedValue<number>) => {
        scaleValue.value = withSpring(0.9);
        setTimeout(() => {
            scaleValue.value = withSpring(1);
        }, 100);
    };
    
    // Animation styles
    const backButtonStyle = useAnimatedStyle(() => ({
        transform: [{ scale: backButtonScale.value }]
    }));
    
    const shareButtonStyle = useAnimatedStyle(() => ({
        transform: [{ scale: shareButtonScale.value }]
    }));
    
    const editButtonStyle = useAnimatedStyle(() => ({
        transform: [{ scale: editButtonScale.value }]
    }));

    return (
        <Animated.View
            entering={FadeIn.duration(500)}
            className="px-6 pt-4 pb-2 flex-row items-center justify-between"
        >
            <Animated.View style={backButtonStyle}>
                <TouchableOpacity
                    onPress={() => {
                        animateButton(backButtonScale);
                        router.back();
                    }}
                    className={`p-2 rounded-full ${isDark ? 'bg-zinc-800' : 'bg-white'}`}
                    activeOpacity={0.7}
                >
                    <Feather name="arrow-left" size={20} color={isDark ? '#e2e8f0' : '#0f172a'} />
                </TouchableOpacity>
            </Animated.View>

            <View className="flex-row">
                <Animated.View style={shareButtonStyle} className="mr-3">
                    <TouchableOpacity
                        onPress={() => {
                            animateButton(shareButtonScale);
                            onShare();
                        }}
                        className={`p-2 rounded-full ${isDark ? 'bg-zinc-800' : 'bg-white'}`}
                        activeOpacity={0.7}
                    >
                        <Feather name="share-2" size={20} color={isDark ? '#e2e8f0' : '#0f172a'} />
                    </TouchableOpacity>
                </Animated.View>

                <Animated.View style={editButtonStyle}>
                    <TouchableOpacity
                        onPress={() => {
                            animateButton(editButtonScale);
                            onEdit();
                        }}
                        className={`p-2 rounded-full ${isDark ? 'bg-zinc-800' : 'bg-white'}`}
                        activeOpacity={0.7}
                    >
                        <Feather name="edit-2" size={20} color={isDark ? '#e2e8f0' : '#0f172a'} />
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </Animated.View>
    );
};