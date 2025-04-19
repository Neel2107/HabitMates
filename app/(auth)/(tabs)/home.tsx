import TopGradient from '@/components/Switch/TopGradient';
import { useAuthStore } from '@/lib/stores/authStore';
import { useHabitsStore } from '@/lib/stores/habitsStore';
import { useThemeStore } from '@/lib/stores/themeStore';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Path } from 'react-native-svg';

// Custom SVG icons
const UserAvatar = ({ size = 48, color = "#059669" }) => (
  <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <Circle cx="24" cy="24" r="24" fill={color} />
    <Circle cx="24" cy="17" r="8" fill="white" />
    <Path d="M10 38C14 28 34 28 38 38" fill="white" />
    <Circle cx="24" cy="24" r="23" stroke="white" strokeWidth="2" />
  </Svg>
);

// Streak icon
const StreakIcon = ({ size = 40, color = "#059669" }) => (
  <Svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    <Circle cx="20" cy="20" r="20" fill={color} opacity={0.1} />
    <Path d="M20 8L23 14L30 15L25 20L26 27L20 24L14 27L15 20L10 15L17 14L20 8Z" fill={color} />
  </Svg>
);

export default function HomePage() {
  const isDark = useThemeStore((state) => state.isDark);
  const session = useAuthStore((state) => state.session);
  const { habits, fetchHabits, toggleHabitCompletion } = useHabitsStore();
  const [isLoading, setIsLoading] = useState(true);
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

  // Calculate completion percentage
  const getCompletionPercentage = () => {
    if (habits.length === 0) return 0;
    return Math.round((habits.filter(h => h.todayCompleted).length / habits.length) * 100);
  };

  // Get best streak
  const getBestStreak = () => {
    return habits.reduce((max, h) => Math.max(max, h.longest_streak || 0), 0);
  };

  // Get habits by frequency
  const getDailyHabits = () => {
    return habits.filter(h => h.frequency === 'daily');
  };

  const getWeeklyHabits = () => {
    return habits.filter(h => h.frequency === 'weekly');
  };

  // Get streak status
  const getStreakStatus = () => {
    const bestStreak = getBestStreak();
    if (bestStreak === 0) return "Start your first streak!";
    if (bestStreak < 3) return "Building momentum!";
    if (bestStreak < 7) return "Keep it up!";
    if (bestStreak < 14) return "You're on fire!";
    if (bestStreak < 30) return "Impressive dedication!";
    return "Habit master!";
  };

  return (
    <>


      <SafeAreaView className={`flex-1 ${isDark ? 'bg-[#1a1a1a]' : 'bg-[#f5f9f8]'}`}>
        <TopGradient />
        {/* Header Section with User Info and Date */}
        <Animated.View
          entering={FadeIn.duration(500)}
          className="px-6 pt-4 pb-6 z-10"
        >
          <View className="flex-row items-center justify-between">
            <View>
              <Text className={`text-lg font-inter-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                {getGreeting()},
              </Text>
              <Text className={`text-2xl font-inter-bold capitalize mt-1 ${isDark ? 'text-white' : 'text-[#1e293b]'}`}>
                {userName}
              </Text>
              <Text className={`text-sm font-inter-regular mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {getTodayDisplay()}
              </Text>
            </View>

            <TouchableOpacity
              className="rounded-full overflow-hidden"
              activeOpacity={0.8}
              onPress={() => router.push('/(auth)/(tabs)/profile')}
            >
              <UserAvatar size={48} color="#059669" />
            </TouchableOpacity>
          </View>
        </Animated.View>

        {isLoading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#059669" />
            <Text className={`mt-4 font-inter-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Loading your habits...</Text>
          </View>
        ) : (
          <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            {/* Streak Card */}
            <Animated.View
              entering={FadeInDown.duration(500).delay(100)}
              className={`mx-6 mb-6 p-5 rounded-2xl ${isDark ? 'bg-gray-800/60' : 'bg-white'} shadow-sm border ${isDark ? 'border-gray-700' : 'border-gray-100'}`}
            >
              <View className="flex-row items-center justify-between mb-3">
                <Text className={`text-base font-inter-semibold ${isDark ? 'text-white' : 'text-[#1e293b]'}`}>
                  Streak Progress
                </Text>
                <View className="flex-row items-center">
                  <StreakIcon size={24} color="#059669" />
                  <Text className={`ml-1 font-inter-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {getBestStreak()} days
                  </Text>
                </View>
              </View>

              {/* Streak Status */}
              <Text className={`text-sm font-inter-regular mb-3 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {getStreakStatus()}
              </Text>

              {/* Progress Bar */}
              <View className="mb-3">
                <View className="flex-row justify-between mb-1">
                  <Text className={`text-xs font-inter-regular ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {habits.filter(h => h.todayCompleted).length} of {habits.length} habits completed
                  </Text>
                  <Text className={`text-xs font-inter-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {getCompletionPercentage()}%
                  </Text>
                </View>
                <View className={`h-2 rounded-full overflow-hidden ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <View
                    className="h-full rounded-full bg-[#059669]"
                    style={{ width: `${getCompletionPercentage()}%` }}
                  />
                </View>
              </View>

              {/* Quick Actions */}
              <View className="flex-row justify-between mt-2">
                <TouchableOpacity
                  className="flex-row items-center py-2 px-3 rounded-lg bg-[#e6f7f1]"
                  onPress={() => router.push('/(auth)/add-habit')}
                  activeOpacity={0.7}
                >
                  <Feather name="plus" size={16} color="#059669" />
                  <Text className="ml-1 text-sm font-inter-medium text-[#059669]">Add Habit</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="flex-row items-center py-2 px-3 rounded-lg bg-[#e6f7f1]"
                  onPress={() => router.push('/(auth)/(tabs)/habits')}
                  activeOpacity={0.7}
                >
                  <Feather name="list" size={16} color="#059669" />
                  <Text className="ml-1 text-sm font-inter-medium text-[#059669]">All Habits</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>

            {/* Daily Habits */}
            <View className="px-6 mb-6">
              <View className="flex-row items-center justify-between mb-4">
                <Text className={`text-base font-inter-semibold ${isDark ? 'text-gray-300' : 'text-[#1e293b]'}`}>
                  DAILY HABITS
                </Text>
                <TouchableOpacity
                  onPress={loadHabits}
                  className="p-2"
                  activeOpacity={0.7}
                >
                  <Feather name="refresh-cw" size={16} color="#059669" />
                </TouchableOpacity>
              </View>

              {getDailyHabits().length === 0 ? (
                <Animated.View
                  entering={FadeIn.duration(500)}
                  className={`p-4 rounded-2xl border ${isDark ? 'bg-gray-800/40 border-gray-700' : 'bg-white border-gray-100'} items-center shadow-sm`}
                >
                  <Text className={`text-sm text-center font-inter-regular ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    No daily habits yet
                  </Text>
                </Animated.View>
              ) : (
                getDailyHabits().map((habit, index) => (
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
                        <Text className={`text-base font-inter-medium ${isDark ? 'text-white' : 'text-[#1e293b]'}`}>
                          {habit.name}
                        </Text>
                        <Text className={`text-xs mt-1 font-inter-regular ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          Daily • Streak: {habit.current_streak || 0} days
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
                          <Text className={`text-xs font-inter-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            {habit.current_streak || 0}/{habit.longest_streak > 0 ? habit.longest_streak : 7}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  </Animated.View>
                ))
              )}
            </View>

            {/* Weekly Habits */}
            <View className="px-6 mb-6">
              <View className="flex-row items-center justify-between mb-4">
                <Text className={`text-base font-inter-semibold ${isDark ? 'text-gray-300' : 'text-[#1e293b]'}`}>
                  WEEKLY HABITS
                </Text>
              </View>

              {getWeeklyHabits().length === 0 ? (
                <Animated.View
                  entering={FadeIn.duration(500)}
                  className={`p-4 rounded-2xl border ${isDark ? 'bg-gray-800/40 border-gray-700' : 'bg-white border-gray-100'} items-center shadow-sm`}
                >
                  <Text className={`text-sm text-center font-inter-regular ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    No weekly habits yet
                  </Text>
                </Animated.View>
              ) : (
                getWeeklyHabits().map((habit, index) => (
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
                        <Text className={`text-base font-inter-medium ${isDark ? 'text-white' : 'text-[#1e293b]'}`}>
                          {habit.name}
                        </Text>
                        <Text className={`text-xs mt-1 font-inter-regular ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          Weekly • Streak: {habit.current_streak || 0} weeks
                        </Text>
                        <View className="flex-row items-center gap-2 mt-2">
                          <View className={`flex-1 h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                            <View
                              className="h-full rounded-full bg-[#059669]"
                              style={{
                                width: `${Math.min(100, ((habit.current_streak || 0) / (habit.longest_streak > 0 ? habit.longest_streak : 4)) * 100)}%`
                              }}
                            />
                          </View>
                          <Text className={`text-xs font-inter-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            {habit.current_streak || 0}/{habit.longest_streak > 0 ? habit.longest_streak : 4}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  </Animated.View>
                ))
              )}
            </View>

            {/* Upcoming Features Teaser */}
            <View className="px-6 pb-10">
              <Text className={`text-base font-inter-semibold mb-4 ${isDark ? 'text-gray-300' : 'text-[#1e293b]'}`}>
                COMING SOON
              </Text>

              <Animated.View
                entering={FadeIn.duration(500)}
                className={`p-6 rounded-2xl border ${isDark ? 'bg-gray-800/40 border-gray-700' : 'bg-white border-gray-100'} shadow-sm`}
              >
                <View className="flex-row items-center mb-4">
                  <Feather name="trending-up" size={24} color="#059669" />
                  <Text className={`ml-2 text-base font-inter-medium ${isDark ? 'text-white' : 'text-[#1e293b]'}`}>
                    Advanced Analytics
                  </Text>
                </View>
                <Text className={`text-sm mb-4 font-inter-regular ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Detailed habit performance metrics and personalized insights are coming soon to help you track your progress better.
                </Text>

                <View className="flex-row items-center mb-4">
                  <Feather name="dollar-sign" size={24} color="#059669" />
                  <Text className={`ml-2 text-base font-inter-medium ${isDark ? 'text-white' : 'text-[#1e293b]'}`}>
                    Accountability Deposits
                  </Text>
                </View>
                <Text className={`text-sm font-inter-regular ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Stay motivated by putting money on the line. Get it back when you complete your habits, or lose it if you don't.
                </Text>
              </Animated.View>
            </View>
          </ScrollView>
        )}
      </SafeAreaView>
    </>
  );
}