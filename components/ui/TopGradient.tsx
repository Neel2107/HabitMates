import { useThemeStore } from '@/lib/stores/themeStore';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { View } from 'react-native';

const TopGradient = () => {
    const isDark = useThemeStore((state) => state.isDark);
    return (

        <View className="absolute top-0 left-0 right-0 h-52 z-0 overflow-hidden">
            <BlurView
                intensity={80}
                tint={isDark ? "dark" : "light"}
                className="absolute top-0 left-0 right-0 h-48 "
                experimentalBlurMethod="dimezisBlurView"
                blurReductionFactor={5}
            >
                <View className="h-full">
                    {/* Main horizontal gradient */}
                    <LinearGradient
                        colors={[
                            'rgba(5,150,105,0.6)',    // Emerald
                            'rgba(45,110,167,0.6)',   // Emerald-Indigo blend
                            'rgba(79,70,229,0.6)',    // Indigo
                            'rgba(157,71,191,0.6)',   // Indigo-Pink blend
                            'rgba(236,72,153,0.6)',   // Pink
                        ]}
                        locations={[0, 0.25, 0.5, 0.75, 1]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        className="absolute top-0 left-0 right-0 h-full"
                    />
                    {/* Fade out gradient */}
                    <LinearGradient
                        colors={[
                            'rgba(0,0,0,0)',
                            isDark ? 'rgba(26,26,26,0.2)' : 'rgba(245,249,248,0.2)',
                            isDark ? 'rgba(26,26,26,0.4)' : 'rgba(245,249,248,0.4)',
                            isDark ? 'rgba(26,26,26,0.6)' : 'rgba(245,249,248,0.6)',
                            isDark ? 'rgba(26,26,26,0.8)' : 'rgba(245,249,248,0.8)',
                            isDark ? 'rgba(26,26,26,0.95)' : 'rgba(245,249,248,0.95)',
                            isDark ? '#1a1a1a' : '#f5f9f8'
                        ]}
                        locations={[0, 0.2, 0.3, 0.4, 0.5, 0.6, 0.8]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0, y: 0.7 }}
                        className="absolute top-0 left-0 right-0 h-full"
                    />
                </View>
            </BlurView>
        </View>
    )
}

export default TopGradient