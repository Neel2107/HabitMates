import { HabitHeatmap } from '@/components/HabitHeatmap';
import { jsonLog } from '@/lib/helpers';
import { calculateStreak } from '@/lib/helpers/streakCalculator';
import { useHabitsStore } from '@/lib/stores/habitsStore';
import { useThemeStore } from '@/lib/stores/themeStore';
import { Habit } from '@/lib/types';
import { Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, Share, Text, TouchableOpacity, View } from 'react-native';
import Animated, { 
  FadeIn, 
  FadeInDown, 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring, 
  withTiming,
  interpolate,
  Extrapolate
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Text as SvgText, Line, Rect } from 'react-native-svg';

// Progress circle component for habit completion
const ProgressCircle = ({ progress, size = 120 }: { progress: number, size?: number }) => {
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

// New component: Streak Chart
const StreakChart = ({ streakData, isDark }: { streakData: number[], isDark: boolean }) => {
    const chartHeight = 100;
    const chartWidth = 300;
    const barWidth = 8;
    const spacing = 12;
    const maxValue = Math.max(...streakData, 1);
    
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

// New component: Stat Card
const StatCard = ({ title, value, icon, isDark }: { title: string, value: string | number, icon: string, isDark: boolean }) => {
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
            className={`p-4 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-sm flex-1`}
        >
            <TouchableOpacity 
                activeOpacity={0.8}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                className="flex-row items-center"
            >
                <View className={`w-10 h-10 rounded-full items-center justify-center ${isDark ? 'bg-gray-700' : 'bg-emerald-50'}`}>
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

// Main component
const HabitDetailScreen = () => {
    const { id } = useLocalSearchParams();
    const habitId = Array.isArray(id) ? id[0] : id;
    const isDark = useThemeStore((state) => state.isDark);
    const navigation = useNavigation();
    const { habits, isLoading, fetchHabits, toggleHabitCompletion, deleteHabit } = useHabitsStore();
    const [habit, setHabit] = useState<Habit | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [streakData, setStreakData] = useState<number[]>([]);
    
    // Animation values
    const checkButtonScale = useSharedValue(1);
    

      // Add the handleShareHabit function
      const handleShareHabit = async () => {
        if (!habit) return;
        
        try {
            await Share.share({
                message: `I'm tracking my habit "${habit.name}" with HabitMates! Join me in building better habits.`,
                title: 'Share Habit'
            });
        } catch (error) {
            console.error('Error sharing habit:', error);
        }
    };

    // Add the handleEditHabit function
    const handleEditHabit = () => {
        router.push({
            pathname: '/(auth)/add-habit',
            params: { id: habitId }
        });
    };


    const handleDeleteHabit = () => {
        if (!habit?.id) return;

        Alert.alert(
            'Delete Habit',
            'Are you sure you want to delete this habit? This action cannot be undone.',
            [
                {
                    text: 'Cancel',
                    style: 'cancel'
                },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            setIsDeleting(true);
                            await deleteHabit(habit.id.toString());
                            Alert.alert('Success', 'Habit deleted successfully');
                            router.back();
                        } catch (error: any) {
                            Alert.alert('Error', error.message || 'Failed to delete habit');
                            setIsDeleting(false);
                        }
                    }
                }
            ]
        );
    };

    // Fetch habit data
    useEffect(() => {
        const loadHabit = async () => {
            if (!habits.length) {
                await fetchHabits();
            }
            const foundHabit = habits.find(h => String(h.id) === String(habitId));
            if (foundHabit) {
                setHabit(foundHabit);
                
                // Generate streak data for the last 7 days
                const last7Days = Array(7).fill(0).map((_, i) => {
                    const date = new Date();
                    date.setDate(date.getDate() - i);
                    return date.toISOString().split('T')[0];
                }).reverse();
                
                const streakCounts = last7Days.map(date => {
                    return foundHabit.streaks?.some(s => s.date.includes(date) && s.user_completed) ? 1 : 0;
                });
                
                setStreakData(streakCounts);
            }
        };

        loadHabit();
    }, [habitId, habits]);

    const handleToggleCompletion = async () => {
        if (!habit?.id) return;
        
        // Button animation
        checkButtonScale.value = withSpring(0.8, {}, () => {
            checkButtonScale.value = withSpring(1);
        });
        
        await toggleHabitCompletion(habit.id.toString());
    };

    // Calculate completion rate
    const calculateCompletionRate = () => {
        if (!habit?.streaks || habit.streaks.length === 0) return 0;
        
        const totalDays = habit.streaks.length;
        const completedDays = habit.streaks.filter(s => s.user_completed).length;
        
        return Math.round((completedDays / totalDays) * 100);
    };
    
    // Get streak info
    const getStreakInfo = () => {
        if (!habit) return { currentStreak: 0, longestStreak: 0 };
        
        return {
            currentStreak: habit.current_streak_count || 0,
            longestStreak: habit.longest_streak_count || 0
        };
    };
    
    const streakInfo = getStreakInfo();
    const completionRate = calculateCompletionRate();
    
    // Button animation style
    const checkButtonStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: checkButtonScale.value }],
        };
    });

    if (isLoading || !habit) {
        return (
            <SafeAreaView className={`flex-1 ${isDark ? 'bg-[#1a1a1a]' : 'bg-[#f5f9f8]'}`}>
                <StatusBar style={isDark ? 'light' : 'dark'} />
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color="#059669" />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className={`flex-1 ${isDark ? 'bg-[#1a1a1a]' : 'bg-[#f5f9f8]'}`}>
            <StatusBar style={isDark ? 'light' : 'dark'} />

            {/* Header */}
            <Animated.View
                entering={FadeIn.duration(500)}
                className="px-6 pt-4 pb-2 flex-row items-center justify-between"
            >
                <TouchableOpacity
                    onPress={() => router.back()}
                    className={`p-2 rounded-full ${isDark ? 'bg-gray-800' : 'bg-white'}`}
                    activeOpacity={0.7}
                >
                    <Feather name="arrow-left" size={20} color={isDark ? '#e2e8f0' : '#0f172a'} />
                </TouchableOpacity>

                <View className="flex-row">
                    <TouchableOpacity
                        onPress={handleShareHabit}
                        className={`p-2 rounded-full mr-3 ${isDark ? 'bg-gray-800' : 'bg-white'}`}
                        activeOpacity={0.7}
                    >
                        <Feather name="share-2" size={20} color={isDark ? '#e2e8f0' : '#0f172a'} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={handleEditHabit}
                        className={`p-2 rounded-full ${isDark ? 'bg-gray-800' : 'bg-white'}`}
                        activeOpacity={0.7}
                    >
                        <Feather name="edit-2" size={20} color={isDark ? '#e2e8f0' : '#0f172a'} />
                    </TouchableOpacity>
                </View>
            </Animated.View>

            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 40 }}
            >
                {/* Habit Title */}
                <Animated.View
                    entering={FadeInDown.duration(500).delay(100)}
                    className="px-6 mb-6"
                >
                    <Text className={`text-2xl font-inter-bold ${isDark ? 'text-white' : 'text-[#1e293b]'}`}>
                        {habit.name}
                    </Text>
                    <Text className={`mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {habit.description || 'No description provided'}
                    </Text>
                </Animated.View>

                {/* Progress Circle */}
                <Animated.View
                    entering={FadeInDown.duration(500).delay(200)}
                    className="items-center mb-8"
                >
                    <ProgressCircle
                        progress={habit.streaks ? habit.streaks.filter(s => s.user_completed).length / (habit.streaks.length || 1) : 0}
                        size={160}
                    />
                </Animated.View>

                {/* Stats Cards */}
                <Animated.View
                    entering={FadeInDown.duration(500).delay(300)}
                    className="px-6 mb-6"
                >
                    <Text className={`text-base font-inter-semibold mb-3 ${isDark ? 'text-gray-300' : 'text-[#1e293b]'}`}>
                        STATISTICS
                    </Text>
                    
                    <View className="flex-row gap-4 mb-4">
                        <StatCard 
                            title="Current Streak" 
                            value={streakInfo.currentStreak} 
                            icon="trending-up" 
                            isDark={isDark} 
                        />
                        <StatCard 
                            title="Longest Streak" 
                            value={streakInfo.longestStreak} 
                            icon="award" 
                            isDark={isDark} 
                        />
                    </View>
                    
                    <View className="flex-row gap-4">
                        <StatCard 
                            title="Completion Rate" 
                            value={`${completionRate}%`} 
                            icon="percent" 
                            isDark={isDark} 
                        />
                        <StatCard 
                            title="Days Tracked" 
                            value={habit.streaks?.length || 0} 
                            icon="calendar" 
                            isDark={isDark} 
                        />
                    </View>
                </Animated.View>

                {/* Weekly Progress */}
                <Animated.View
                    entering={FadeInDown.duration(500).delay(400)}
                    className={`mx-6 p-5 rounded-2xl mb-6 ${isDark ? 'bg-gray-800/60' : 'bg-white'} shadow-sm`}
                >
                    <Text className={`text-base font-inter-semibold mb-4 ${isDark ? 'text-white' : 'text-[#1e293b]'}`}>
                        Weekly Progress
                    </Text>
                    
                    <View className="items-center">
                        <StreakChart streakData={streakData} isDark={isDark} />
                    </View>
                </Animated.View>

                {/* Habit History */}
                <Animated.View
                    entering={FadeInDown.duration(500).delay(500)}
                    className={`mx-6 p-5 rounded-2xl mb-6 ${isDark ? 'bg-gray-800/60' : 'bg-white'} shadow-sm`}
                >
                    <Text className={`text-base font-inter-semibold mb-4 ${isDark ? 'text-white' : 'text-[#1e293b]'}`}>
                        Habit History
                    </Text>
                    
                    {habit && habit.streaks && <HabitHeatmap streaks={habit.streaks} />}
                </Animated.View>

                {/* Action Buttons */}
                <View className="px-6 mt-4 flex-row justify-between">
                    <Animated.View style={checkButtonStyle} className="flex-1 mr-3">
                        <TouchableOpacity
                            onPress={handleToggleCompletion}
                            className={`py-4 rounded-xl items-center justify-center ${habit.todayCompleted ? 'bg-emerald-700' : 'bg-[#059669]'}`}
                            activeOpacity={0.8}
                        >
                            <Text className="text-white font-inter-semibold">
                                {habit.todayCompleted ? 'Completed Today' : 'Mark as Completed'}
                            </Text>
                        </TouchableOpacity>
                    </Animated.View>

                    <TouchableOpacity
                        onPress={handleDeleteHabit}
                        className={`p-4 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'} border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}
                        activeOpacity={0.7}
                        disabled={isDeleting}
                    >
                        {isDeleting ? (
                            <ActivityIndicator size="small" color="#ef4444" />
                        ) : (
                            <Feather name="trash-2" size={20} color="#ef4444" />
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default HabitDetailScreen;