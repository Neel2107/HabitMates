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


const PartnersScreen = () => {
  const isDark = useThemeStore((state) => state.isDark);

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
              Partners
            </Text>
            <Text className={`text-sm mt-1 ${isDark ? 'text-content-secondary-dark' : 'text-content-secondary-light'
              }`}>
              {mockPartners.length} active partners
            </Text>
          </View>
          <TouchableOpacity
            className={`w-10 h-10 rounded-full items-center justify-center ${isDark ? 'bg-brand-primary-dark' : 'bg-brand-primary'
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
              ? 'bg-app-card-dark border-border-dark'
              : 'bg-app-card-light border-border-light'
              }`}
          >
            <View className="flex-row items-center">
              <Image
                source={{ uri: partner.image }}
                className={`w-12 h-12 rounded-full border ${isDark ? 'border-border-dark' : 'border-border-light'
                  }`}
              />
              <View className="flex-1 ml-3">
                <Text className={`text-base font-semibold ${isDark ? 'text-content-primary-dark' : 'text-content-primary-light'
                  }`}>
                  {partner.name}
                </Text>
                <Text className={`text-sm ${isDark ? 'text-content-secondary-dark' : 'text-content-secondary-light'
                  }`}>
                  {partner.status}
                </Text>
              </View>
              <View className={`w-2.5 h-2.5 rounded-full ${partner.completedToday
                ? isDark ? 'bg-status-success-dark' : 'bg-status-success-light'
                : isDark ? 'bg-border-dark' : 'bg-border-light'
                }`} />
            </View>

            <View className="flex-row mt-4 gap-2">
              <TouchableOpacity
                className={`flex-1 flex-row items-center justify-center py-2.5 rounded-xl ${isDark ? 'bg-app-card-dark/50' : 'bg-app-light'
                  }`}
                activeOpacity={0.7}
              >
                <Feather
                  name="bar-chart-2"
                  size={16}
                  color={isDark ? '#6ee7b7' : '#059669'}
                />
                <Text className={`font-medium text-sm ml-2 ${isDark ? 'text-brand-primary-dark' : 'text-brand-primary'
                  }`}>
                  Progress
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`flex-1 flex-row items-center justify-center py-2.5 rounded-xl ${isDark ? 'bg-app-card-dark/50' : 'bg-app-light'
                  }`}
                activeOpacity={0.7}
              >
                <Feather
                  name="message-circle"
                  size={16}
                  color={isDark ? '#6ee7b7' : '#059669'}
                />
                <Text className={`font-medium text-sm ml-2 ${isDark ? 'text-brand-primary-dark' : 'text-brand-primary'
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