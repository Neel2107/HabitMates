import { useThemeStore } from '@/lib/stores/themeStore';
import { Feather } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
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
    streak: 7,
  },
  {
    id: 2,
    name: 'Sarah Wilson',
    image: 'https://i.pravatar.cc/150?img=2',
    status: 'On track with meditation',
    lastActive: '4h ago',
    completedToday: true,
    streak: 14,
  },
  {
    id: 3,
    name: 'Mike Brown',
    image: 'https://i.pravatar.cc/150?img=3',
    status: 'Yet to complete today\'s habit',
    lastActive: '1h ago',
    completedToday: false,
    streak: 3,
  },
];

// Custom initials avatar component (for when image fails to load)
const InitialsAvatar = ({ name, size = 48 }: { name: string; size?: number }) => {
  const initials = name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2);

  return (
    <View
      style={{ width: size, height: size, borderRadius: size / 2 }}
      className="bg-[#059669] items-center justify-center"
    >
      <Text style={{ fontSize: size / 2.5 }} className="text-white font-semibold">
        {initials}
      </Text>
    </View>
  );
};

const PartnersScreen = () => {
  const isDark = useThemeStore((state) => state.isDark);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-[#1a1a1a]' : 'bg-white'}`}>
      <StatusBar style={isDark ? 'light' : 'dark'} />

      {/* Header */}
      <Animated.View
        entering={FadeIn.duration(500)}
        className="px-6 pt-4 pb-4"
      >
        <View className="flex-row justify-between items-center">
          <Text className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Partners
          </Text>

          <TouchableOpacity
            className="p-2 rounded-full bg-[#059669]"
            activeOpacity={0.8}
          >
            <Feather name="user-plus" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Search Bar */}
      <Animated.View
        entering={FadeInDown.delay(100).duration(500)}
        className="px-6 mb-4"
      >
        <View className={`flex-row items-center px-4 py-3 rounded-xl ${isDark ? 'bg-gray-800/60' : 'bg-gray-100'
          }`}>
          <Feather
            name="search"
            size={18}
            color={isDark ? '#94a3b8' : '#64748b'}
          />
          <TextInput
            className={`flex-1 ml-2 ${isDark ? 'text-white' : 'text-gray-800'
              }`}
            placeholder="Search partners..."
            placeholderTextColor={isDark ? '#94a3b8' : '#64748b'}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </Animated.View>

      {/* Stats Card */}
      <Animated.View
        entering={FadeInDown.delay(150).duration(500)}
        className={`mx-6 mb-6 p-5 rounded-2xl ${isDark ? 'bg-gray-800/60' : 'bg-[#e6f7f1]'} shadow-sm`}
      >
        <Text className={`text-base font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-800'}`}>
          Partner Overview
        </Text>

        <View className="flex-row justify-between">
          <View className={`px-4 py-3 rounded-xl ${isDark ? 'bg-gray-700/70' : 'bg-white'}`}>
            <Text className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Active Partners
            </Text>
            <Text className={`text-xl font-bold mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {mockPartners.length}
            </Text>
          </View>

          <View className={`px-4 py-3 rounded-xl ${isDark ? 'bg-gray-700/70' : 'bg-white'}`}>
            <Text className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Active Today
            </Text>
            <Text className={`text-xl font-bold mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {mockPartners.filter(p => p.completedToday).length}/{mockPartners.length}
            </Text>
          </View>
        </View>
      </Animated.View>

      {/* Partners List */}
      <View className="px-6 mb-4">
        <Text className={`text-base font-semibold mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
          YOUR PARTNERS
        </Text>
      </View>

      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        {mockPartners.map((partner, index) => (
          <Animated.View
            key={partner.id}
            entering={FadeInDown.delay(200 + index * 100).duration(500)}
            className={`mb-4 p-4 rounded-2xl border shadow-sm ${isDark
              ? 'bg-gray-800/60 border-gray-700'
              : 'bg-white border-gray-100'
              }`}
          >
            <View className="flex-row items-center">
              <Image
                source={{ uri: partner.image }}
                className="w-14 h-14 rounded-full"
                onError={({ nativeEvent: { error } }) => console.log(error)}
                // defaultSource={require('@/assets/default-avatar.png')}
              />

              <View className="flex-1 ml-3">
                <View className="flex-row items-center">
                  <Text className={`text-base font-semibold ${isDark ? 'text-white' : 'text-gray-800'
                    }`}>
                    {partner.name}
                  </Text>

                  {partner.completedToday && (
                    <View className="ml-2 px-2 py-0.5 rounded-full bg-[#059669]/20">
                      <Text className="text-xs text-[#059669] font-medium">
                        Active
                      </Text>
                    </View>
                  )}
                </View>

                <Text className={`text-sm mt-0.5 ${isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                  {partner.status}
                </Text>

                <View className="flex-row items-center mt-1">
                  <Feather
                    name="clock"
                    size={12}
                    color={isDark ? '#94a3b8' : '#64748b'}
                  />
                  <Text className={`text-xs ml-1 ${isDark ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                    {partner.lastActive}
                  </Text>

                  <View className="h-1 w-1 rounded-full bg-gray-400 mx-2" />

                  <Feather
                    name="zap"
                    size={12}
                    color="#059669"
                  />
                  <Text className={`text-xs ml-1 ${isDark ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                    {partner.streak} day streak
                  </Text>
                </View>
              </View>
            </View>

            <View className="flex-row mt-4 gap-3">
              <TouchableOpacity
                className="flex-1 flex-row items-center justify-center py-2.5 rounded-xl border border-[#059669]/20 bg-[#059669]/5"
                activeOpacity={0.7}
              >
                <Feather
                  name="bar-chart-2"
                  size={16}
                  color="#059669"
                />
                <Text className="font-medium text-sm ml-2 text-[#059669]">
                  Progress
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-1 flex-row items-center justify-center py-2.5 rounded-xl bg-[#059669]"
                activeOpacity={0.7}
              >
                <Feather
                  name="message-circle"
                  size={16}
                  color="white"
                />
                <Text className="font-medium text-sm ml-2 text-white">
                  Message
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        ))}
        <View className="h-20" />
      </ScrollView>
    </SafeAreaView>
  );
};

export default PartnersScreen;