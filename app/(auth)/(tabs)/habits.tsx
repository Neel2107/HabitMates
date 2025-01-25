import { useThemeStore } from '@/lib/stores/themeStore';
import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

type HabitStatus = 'all' | 'active' | 'completed';
type Habit = {
    id: number;
    name: string;
    frequency: string;
    streak: number;
    target: number;
    isCompleted: boolean;
};

const mockHabits: Habit[] = [
    { id: 1, name: 'Daily Meditation', frequency: 'Daily', streak: 5, target: 7, isCompleted: false },
    { id: 2, name: 'Read Books', frequency: 'Daily', streak: 12, target: 14, isCompleted: false },
    { id: 3, name: 'Gym Workout', frequency: '3x/week', streak: 2, target: 3, isCompleted: true },
    { id: 4, name: 'Learn Spanish', frequency: 'Daily', streak: 8, target: 10, isCompleted: false },
];

const HabitsScreen = () => {
    const isDark = useThemeStore((state) => state.isDark);
    const [activeTab, setActiveTab] = useState<HabitStatus>('all');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredHabits = mockHabits
        .filter(habit => {
            if (activeTab === 'active') return !habit.isCompleted;
            if (activeTab === 'completed') return habit.isCompleted;
            return true;
        })
        .filter(habit =>
            habit.name.toLowerCase().includes(searchQuery.toLowerCase())
        );

    const ProgressCircle = ({ progress }: { progress: number }) => (
        <View className="relative w-10 h-10">
            <View className={`absolute inset-0 rounded-full border-2 ${isDark ? 'border-border-dark' : 'border-border-light'
                }`} />
            <View
                className={`absolute inset-0 rounded-full border-2 ${isDark ? 'border-brand-primary-dark' : 'border-brand-primary'
                    }`}
                style={{
                    borderLeftColor: 'transparent',
                    borderBottomColor: 'transparent',
                    transform: [{ rotate: `${(progress * 360) - 90}deg` }] // Subtract 90 degrees to start from top
                }}
            />
            <View className="absolute inset-0 items-center justify-center">
                <Text className={`text-xs font-medium ${isDark ? 'text-content-secondary-dark' : 'text-content-secondary-light'
                    }`}>
                    {Math.round(progress * 100)}%
                </Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView className={`flex-1 ${isDark ? 'bg-app-dark' : 'bg-app-light'}`}>
            <Animated.View
                entering={FadeIn.duration(500)}
                className="px-6 pt-12 pb-6"
            >
                <View className="flex-row items-center justify-between">
                    <View>
                        <Text className={`text-2xl font-bold ${isDark ? 'text-content-primary-dark' : 'text-content-primary-light'
                            }`}>
                            My Habits
                        </Text>
                        <Text className={`text-sm mt-1 ${isDark ? 'text-content-secondary-dark' : 'text-content-secondary-light'
                            }`}>
                            {mockHabits.length} habits in progress
                        </Text>
                    </View>
                    <TouchableOpacity
                        className={`w-10 h-10 rounded-full items-center justify-center ${isDark ? 'bg-brand-primary-dark' : 'bg-brand-primary'
                            }`}
                        activeOpacity={0.8}
                    >
                        <Feather name="plus" size={20} color="white" />
                    </TouchableOpacity>
                </View>

                {/* Search Bar */}
                <View className={`mt-6 flex-row items-center rounded-xl border px-4 ${isDark
                    ? 'bg-app-card-dark border-border-dark'
                    : 'bg-app-card-light border-border-light'
                    }`}>
                    <Feather
                        name="search"
                        size={18}
                        color={isDark ? '#94a3b8' : '#64748b'}
                    />
                    <TextInput
                        placeholder="Search habits..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        className={`flex-1 py-3 px-2 text-base ${isDark ? 'text-content-primary-dark' : 'text-content-primary-light'
                            }`}
                        placeholderTextColor={isDark ? '#94a3b8' : '#64748b'}
                    />
                </View>

                {/* Tabs */}
                <View className={`flex-row mt-6 p-1 rounded-xl ${isDark ? 'bg-app-card-dark' : 'bg-app-card-light'
                    }`}>
                    {(['all', 'active', 'completed'] as HabitStatus[]).map((tab) => (
                        <TouchableOpacity
                            key={tab}
                            onPress={() => setActiveTab(tab)}
                            className={`flex-1 py-2 rounded-lg ${activeTab === tab
                                ? isDark
                                    ? 'bg-border-dark'
                                    : 'bg-gray-50  '
                                : ''
                                }`}
                        >
                            <Text className={`text-center text-sm font-medium capitalize ${activeTab === tab
                                ? isDark
                                    ? 'text-brand-primary-dark'
                                    : 'text-brand-primary'
                                : isDark
                                    ? 'text-content-secondary-dark'
                                    : 'text-content-secondary-light'
                                }`}>
                                {tab}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </Animated.View>

            {/* Habits List */}
            <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
                {filteredHabits.map((habit, index) => (
                    <Animated.View
                        key={habit.id}
                        entering={FadeInDown.delay(index * 100).duration(500)}
                        className={`mb-4 p-4 rounded-2xl border   ${isDark
                            ? 'bg-app-card-dark border-border-dark'
                            : 'bg-app-card-light border-border-light'
                            }`}
                    >
                        <View className="flex-row items-center justify-between">
                            <View className="flex-1">
                                <Text className={`text-base font-semibold ${isDark ? 'text-content-primary-dark' : 'text-content-primary-light'
                                    }`}>
                                    {habit.name}
                                </Text>
                                <Text className={`text-sm mt-0.5 ${isDark ? 'text-content-secondary-dark' : 'text-content-secondary-light'
                                    }`}>
                                    {habit.frequency}
                                </Text>
                            </View>
                            <ProgressCircle progress={habit.streak / habit.target} />
                        </View>

                        <TouchableOpacity
                            className="mt-4 flex-row items-center"
                            activeOpacity={0.7}
                        >
                            <Feather
                                name="edit-2"
                                size={14}
                                color={isDark ? '#818cf8' : '#6366f1'}
                            />
                            <Text className={`font-medium text-sm ml-1.5 ${isDark ? 'text-brand-primary-dark' : 'text-brand-primary'
                                }`}>
                                Edit
                            </Text>
                        </TouchableOpacity>
                    </Animated.View>
                ))}
                <View className="h-6" />
            </ScrollView>
        </SafeAreaView>
    );
};

export default HabitsScreen;