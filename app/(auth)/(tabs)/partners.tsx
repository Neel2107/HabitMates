import { useThemeStore } from '@/lib/stores/themeStore';
import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const mockPartners = [
  {
    id: 1,
    name: 'Alex Johnson',
    image: 'https://i.pravatar.cc/150?img=1',
    status: 'Completed morning workout',
    lastActive: '2h ago',
    completedToday: true,
  },
  {
    id: 2,
    name: 'Sarah Wilson',
    image: 'https://i.pravatar.cc/150?img=2',
    status: 'On track with meditation',
    lastActive: '4h ago',
    completedToday: true,
  },
  {
    id: 3,
    name: 'Mike Brown',
    image: 'https://i.pravatar.cc/150?img=3',
    status: 'Yet to complete today\'s habit',
    lastActive: '1h ago',
    completedToday: false,
  },
];

const activities = [
  { id: 1, user: 'Alex', action: 'completed', habit: 'Morning Run', time: '2h ago' },
  { id: 2, user: 'Sarah', action: 'started', habit: 'Meditation', time: '4h ago' },
  { id: 3, user: 'Mike', action: 'reached', milestone: '7 day streak', time: '1d ago' },
];

const PartnersScreen = () => {
  const isDark = useThemeStore((state) => state.isDark);

  return (
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
      {/* Modern Minimal Header */}
      <Animated.View
        entering={FadeIn.duration(500)}
        className="px-6 pt-12 pb-6"
      >
        <View className="flex-row items-center justify-between">
          <View>
            <Text className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
              Partners
            </Text>
            <Text className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {mockPartners.length} active partners
            </Text>
          </View>
          <TouchableOpacity
            className={`w-10 h-10 rounded-full items-center justify-center ${isDark ? 'bg-indigo-600' : 'bg-indigo-500'
              }`}
            activeOpacity={0.8}
          >
            <Feather name="user-plus" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </Animated.View>

      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        {mockPartners.map((partner, index) => 
          <Animated.View
            key={partner.id}
            entering={FadeInDown.delay(index * 100).duration(500)}
            className={`mb-4 p-4 rounded-2xl border shadow-sm ${isDark
                ? 'bg-slate-800 border-slate-700'
                : 'bg-white border-slate-100'
              }`}
          >
            <View className="flex-row items-center">
              <Image
                source={{ uri: partner.image }}
                className={`w-12 h-12 rounded-full border ${isDark ? 'border-slate-600' : 'border-slate-100'
                  }`}
              />
              <View className="flex-1 ml-3">
                <Text className={`text-base font-semibold ${isDark ? 'text-white' : 'text-slate-800'
                  }`}>
                  {partner.name}
                </Text>
                <Text className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                  {partner.status}
                </Text>
              </View>
              <View className={`w-2.5 h-2.5 rounded-full ${partner.completedToday
                  ? 'bg-emerald-500'
                  : isDark ? 'bg-slate-600' : 'bg-slate-300'
                }`} />
            </View>

            <View className="flex-row mt-4 gap-2">
              <TouchableOpacity
                className={`flex-1 flex-row items-center justify-center py-2.5 rounded-xl ${isDark ? 'bg-slate-700/50' : 'bg-slate-50'
                  }`}
                activeOpacity={0.7}
              >
                <Feather
                  name="bar-chart-2"
                  size={16}
                  color={isDark ? '#818cf8' : '#6366f1'}
                />
                <Text className={`font-medium text-sm ml-2 ${isDark ? 'text-indigo-400' : 'text-indigo-500'
                  }`}>
                  Progress
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`flex-1 flex-row items-center justify-center py-2.5 rounded-xl ${isDark ? 'bg-slate-700/50' : 'bg-slate-50'
                  }`}
                activeOpacity={0.7}
              >
                <Feather
                  name="message-circle"
                  size={16}
                  color={isDark ? '#818cf8' : '#6366f1'}
                />
                <Text className={`font-medium text-sm ml-2 ${isDark ? 'text-indigo-400' : 'text-indigo-500'
                  }`}>
                  Message
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}
        <View className="h-6" />
      </ScrollView>
    </SafeAreaView>
  );
};

export default PartnersScreen;