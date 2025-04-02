import { useAuthStore } from '@/lib/stores/authStore';
import { useHabitsStore } from '@/lib/stores/habitsStore';
import { useThemeStore } from '@/lib/stores/themeStore';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, SlideInRight } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

// Custom SVG icons
const UserAvatar = ({ size = 48, color = "#059669" }) => (
  <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <Circle cx="24" cy="24" r="24" fill={color} />
    <Circle cx="24" cy="17" r="8" fill="white" />
    <Path d="M10 38C14 28 34 28 38 38" fill="white" />
    <Circle cx="24" cy="24" r="23" stroke="white" strokeWidth="2" />
  </Svg>
);

const HabitIcon = ({ size = 64, color = "#059669" }) => (
  <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <Circle cx="32" cy="32" r="30" fill={color} />
    <Circle cx="32" cy="32" r="24" fill="white" opacity="0.3" />
    <Rect x="20" y="20" width="24" height="24" rx="4" fill="white" />
    <Path d="M26 32L30 36L38 28" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const notifications = [
  { id: 1, user: 'Alex', habit: 'Morning Run', time: '2h ago' },
  { id: 2, user: 'Sarah', habit: 'Meditation', time: '4h ago' },
];

export default function HomePage() {
  const isDark = useThemeStore((state) => state.isDark);
  const session = useAuthStore((state) => state.session);
  const { habits, fetchHabits, toggleHabitCompletion } = useHabitsStore();
  const [isLoading, setIsLoading] = useState(false);
  const userName = session?.user?.user_metadata?.username || session?.user?.email?.split('@')[0] || 'User';

  useEffect(() => {
    loadHabits();
  }, []);

  const loadHabits = async () => {
    setIsLoading(true);
    try {
      await fetchHabits();
    } catch (error) {
      console.error('Failed to load habits:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleHabit = async (id: string) => {
    try {
      await toggleHabitCompletion(id);
    } catch (error) {
      console.error('Failed to toggle habit completion:', error);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  // Get date display
  const getTodayDisplay = () => {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric' };
    return today.toLocaleDateString('en-US', options);
  };

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name.split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Avatar component for activity feed
  const InitialsAvatar = ({ name, size = 32 }: { name: string; size?: number }) => (
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: '#059669', alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ color: 'white', fontWeight: '600', fontSize: size / 2.5 }}>
        {getInitials(name)}
      </Text>
    </View>
  );

  return (
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-[#1a1a1a]' : 'bg-white'}`}>
      {/* Header Section with User Info and Date */}
      <Animated.View
        entering={FadeIn.duration(500)}
        className="px-6 pt-4 pb-6"
      >
        <View className="flex-row items-center justify-between">
          <View>
            <Text className={`text-lg font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              {getGreeting()},
            </Text>
            <Text className={`text-2xl font-bold capitalize mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {userName}
            </Text>
            <Text className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {getTodayDisplay()}
            </Text>
          </View>

          <TouchableOpacity
            className="rounded-full overflow-hidden"
            activeOpacity={0.8}
            onPress={() => router.push('/(auth)/edit-profile')}
          >
            <UserAvatar size={48} color="#059669" />
          </TouchableOpacity>
        </View>
      </Animated.View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Stats Overview Card */}
        <Animated.View
          entering={FadeInDown.duration(500).delay(100)}
          className={`mx-6 mb-6 p-5 rounded-2xl ${isDark ? 'bg-gray-800/60' : 'bg-[#e6f7f1]'} shadow-sm`}
        >
          <Text className={`text-base font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>
            Habit Overview
          </Text>

          <View className="flex-row justify-between">
            <View className={`p-3 rounded-xl ${isDark ? 'bg-gray-700/70' : 'bg-white'}`}>
              <Text className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Active Habits</Text>
              <Text className={`text-xl font-bold mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {habits.length || 0}
              </Text>
            </View>

            <View className={`p-3 rounded-xl ${isDark ? 'bg-gray-700/70' : 'bg-white'}`}>
              <Text className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Completed Today</Text>
              <Text className={`text-xl font-bold mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {habits.filter(h => h.todayCompleted).length || 0}/{habits.length || 0}
              </Text>
            </View>

            <View className={`p-3 rounded-xl ${isDark ? 'bg-gray-700/70' : 'bg-white'}`}>
              <Text className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Best Streak</Text>
              <Text className={`text-xl font-bold mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {habits.reduce((max, h) => Math.max(max, h.longest_streak || 0), 0)} days
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Today's Habits */}
        <View className="px-6 mb-8">
          <View className="flex-row items-center justify-between mb-4">
            <Text className={`text-base font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              TODAY'S HABITS
            </Text>
            <TouchableOpacity
              onPress={loadHabits}
              className="p-2"
              activeOpacity={0.7}
            >
              <Feather name="refresh-cw" size={16} color={isDark ? '#059669' : '#059669'} />
            </TouchableOpacity>
          </View>

          {habits.length === 0 ? (
            <Animated.View
              entering={FadeIn.duration(500)}
              className={`p-6 rounded-2xl border ${isDark ? 'bg-gray-800/40 border-gray-700' : 'bg-gray-50 border-gray-100'} items-center`}
            >
              <View className="mb-4">
                <HabitIcon size={64} color="#059669" />
              </View>
              <Text className={`text-base font-medium text-center ${isDark ? 'text-white' : 'text-gray-800'}`}>
                No habits yet
              </Text>
              <Text className={`text-sm text-center mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Create your first habit to get started
              </Text>
              <TouchableOpacity
                className="mt-4 px-5 py-3 bg-[#059669] rounded-xl"
                activeOpacity={0.8}
                onPress={() => router.push('/(auth)/add-habit')}
              >
                <Text className="text-white font-medium">Create Habit</Text>
              </TouchableOpacity>
            </Animated.View>
          ) : (
            habits.map((habit, index) => (
              <Animated.View
                key={habit.id}
                entering={FadeInDown.delay(index * 100).duration(500)}
                className={`mb-3 rounded-2xl border shadow-sm ${isDark
                  ? 'bg-gray-800/60 border-gray-700'
                  : 'bg-white border-gray-100'
                  }`}
              >
                <TouchableOpacity
                  onPress={() => toggleHabit(habit.id)}
                  className="p-4 flex-row items-center gap-4"
                  activeOpacity={0.7}
                >
                  <View className={`w-7 h-7 rounded-full border-2 items-center justify-center ${habit.todayCompleted
                    ? 'bg-[#059669] border-[#059669]'
                    : isDark
                      ? 'border-gray-600'
                      : 'border-gray-300'
                    }`}>
                    {habit.todayCompleted && <Feather name="check" size={14} color="white" />}
                  </View>
                  <View className="flex-1">
                    <Text className={`text-base font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>
                      {habit.name}
                    </Text>
                    <Text className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {habit.frequency} • Streak: {habit.current_streak || 0} days
                    </Text>
                    <View className="flex-row items-center gap-2 mt-2">
                      <View className={`flex-1 h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                        <View
                          className="h-full rounded-full bg-[#059669]"
                          style={{
                            width: `${Math.min(100, ((habit.current_streak || 0) / (habit.longest_streak > 0 ? habit.longest_streak : 7)) * 100)}%`
                          }}
                        />
                      </View>
                      <Text className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {habit.current_streak || 0}/{habit.longest_streak > 0 ? habit.longest_streak : 7}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            ))
          )}
        </View>

        {/* Activity Feed */}
        <View className="px-6 pb-10">
          <Text className={`text-base font-semibold mb-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            RECENT ACTIVITY
          </Text>

          {notifications.length === 0 ? (
            <View className={`p-4 rounded-2xl border ${isDark ? 'bg-gray-800/40 border-gray-700' : 'bg-gray-50 border-gray-100'}`}>
              <Text className={`text-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                No recent activity
              </Text>
            </View>
          ) : (
            notifications.map((notif, index) => (
              <Animated.View
                key={notif.id}
                entering={SlideInRight.delay(index * 100).duration(500)}
                className={`mb-3 p-4 rounded-2xl border ${isDark
                  ? 'bg-gray-800/60 border-gray-700'
                  : 'bg-white border-gray-100'
                  }`}
              >
                <View className="flex-row items-center">
                  <View className="mr-3">
                    <InitialsAvatar name={notif.user} size={32} />
                  </View>
                  <View className="flex-1">
                    <Text className={isDark ? 'text-white' : 'text-gray-800'}>
                      <Text className="font-medium">{notif.user}</Text> completed{' '}
                      <Text className="font-medium">{notif.habit}</Text>
                    </Text>
                    <Text className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {notif.time}
                    </Text>
                  </View>

                  <Feather
                    name="check-circle"
                    size={16}
                    color="#059669"
                  />
                </View>
              </Animated.View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}