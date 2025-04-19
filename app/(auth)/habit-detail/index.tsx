import { CompletionOverlay } from '@/components/habit/CompletionOverlay';
import { HabitHeader } from '@/components/habit/HabitHeader';
import { ProgressCircle } from '@/components/habit/ProgressCircle';
import { StatCard } from '@/components/habit/StatCard';
import { StreakChart } from '@/components/habit/StreakChart';
import { HabitHeatmap } from '@/components/HabitHeatmap';
import { CustomButton } from '@/components/ui/CustomButton';
import { handleError } from '@/lib/helpers';
import { useHabitsStore } from '@/lib/stores/habitsStore';
import { useThemeStore } from '@/lib/stores/themeStore';
import { Habit } from '@/lib/types';
import { Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, Share, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { StreakRescue } from '@/components/habit/StreakRescue';
// import { StreakVisualization } from '@/components/habit/StreakVisualization';
import { useStreaks } from '@/lib/hooks/useStreaks';

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

    const { streakInfo, isLoading: streakLoading, refreshStreakInfo } = useStreaks(habit?.id);


    const needsRescue = useMemo(() => {
        if (!habit || !streakInfo) return false;

        // If current streak is 0 but was previously > 0, might need rescue
        if (streakInfo.currentStreak === 0 && habit.current_streak_count > 0) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toISOString().split('T')[0];

            // Check if there's no completion for yesterday
            const hasYesterdayCompletion = habit.streaks?.some(
                s => s.date === yesterdayStr && s.user_completed
            );

            return !hasYesterdayCompletion;
        }

        return false;
    }, [habit, streakInfo]);

    // Animation values
    const checkButtonScale = useSharedValue(1);
    const completionOpacity = useSharedValue(0);
    const completionScale = useSharedValue(0.5);

    // Add the handleShareHabit function
    const handleShareHabit = async () => {
        if (!habit) return;

        try {
            await Share.share({
                message: `I'm tracking my habit "${habit.name}" with HabitMates! Join me in building better habits.`,
                title: 'Share Habit'
            });
        } catch (error) {
            handleError(error);
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

        try {
            // Enhanced button animation
            checkButtonScale.value = withSpring(0.8, {}, () => {
                checkButtonScale.value = withSpring(1);
            });

            // Only show completion animation if marking as completed (not uncompleting)
            if (!habit.todayCompleted) {
                // Show completion animation
                completionOpacity.value = withTiming(1, { duration: 300 });
                completionScale.value = withSpring(1.2, { damping: 12 });

                // Hide after a delay
                setTimeout(() => {
                    completionOpacity.value = withTiming(0, { duration: 300 });
                    completionScale.value = withTiming(0.5);
                }, 1500);
            }

            // Wait for the toggle to complete before proceeding
            await toggleHabitCompletion(habit.id.toString());
        } catch (error) {
            handleError(error);
            Alert.alert('Error', 'Failed to update habit completion status');
        }
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



    // Button animation style
    const checkButtonStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: checkButtonScale.value }],
        };
    });


    const habitStreakInfo = getStreakInfo();
    const completionRate = calculateCompletionRate();

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

            {/* Completion Animation Overlay */}
            <CompletionOverlay
                opacity={completionOpacity}
                scale={completionScale}
                isDark={isDark}
            />

            {/* Header */}
            <HabitHeader
                isDark={isDark}
                onShare={handleShareHabit}
                onEdit={handleEditHabit}
            />

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


                    {needsRescue && (
                        <StreakRescue
                            habitId={habit.id}
                            onRescueComplete={() => {
                                refreshStreakInfo?.();
                                fetchHabits();
                            }}
                        />
                    )}

                    {/* {habit && streakInfo && (
                        <StreakVisualization
                            streakInfo={streakInfo}
                            streaks={habit.streaks || []}
                            frequency={habit.frequency}
                        />
                    )} */}

                    <View className="flex-row gap-4 mb-4">
                        <StatCard
                            title="Current Streak"
                            value={habitStreakInfo.currentStreak}
                            icon="trending-up"
                            isDark={isDark}
                        />
                        <StatCard
                            title="Longest Streak"
                            value={habitStreakInfo.longestStreak}
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
                    className={`mx-6 p-5 rounded-2xl mb-6 ${isDark ? 'bg-zinc-800/60' : 'bg-white'} shadow-sm`}
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
                    className={`mx-6 p-5 rounded-2xl mb-6 ${isDark ? 'bg-zinc-800/60' : 'bg-white'} shadow-sm`}
                >
                    <Text className={`text-base font-inter-semibold mb-4 ${isDark ? 'text-white' : 'text-[#1e293b]'}`}>
                        Habit History
                    </Text>

                    {habit && habit.streaks && <HabitHeatmap streaks={habit.streaks} />}
                </Animated.View>

                {/* Action Buttons */}
                <View className="px-6 mt-4 flex-row gap-4">
                    <Animated.View style={checkButtonStyle} className="flex-1">
                        <CustomButton
                            onPress={handleToggleCompletion}
                            title={habit.todayCompleted ? "Completed Today" : "Mark as Completed"}
                            isLoading={false}
                            disabled={false}
                            backgroundColor={habit.todayCompleted ? "#047857" : "#059669"}
                            textColor="white"
                            loadingText="Marking..."
                            icon={habit.todayCompleted ? "check-circle" : "check"}
                        />
                    </Animated.View>

                    <TouchableOpacity
                        onPress={handleDeleteHabit}
                        className={`p-4 rounded-xl flex items-center justify-center ${isDark ? 'bg-zinc-800' : 'bg-white'} border ${isDark ? 'border-zinc-700' : 'border-zinc-200'}`}
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
