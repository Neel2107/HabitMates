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
        <View className="w-12 h-12 rounded-full border-4 border-slate-100 dark:border-slate-700 items-center justify-center">
            <View
                className="absolute w-12 h-12 rounded-full border-4 border-indigo-500 dark:border-indigo-400"
                style={{
                    borderLeftColor: 'transparent',
                    borderBottomColor: 'transparent',
                    transform: [{ rotate: `${progress * 360}deg` }]
                }}
            />
            <Text className="text-sm font-medium text-slate-600 dark:text-slate-300">
              {Math.round(progress * 100)}%
            </Text>
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-900">
            <Animated.View
                entering={FadeIn.duration(500)}
                className="px-6 pt-6"
            >
                <Text className="text-2xl font-bold text-slate-800 dark:text-white mb-6">
                    My Habits
                </Text>

                {/* Search Bar */}
                <View className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 mb-6 flex-row items-center px-4">
                    <Feather name="search" size={20} color="#64748b" />
                    <TextInput
                        placeholder="Search habits..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        className="flex-1 py-3 px-2 text-slate-800 dark:text-white"
                        placeholderTextColor="#94a3b8"
                    />
                </View>

                {/* Tabs */}
                <View className="flex-row bg-slate-100 dark:bg-slate-800 p-1 rounded-xl mb-6">
                    {(['all', 'active', 'completed'] as HabitStatus[]).map((tab) => (
                        <TouchableOpacity
                            key={tab}
                            onPress={() => setActiveTab(tab)}
                            className={`flex-1 py-2 rounded-lg ${activeTab === tab ? 'bg-white dark:bg-slate-700' : ''
                                }`}
                        >
                            <Text className={`text-center font-medium capitalize ${activeTab === tab
                                ? 'text-indigo-500 dark:text-indigo-400'
                                : 'text-slate-500 dark:text-slate-400'
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
                        className="bg-white dark:bg-slate-800 p-4 rounded-2xl mb-4 border border-slate-200 dark:border-slate-700"
                    >
                        <View className="flex-row items-center justify-between">
                            <View className="flex-1">
                                <Text className="text-lg font-semibold text-slate-800 dark:text-white">
                                    {habit.name}
                                </Text>
                                <Text className="text-slate-500 dark:text-slate-400">
                                    {habit.frequency}
                                </Text>
                            </View>
                            <ProgressCircle progress={habit.streak / habit.target} />
                        </View>

                        <View className="flex-row mt-4">
                            <TouchableOpacity
                                className="flex-row items-center"
                                activeOpacity={0.7}
                            >
                                <Feather name="edit-2" size={16} color="#6366f1" />
                                <Text className="text-indigo-500 dark:text-indigo-400 font-medium ml-1">
                                    Edit
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                ))}
                <View className="h-20" />
            </ScrollView>

            {/* FAB */}
            <TouchableOpacity
                className="absolute bottom-6 right-6 w-14 h-14 bg-indigo-500 dark:bg-indigo-600 rounded-full items-center justify-center shadow-lg"
                activeOpacity={0.9}
            >
                <Feather name="plus" size={24} color="white" />
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default HabitsScreen;