import { useAuthStore } from '@/lib/stores/authStore';
import { useThemeStore } from '@/lib/stores/themeStore';
import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, SlideInRight } from 'react-native-reanimated';
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
  const isDark = useThemeStore((state) => state.isDark);
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
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
      {/* Modern Minimal Header */}
      <Animated.View
        entering={FadeIn.duration(500)}
        className="px-6 pt-12 pb-6"
      >
        <View>
          <Text className={`text-lg ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            {getGreeting()},
          </Text>
          <Text className={`text-2xl font-bold capitalize mt-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>
            {userName}
          </Text>
        </View>
      </Animated.View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Today's Habits */}
        <View className="px-6 mb-8">
          <Text className={`text-base font-medium mb-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            TODAY'S HABITS
          </Text>
          {habits.map((habit, index) => (
            <Animated.View
              key={habit.id}
              entering={FadeInDown.delay(index * 100).duration(500)}
              className={`mb-3 rounded-2xl border   ${isDark
                ? 'bg-slate-800 border-slate-700'
                : 'bg-white border-slate-100'
                }`}
            >
              <TouchableOpacity
                onPress={() => toggleHabit(habit.id)}
                className="p-4 flex-row items-center gap-4"
                activeOpacity={0.7}
              >
                <View className={`w-6 h-6 rounded-full border-2 items-center justify-center ${habit.completed
                  ? isDark
                    ? 'bg-emerald-400 border-emerald-400'
                    : 'bg-emerald-500 border-emerald-500'
                  : isDark
                    ? 'border-slate-600'
                    : 'border-slate-300'
                  }`}>
                  {habit.completed && <Feather name="check" size={14} color="white" />}
                </View>
                <View className="flex-1">
                  <Text className={`text-base font-medium ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    {habit.name}
                  </Text>
                  <View className="flex-row items-center gap-2 mt-2">
                    <View className={`flex-1 h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-slate-700' : 'bg-slate-100'
                      }`}>
                      <View
                        className={`h-full rounded-full ${isDark ? 'bg-emerald-400' : 'bg-emerald-500'
                          }`}
                        style={{ width: `${(habit.streak / habit.target) * 100}%` }}
                      />
                    </View>
                    <Text className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {habit.streak}/{habit.target}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>

        {/* Activity Feed */}
        <View className="px-6 pb-6">
          <Text className={`text-base font-medium mb-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            RECENT ACTIVITY
          </Text>
          {notifications.map((notif, index) => (
            <Animated.View
              key={notif.id}
              entering={SlideInRight.delay(index * 100).duration(500)}
              className={`mb-3 p-4 rounded-2xl border ${isDark
                ? 'bg-slate-800 border-slate-700'
                : 'bg-white border-slate-100'
                }`}
            >
              <Text className={isDark ? 'text-white' : 'text-slate-800'}>
                <Text className="font-medium">{notif.user}</Text> completed{' '}
                <Text className="font-medium">{notif.habit}</Text>
              </Text>
              <Text className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {notif.time}
              </Text>
            </Animated.View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}