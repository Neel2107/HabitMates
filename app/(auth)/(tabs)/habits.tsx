import { useHabitsStore } from '@/lib/stores/habitsStore';
import { useThemeStore } from '@/lib/stores/themeStore';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { RefreshControl, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

type HabitStatus = 'all' | 'active' | 'completed';

const HabitsScreen = () => {
    const isDark = useThemeStore((state) => state.isDark);
    const [activeTab, setActiveTab] = useState<HabitStatus>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const { habits, isLoading, fetchHabits, toggleHabitCompletion } = useHabitsStore();
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        fetchHabits();
    }, []);

    const onRefresh = React.useCallback(async () => {
        setRefreshing(true);
        try {
            await fetchHabits();
        } finally {
            setRefreshing(false);
        }
    }, [fetchHabits]);

    const filteredHabits = habits
        .filter(habit => {
            if (activeTab === 'active') return !habit.todayCompleted;
            if (activeTab === 'completed') return habit.todayCompleted;
            return true;
        })
        .filter(habit =>
            habit.name.toLowerCase().includes(searchQuery.toLowerCase())
        );

    const navigateToHabitDetail = (habitId: string) => {
        console.log('Navigating to habit detail:', habitId);
        router.push(`/(auth)/habit-detail?id=${habitId}`);
    };

    // Calculate completion percentage
    const getCompletionPercentage = () => {
        if (habits.length === 0) return 0;
        return Math.round((habits.filter(h => h.todayCompleted).length / habits.length) * 100);
    };

    return (
        <SafeAreaView className={`flex-1 ${isDark ? 'bg-[#1a1a1a]' : 'bg-[#f5f9f8]'}`}>
            <StatusBar style={isDark ? 'light' : 'dark'} />

            {/* Header */}
            <Animated.View
                entering={FadeIn.duration(500)}
                className="px-6 pt-4 pb-4"
            >
                <View className="flex-row justify-between items-center">
                    <Text className={`text-2xl font-inter-bold ${isDark ? 'text-white' : 'text-[#1e293b]'}`}>
                        My Habits
                    </Text>

                    <TouchableOpacity
                        onPress={() => router.push('/(auth)/add-habit')}
                        className="p-2 rounded-full bg-[#059669]"
                        activeOpacity={0.8}
                    >
                        <Feather name="plus" size={20} color="white" />
                    </TouchableOpacity>
                </View>

                <Text className={`text-sm mt-1 font-inter-regular ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Track and manage your daily habits
                </Text>
            </Animated.View>

            {/* Search Bar */}
            <Animated.View
                entering={FadeInDown.delay(150).duration(500)}
                className="px-6 mb-4"
            >
                <View className={`flex-row items-center px-4 py-3 rounded-xl ${isDark ? 'bg-zinc-800/60' : 'bg-white'} border ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
                    <Feather
                        name="search"
                        size={18}
                        color={isDark ? '#94a3b8' : '#64748b'}
                    />
                    <TextInput
                        className={`flex-1 ml-2 font-inter-regular ${isDark ? 'text-white' : 'text-gray-800'}`}
                        placeholder="Search habits..."
                        placeholderTextColor={isDark ? '#94a3b8' : '#64748b'}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
            </Animated.View>

            {/* Filter Tabs */}
            <Animated.View
                entering={FadeInDown.delay(200).duration(500)}
                className="px-6 mb-4"
            >
                <View className={`flex-row p-1 rounded-xl ${isDark ? 'bg-zinc-800/40' : 'bg-zinc-100'}`}>
                    {(['all', 'active', 'completed'] as HabitStatus[]).map((tab) => (
                        <TouchableOpacity
                            key={tab}
                            onPress={() => setActiveTab(tab)}
                            className={`flex-1 py-2.5 rounded-lg ${activeTab === tab
                                ? 'bg-[#059669]'
                                : ''
                                }`}
                            activeOpacity={0.7}
                        >
                            <Text className={`text-center text-sm font-inter-medium capitalize ${activeTab === tab
                                ? 'text-white'
                                : isDark ? 'text-gray-300' : 'text-gray-600'
                                }`}>
                                {tab}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </Animated.View>

            {/* Habits List Section Title */}
            <View className="px-6 mb-2">
                <Text className={`text-base font-inter-semibold ${isDark ? 'text-gray-300' : 'text-[#1e293b]'}`}>
                    {activeTab.toUpperCase()} HABITS
                </Text>
            </View>

            {/* Habits List */}
            <ScrollView
                className="flex-1 px-6"
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={isDark ? '#6ee7b7' : '#059669'}
                        colors={['#059669']}
                        progressBackgroundColor={isDark ? '#1e293b' : '#f1f5f9'}
                    />
                }
            >
                {filteredHabits.length === 0 ? (
                    <Animated.View
                        entering={FadeIn.duration(500)}
                        className={`p-6 rounded-2xl border items-center ${isDark ? 'bg-zinc-800/40 border-gray-700' : 'bg-white border-gray-100'}`}
                    >
                        <Feather name="calendar" size={50} color="#059669" />
                        <Text className={`text-base font-inter-medium text-center mt-4 ${isDark ? 'text-white' : 'text-[#1e293b]'}`}>
                            No habits found
                        </Text>
                        <Text className={`text-sm text-center mt-1 font-inter-regular ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            {activeTab === 'all'
                                ? "You haven't created any habits yet"
                                : activeTab === 'active'
                                    ? "All habits are completed for today!"
                                    : "You haven't completed any habits today"
                            }
                        </Text>
                        {activeTab === 'all' && (
                            <TouchableOpacity
                                className="mt-4 px-5 py-3 bg-[#059669] rounded-xl"
                                activeOpacity={0.8}
                                onPress={() => router.push('/(auth)/add-habit')}
                            >
                                <Text className="text-white font-inter-medium">Create Habit</Text>
                            </TouchableOpacity>
                        )}
                    </Animated.View>
                ) : (
                    filteredHabits.map((habit, index) => (
                        <Animated.View
                            key={habit.id}
                            entering={FadeInDown.delay(250 + index * 100).duration(500)}
                            className={`mb-4 p-4 rounded-2xl border shadow-sm ${isDark
                                ? 'bg-zinc-800/60 border-gray-700'
                                : 'bg-white border-gray-100'
                                }`}
                        >
                            <View className="flex-row items-center">
                                <TouchableOpacity
                                    onPress={() => habit.id && toggleHabitCompletion(habit.id.toString())}
                                    className="mr-3"
                                >
                                    <View className={`w-7 h-7 rounded-full border-2 items-center justify-center ${habit.todayCompleted
                                        ? 'bg-[#059669] border-[#059669]'
                                        : isDark
                                            ? 'border-gray-600'
                                            : 'border-gray-300'
                                        }`}>
                                        {habit.todayCompleted && <Feather name="check" size={14} color="white" />}
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    className="flex-1"
                                    activeOpacity={0.7}
                                    onPress={() => navigateToHabitDetail(habit.id?.toString() || '')}
                                >
                                    <View>
                                        <Text className={`text-base font-inter-medium ${isDark ? 'text-white' : 'text-[#1e293b]'}`}>
                                            {habit.name}
                                        </Text>
                                        <Text className={`text-xs mt-1 font-inter-regular ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                            {habit.frequency} • Streak: {habit.current_streak || 0} days
                                        </Text>

                                        <View className="flex-row items-center gap-2 mt-2">
                                            <View className={`flex-1 h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-zinc-700' : 'bg-zinc-100'}`}>
                                                <View
                                                    className="h-full rounded-full bg-[#059669]"
                                                    style={{
                                                        width: `${Math.min(100, ((habit.current_streak || 0) / (habit.longest_streak > 0 ? habit.longest_streak : 7)) * 100)}%`
                                                    }}
                                                />
                                            </View>
                                            <Text className={`text-xs font-inter-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                                {habit.current_streak || 0}/{habit.longest_streak > 0 ? habit.longest_streak : 7}
                                            </Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    className="ml-2 p-2"
                                    activeOpacity={0.7}
                                    onPress={() => router.push({
                                        pathname: '/(auth)/add-habit',
                                        params: { id: habit.id }
                                    })}
                                >
                                    <Feather
                                        name="edit-2"
                                        size={18}
                                        color={isDark ? '#94a3b8' : '#64748b'}
                                    />
                                </TouchableOpacity>
                            </View>
                        </Animated.View>
                    ))
                )}
                <View className="h-20" />
            </ScrollView>
        </SafeAreaView>
    );
};

export default HabitsScreen;