import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
    Extrapolate,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withTiming
} from 'react-native-reanimated';
import Svg, { Circle, Text as SvgText } from 'react-native-svg';
import { useThemeStore } from '@/lib/stores/themeStore';

interface ProgressCircleProps {
    progress: number;
    size?: number;
}

export const ProgressCircle = ({ progress, size = 120 }: ProgressCircleProps) => {
    const isDark = useThemeStore((state) => state.isDark);
    const circumference = 2 * Math.PI * (size / 2 - 4);
    const strokeDashoffset = circumference * (1 - progress);

    // Animation for progress circle
    const progressAnimation = useSharedValue(0);

    useEffect(() => {
        progressAnimation.value = withTiming(progress, { duration: 1000 });
    }, [progress]);

    const animatedCircleStyle = useAnimatedStyle(() => {
        return {
            transform: [{ rotate: `${interpolate(progressAnimation.value, [0, 1], [0, 360], Extrapolate.CLAMP)}deg` }],
        };
    });

    return (
        <View style={{ width: size, height: size }}>
            <Animated.View style={animatedCircleStyle}>
                <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                    {/* Background Circle */}
                    <Circle
                        cx={size / 2}
                        cy={size / 2}
                        r={size / 2 - 4}
                        stroke={isDark ? '#334155' : '#e2e8f0'}
                        strokeWidth="8"
                        fill="none"
                    />
                    {/* Progress Circle */}
                    <Circle
                        cx={size / 2}
                        cy={size / 2}
                        r={size / 2 - 4}
                        stroke="#059669"
                        strokeWidth="8"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        fill="none"
                        transform={`rotate(-90, ${size / 2}, ${size / 2})`}
                    />
                    {/* Percentage Text */}
                    <SvgText
                        x={size / 2}
                        y={size / 2 - 5}
                        fontSize={size / 5}
                        fill={isDark ? 'white' : '#1e293b'}
                        textAnchor="middle"
                        fontWeight="bold"
                    >
                        {Math.round(progress * 100)}%
                    </SvgText>
                    <SvgText
                        x={size / 2}
                        y={size / 2 + 20}
                        fontSize={size / 10}
                        fill={isDark ? '#94a3b8' : '#64748b'}
                        textAnchor="middle"
                    >
                        Complete
                    </SvgText>
                </Svg>
            </Animated.View>
        </View>
    );
};