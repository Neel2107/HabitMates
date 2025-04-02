import { useHabitsStore } from '@/lib/stores/habitsStore';
import { useThemeStore } from '@/lib/stores/themeStore';
import { Habit } from '@/lib/types';
import { Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, Share, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Text as SvgText } from 'react-native-svg';

// Progress circle component for habit completion
const ProgressCircle = ({ progress, size = 120 }: { progress: number, size?: number }) => {
    const isDark = useThemeStore((state) => state.isDark);
    const circumference = 2 * Math.PI * (size / 2 - 4);
    const strokeDashoffset = circumference * (1 - progress);

    return (
        <View style={{ width: size, height: size }}>
            <Animated.View>
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

// Calendar day component to visualize streak history
const CalendarDay = ({
    date,
    isCompleted,
    isToday
}: {
    date: Date;
    isCompleted?: boolean;
    isToday?: boolean;
}) => {
    const isDark = useThemeStore((state) => state.isDark);
    const dayNumber = date.getDate();
    const dayName = ['S', 'M', 'T', 'W', 'T', 'F', 'S'][date.getDay()];

    return (
        <View className="items-center mx-1">
            <Text className={`text-xs mb-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {dayName}
            </Text>
            <View
                className={`w-10 h-10 rounded-full items-center justify-center ${isToday
                    ? 'border-2 border-[#059669]'
                    : ''
                    } ${isCompleted
                        ? 'bg-[#059669]'
                        : isDark ? 'bg-gray-800' : 'bg-gray-100'
                    }`}
            >
                <Text
                    className={`font-medium ${isCompleted
                        ? 'text-white'
                        : isDark ? 'text-white' : 'text-gray-800'
                        }`}
                >
                    {dayNumber}
                </Text>
            </View>
        </View>
    );
};

const HabitDetailScreen = () => {
    const { id } = useLocalSearchParams();
    const habitId = Array.isArray(id) ? id[0] : id;
    const isDark = useThemeStore((state) => state.isDark);
    const navigation = useNavigation();
    const { habits, isLoading, fetchHabits, toggleHabitCompletion, deleteHabit } = useHabitsStore();
    const [habit, setHabit] = useState<Habit | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Fetch habit data
    useEffect(() => {
        const loadHabit = async () => {
            console.log('Received habitId:', habitId);
            console.log('Habits array length:', habits.length);

            if (!habits.length) {
                await fetchHabits();
            }

            const foundHabit = habits.find(h => String(h.id) === String(habitId));
            console.log('Found habit:', foundHabit ? foundHabit.name : 'Not found');

            if (foundHabit) {
                setHabit(foundHabit);
            }
        };

        loadHabit();
    }, [habitId, habits]);

    // Generate dummy streak data for the calendar view
    // In a real app, this would come from the database
    const getPastSevenDays = () => {
        const days = [];
        const today = new Date();

        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(today.getDate() - i);
            days.push({
                date,
                isCompleted: i === 0 ? habit?.todayCompleted : Math.random() > 0.3,
                isToday: i === 0
            });
        }

        return days;
    };

    const handleToggleCompletion = async () => {
        if (!habit?.id) return;
        await toggleHabitCompletion(habit.id.toString());
    };

    const handleShareHabit = async () => {
        try {
            await Share.share({
                message: `Check out my habit "${habit?.name}" on HabitMates! I'm on a ${habit?.current_streak || 0} day streak.`,
            });
        } catch (error) {
            console.error('Error sharing habit:', error);
        }
    };

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

    const handleInvitePartner = () => {
        Alert.alert(
            'Partner Invitation',
            'This feature is coming soon! You\'ll be able to invite friends to join this habit.',
            [{ text: 'OK' }]
        );
    };

    if (isLoading || !habit) {
        return (
            <SafeAreaView className={`flex-1 ${isDark ? 'bg-[#1a1a1a]' : 'bg-white'}`}>
                <StatusBar style={isDark ? 'light' : 'dark'} />
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color="#059669" />
                    <Text className={`mt-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        Loading habit details...
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className={`flex-1 ${isDark ? 'bg-[#1a1a1a]' : 'bg-white'}`}>
            <StatusBar style={isDark ? 'light' : 'dark'} />

            {/* Header with back button */}
            <View className="px-6 pt-4 pb-2 flex-row justify-between items-center">
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    className="p-2"
                >
                    <Feather
                        name="arrow-left"
                        size={24}
                        color={isDark ? 'white' : 'black'}
                    />
                </TouchableOpacity>

                <View className="flex-row">
                    <TouchableOpacity
                        onPress={handleShareHabit}
                        className="p-2 mr-2"
                    >
                        <Feather
                            name="share-2"
                            size={22}
                            color={isDark ? '#94a3b8' : '#64748b'}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={handleEditHabit}
                        className="p-2 mr-2"
                    >
                        <Feather
                            name="edit-2"
                            size={22}
                            color={isDark ? '#94a3b8' : '#64748b'}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={handleDeleteHabit}
                        disabled={isDeleting}
                        className="p-2"
                    >
                        <Feather
                            name="trash-2"
                            size={22}
                            color={isDeleting ? (isDark ? '#475569' : '#94a3b8') : (isDark ? '#ef4444' : '#ef4444')}
                        />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Habit Title Section */}
                <Animated.View
                    entering={FadeIn.duration(500)}
                    className="px-6 mb-6"
                >
                    <Text className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {habit.name}
                    </Text>
                    <Text className={`mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {habit.frequency} habit • {habit.is_public ? 'Public' : 'Private'}
                    </Text>
                </Animated.View>

                {/* Statistics Cards */}
                <Animated.View
                    entering={FadeInDown.delay(100).duration(500)}
                    className="px-6 mb-6 flex-row justify-between"
                >
                    <View className={`flex-1 p-4 rounded-2xl mr-3 ${isDark ? 'bg-gray-800/60' : 'bg-[#e6f7f1]'}`}>
                        <Text className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            Current Streak
                        </Text>
                        <Text className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {habit.current_streak || 0} days
                        </Text>
                    </View>

                    <View className={`flex-1 p-4 rounded-2xl ${isDark ? 'bg-gray-800/60' : 'bg-[#e6f7f1]'}`}>
                        <Text className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            Longest Streak
                        </Text>
                        <Text className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {habit.longest_streak || 0} days
                        </Text>
                    </View>
                </Animated.View>

                {/* Progress Circle */}
                <Animated.View
                    entering={FadeInDown.delay(200).duration(500)}
                    className="items-center py-4 mb-4"
                >
                    <ProgressCircle
                        progress={habit.current_streak ? Math.min(1, habit.current_streak / 30) : 0}
                    />
                </Animated.View>

                {/* Description Card */}
                {habit.description && (
                    <Animated.View
                        entering={FadeInDown.delay(300).duration(500)}
                        className={`mx-6 mb-6 p-5 rounded-2xl ${isDark ? 'bg-gray-800/60' : 'bg-white'} border ${isDark ? 'border-gray-700' : 'border-gray-100'}`}
                    >
                        <Text className={`text-base font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                            Description
                        </Text>
                        <Text className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                            {habit.description || 'No description provided.'}
                        </Text>
                    </Animated.View>
                )}

                {/* Weekly Calendar View */}
                <Animated.View
                    entering={FadeInDown.delay(400).duration(500)}
                    className={`mx-6 mb-6 p-5 rounded-2xl ${isDark ? 'bg-gray-800/60' : 'bg-white'} border ${isDark ? 'border-gray-700' : 'border-gray-100'}`}
                >
                    <Text className={`text-base font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                        This Week
                    </Text>

                    <View className="flex-row justify-between">
                        {getPastSevenDays().map((day, index) => (
                            <CalendarDay
                                key={index}
                                date={day.date}
                                isCompleted={day.isCompleted}
                                isToday={day.isToday}
                            />
                        ))}
                    </View>
                </Animated.View>

                {/* Partner Section */}
                <Animated.View
                    entering={FadeInDown.delay(500).duration(500)}
                    className={`mx-6 mb-6 p-5 rounded-2xl ${isDark ? 'bg-gray-800/60' : 'bg-white'} border ${isDark ? 'border-gray-700' : 'border-gray-100'}`}
                >
                    <Text className={`text-base font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                        Accountability Partner
                    </Text>

                    {habit.partner_id ? (
                        <View className="flex-row items-center">
                            <View className="w-12 h-12 rounded-full bg-[#059669] items-center justify-center">
                                <Text className="text-white font-bold">JP</Text>
                            </View>
                            <View className="ml-3 flex-1">
                                <Text className={`font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>
                                    Jane Partner
                                </Text>
                                <Text className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                    Joined 7 days ago
                                </Text>
                            </View>
                            <TouchableOpacity className="p-2">
                                <Feather
                                    name="message-circle"
                                    size={22}
                                    color="#059669"
                                />
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View className="items-center py-4">
                            <Feather
                                name="users"
                                size={40}
                                color="#059669"
                            />
                            <Text className={`text-center mt-3 mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                                No partner yet
                            </Text>
                            <Text className={`text-center text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                Invite a partner to increase your accountability
                            </Text>
                            <TouchableOpacity
                                onPress={handleInvitePartner}
                                className="px-4 py-2 bg-[#059669] rounded-lg"
                            >
                                <Text className="text-white font-medium">Invite Partner</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </Animated.View>

                {/* Mark Complete Button */}
                <View className="px-6 pb-10">
                    <TouchableOpacity
                        onPress={handleToggleCompletion}
                        className={`py-4 rounded-xl ${habit.todayCompleted
                            ? isDark ? 'bg-gray-700' : 'bg-gray-200'
                            : 'bg-[#059669]'
                            }`}
                    >
                        <View className="flex-row items-center justify-center">
                            <Feather
                                name={habit.todayCompleted ? "check" : "check"}
                                size={20}
                                color={habit.todayCompleted ? (isDark ? "#94a3b8" : "#64748b") : "white"}
                            />
                            <Text className={`ml-2 font-semibold ${habit.todayCompleted
                                ? isDark ? 'text-gray-400' : 'text-gray-600'
                                : 'text-white'
                                }`}>
                                {habit.todayCompleted ? "Completed Today" : "Mark as Complete"}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default HabitDetailScreen; 