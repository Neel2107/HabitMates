import React, { useEffect } from 'react';
import Animated, { FadeInDown, useSharedValue, withTiming } from 'react-native-reanimated';
import Svg, { Line, Rect, Text as SvgText } from 'react-native-svg';

interface StreakChartProps {
    streakData: number[];
    isDark: boolean;
}

export const StreakChart = ({ streakData, isDark }: StreakChartProps) => {
    const chartHeight = 100;
    const chartWidth = 300;
    const barWidth = 8;
    const spacing = 12;
    const maxValue = Math.max(...streakData, 1);
    
    // Animation values for each bar
    const barAnimations = streakData.map(() => useSharedValue(0));
    
    useEffect(() => {
        // Animate bars sequentially
        streakData.forEach((_, index) => {
            setTimeout(() => {
                barAnimations[index].value = withTiming(1, { duration: 500 });
            }, index * 100);
        });
    }, [streakData]);

    return (
        <Svg width={chartWidth} height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
            {/* X-axis */}
            <Line
                x1="0"
                y1={chartHeight - 20}
                x2={chartWidth}
                y2={chartHeight - 20}
                stroke={isDark ? "#475569" : "#cbd5e1"}
                strokeWidth="1"
            />
            
            {/* Bars */}
            {streakData.map((value, index) => {
                const barHeight = (value / maxValue) * (chartHeight - 30);
                const x = index * (barWidth + spacing) + 10;
                const y = chartHeight - 20 - barHeight;
                
                return (
                    <React.Fragment key={index}>
                        <Animated.View entering={FadeInDown.delay(index * 100).duration(300)}>
                            <Rect
                                x={x}
                                y={y}
                                width={barWidth}
                                height={barHeight}
                                rx={4}
                                fill={value > 0 ? "#059669" : isDark ? "#334155" : "#e2e8f0"}
                            />
                        </Animated.View>
                        <SvgText
                            x={x + barWidth / 2}
                            y={chartHeight - 5}
                            fontSize="10"
                            fill={isDark ? "#94a3b8" : "#64748b"}
                            textAnchor="middle"
                        >
                            {index + 1}
                        </SvgText>
                    </React.Fragment>
                );
            })}
        </Svg>
    );
};