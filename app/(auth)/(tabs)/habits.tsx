import { useHabitsStore } from '@/lib/stores/habitsStore';
import { useThemeStore } from '@/lib/stores/themeStore';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { RefreshControl, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Text as SvgText } from 'react-native-svg';

type HabitStatus = 'all' | 'active' | 'completed';

// Progress circle component for habit completion
const ProgressCircle = ({ progress, size = 48 }: { progress: number, size?: number }) => {
    const isDark = useThemeStore((state) => state.isDark);
    const circumference = 2 * Math.PI * (size / 2 - 2);
    const strokeDashoffset = circumference * (1 - progress);

    return (
        <View style={{ width: size, height: size }}>
            <Animated.View>
                <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                    {/* Background Circle */}
                    <Circle
                        cx={size / 2}
                        cy={size / 2}
                        r={size / 2 - 2}
                        stroke={isDark ? '#334155' : '#e2e8f0'}
                        strokeWidth="4"
                        fill="none"
                    />
                    {/* Progress Circle */}
                    <Circle
                        cx={size / 2}
                        cy={size / 2}
                        r={size / 2 - 2}
                        stroke="#059669"
                        strokeWidth="4"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        fill="none"
                        transform={`rotate(-90, ${size / 2}, ${size / 2})`}
                    />
                    {/* Percentage Text */}
                    <SvgText
                        x={size / 2}
                        y={size / 2 + 4}
                        fontSize={size / 4}
                        fill={isDark ? 'white' : '#1e293b'}
                        textAnchor="middle"
                        fontWeight="bold"
                    >
                        {Math.round(progress * 100)}%
                    </SvgText>
                </Svg>
            </Animated.View>
        </View>
    );
};

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

    return (
        <SafeAreaView className={`flex-1 ${isDark ? 'bg-[#1a1a1a]' : 'bg-white'}`}>
            <StatusBar style={isDark ? 'light' : 'dark'} />

            {/* Header */}
            <Animated.View
                entering={FadeIn.duration(500)}
                className="px-6 pt-4 pb-4"
            >
                <View className="flex-row justify-between items-center">
                    <Text className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
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

                <Text className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Track and manage your daily habits
                </Text>
            </Animated.View>

            {/* Stats Card */}
            <Animated.View
                entering={FadeInDown.delay(100).duration(500)}
                className={`mx-6 mb-4 p-5 rounded-2xl ${isDark ? 'bg-gray-800/60' : 'bg-[#e6f7f1]'} shadow-sm`}
            >
                <Text className={`text-base font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                    Habit Overview
                </Text>

                <View className="flex-row justify-between">
                    <View className={`px-4 py-3 rounded-xl ${isDark ? 'bg-gray-700/70' : 'bg-white'}`}>
                        <Text className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            Total Habits
                        </Text>
                        <Text className={`text-xl font-bold mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {habits.length}
                        </Text>
                    </View>

                    <View className={`px-4 py-3 rounded-xl ${isDark ? 'bg-gray-700/70' : 'bg-white'}`}>
                        <Text className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            Completed Today
                        </Text>
                        <Text className={`text-xl font-bold mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {habits.filter(h => h.todayCompleted).length}/{habits.length}
                        </Text>
                    </View>
                </View>
            </Animated.View>

            {/* Search Bar */}
            <Animated.View
                entering={FadeInDown.delay(150).duration(500)}
                className="px-6 mb-4"
            >
                <View className={`flex-row items-center px-4 py-3 rounded-xl ${isDark ? 'bg-gray-800/60' : 'bg-gray-100'
                    }`}>
                    <Feather
                        name="search"
                        size={18}
                        color={isDark ? '#94a3b8' : '#64748b'}
                    />
                    <TextInput
                        className={`flex-1 ml-2 ${isDark ? 'text-white' : 'text-gray-800'
                            }`}
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
                <View className={`flex-row p-1 rounded-xl ${isDark ? 'bg-gray-800/40' : 'bg-gray-100'
                    }`}>
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
                            <Text className={`text-center text-sm font-medium capitalize ${activeTab === tab
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
                <Text className={`text-base font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
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
                        className={`p-6 rounded-2xl border items-center ${isDark ? 'bg-gray-800/40 border-gray-700' : 'bg-gray-50 border-gray-100'
                            }`}
                    >
                        <Feather name="calendar" size={50} color="#059669" />
                        <Text className={`text-base font-medium text-center mt-4 ${isDark ? 'text-white' : 'text-gray-800'
                            }`}>
                            No habits found
                        </Text>
                        <Text className={`text-sm text-center mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'
                            }`}>
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
                                <Text className="text-white font-medium">Create Habit</Text>
                            </TouchableOpacity>
                        )}
                    </Animated.View>
                ) : (
                    filteredHabits.map((habit, index) => (
                        <Animated.View
                            key={habit.id}
                            entering={FadeInDown.delay(250 + index * 100).duration(500)}
                            className={`mb-4 p-4 rounded-2xl border shadow-sm ${isDark
                                ? 'bg-gray-800/60 border-gray-700'
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

                                <View className="flex-1">
                                    <Text className={`text-base font-medium ${isDark ? 'text-white' : 'text-gray-800'
                                        }`}>
                                        {habit.name}
                                    </Text>
                                    <Text className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'
                                        }`}>
                                        {habit.frequency} • Streak: {habit.current_streak || 0} days
                                    </Text>

                                    <View className="flex-row items-center gap-2 mt-2">
                                        <View className={`flex-1 h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-gray-700' : 'bg-gray-100'
                                            }`}>
                                            <View
                                                className="h-full rounded-full bg-[#059669]"
                                                style={{
                                                    width: `${Math.min(100, ((habit.current_streak || 0) / (habit.longest_streak > 0 ? habit.longest_streak : 7)) * 100)}%`
                                                }}
                                            />
                                        </View>
                                        <Text className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'
                                            }`}>
                                            {habit.current_streak || 0}/{habit.longest_streak > 0 ? habit.longest_streak : 7}
                                        </Text>
                                    </View>
                                </View>

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