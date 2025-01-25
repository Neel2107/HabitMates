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
  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <Animated.View
        entering={FadeIn.duration(500)}
        className="px-6 pt-6 pb-4 bg-indigo-500 dark:bg-indigo-600"
      >
        <View className="flex-row justify-between items-center">
          <Text className="text-2xl font-bold text-white">Partners</Text>
          <TouchableOpacity
            className="bg-indigo-400 dark:bg-indigo-500 px-4 py-2 rounded-xl flex-row items-center"
            activeOpacity={0.8}
          >
            <Feather name="user-plus" size={18} color="white" />
            <Text className="text-white font-medium ml-2">Add Partner</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      <ScrollView className="flex-1 p-6" showsVerticalScrollIndicator={false}>
        {mockPartners.map((partner, index) => (
          <Animated.View
            key={partner.id}
            entering={FadeInDown.delay(index * 100).duration(500)}
            className="bg-white dark:bg-slate-800 mb-4 p-4 rounded-2xl border border-slate-200 dark:border-slate-700"
          >
            <View className="flex-row items-center">
              <Image
                source={{ uri: partner.image }}
                className="w-12 h-12 rounded-full"
              />
              <View className="flex-1 ml-3">
                <Text className="text-lg font-semibold text-slate-800 dark:text-white">
                  {partner.name}
                </Text>
                <Text className="text-slate-500 dark:text-slate-400">
                  {partner.status}
                </Text>
              </View>
              <View className={`w-3 h-3 rounded-full ${
                partner.completedToday ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'
              }`} />
            </View>
            
            <View className="flex-row mt-4 space-x-2">
              <TouchableOpacity 
                className="flex-1 flex-row items-center justify-center py-2 rounded-xl bg-slate-100 dark:bg-slate-700"
                activeOpacity={0.7}
              >
                <Feather name="bar-chart-2" size={16} color="#6366f1" />
                <Text className="text-indigo-500 dark:text-indigo-400 font-medium ml-2">
                  Progress
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                className="flex-1 flex-row items-center justify-center py-2 rounded-xl bg-slate-100 dark:bg-slate-700"
                activeOpacity={0.7}
              >
                <Feather name="message-circle" size={16} color="#6366f1" />
                <Text className="text-indigo-500 dark:text-indigo-400 font-medium ml-2">
                  Message
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default PartnersScreen;