import { useAuthStore } from '@/lib/stores/authStore';
import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn, FadeInRight, SlideInRight } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const mockHabits = [
  { id: 1, name: 'Morning Workout', streak: 5, target: 7, completed: false },
  { id: 2, name: 'Read 30 minutes', streak: 12, target: 14, completed: true },
  { id: 3, name: 'Meditate', streak: 3, target: 5, completed: false },
];

const notifications = [
  { id: 1, user: 'Alex', habit: 'Morning Run', time: '2h ago' },
  { id: 2, user: 'Sarah', habit: 'Meditation', time: '4h ago' },
];

export default function HomePage() {
  const [habits, setHabits] = useState(mockHabits);
  const session = useAuthStore((state) => state.session);
  const userName = session?.user?.email?.split('@')[0] || 'User';

  const toggleHabit = (id: number) => {
    setHabits(habits.map(habit =>
      habit.id === id ? { ...habit, completed: !habit.completed } : habit
    ));
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <Animated.View
        entering={FadeIn.duration(500)}
        className="px-6 py-6 bg-indigo-500 dark:bg-indigo-600"
      >
        <Text className="text-white text-lg font-medium">{getGreeting()},</Text>
        <Text className="text-white text-3xl font-bold capitalize">{userName}</Text>
      </Animated.View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Today's Habits */}
        <View className="p-6">
          <Text className="text-xl font-semibold mb-4 text-slate-800 dark:text-white">
            Today's Habits
          </Text>
          {habits.map((habit, index) => (
            <Animated.View
              key={habit.id}
              entering={FadeInRight.delay(index * 100).duration(500)}
              className="bg-white dark:bg-slate-800 mb-4 p-4 rounded-2xl border border-slate-200 dark:border-slate-700"
            >
              <TouchableOpacity
                onPress={() => toggleHabit(habit.id)}
                className="flex-row items-center space-x-4"
              >
                <View className={`w-6 h-6 rounded-full border-2 items-center justify-center
                  ${habit.completed 
                    ? 'bg-indigo-500 border-indigo-500 dark:bg-indigo-400 dark:border-indigo-400' 
                    : 'border-slate-300 dark:border-slate-600'}`}
                >
                  {habit.completed && <Feather name="check" size={16} color="white" />}
                </View>
                <View className="flex-1">
                  <Text className="text-lg font-medium text-slate-800 dark:text-white">
                    {habit.name}
                  </Text>
                  <View className="flex-row items-center space-x-2 mt-1">
                    <View className="flex-1 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                      <View
                        className="h-full bg-indigo-500 dark:bg-indigo-400 rounded-full"
                        style={{ width: `${(habit.streak / habit.target) * 100}%` }}
                      />
                    </View>
                    <Text className="text-slate-500 dark:text-slate-400 font-medium">
                      {habit.streak}/{habit.target} days
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>

        {/* Notifications */}
        <View className="px-6 pb-20">
          <Text className="text-xl font-semibold mb-4 text-slate-800 dark:text-white">
            Activity
          </Text>
          {notifications.map((notif, index) => (
            <Animated.View
              key={notif.id}
              entering={SlideInRight.delay(index * 100).duration(500)}
              className="bg-white dark:bg-slate-800 mb-3 p-4 rounded-2xl border border-slate-200 dark:border-slate-700"
            >
              <Text className="text-slate-800 dark:text-white">
                <Text className="font-semibold">{notif.user}</Text> completed{' '}
                <Text className="font-semibold">{notif.habit}</Text>
              </Text>
              <Text className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                {notif.time}
              </Text>
            </Animated.View>
          ))}
        </View>
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
}