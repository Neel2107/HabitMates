import { useThemeStore } from '@/lib/stores/themeStore';
import { Feather } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const PartnersScreen = () => {
  const isDark = useThemeStore((state) => state.isDark);

  return (
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-[#1a1a1a]' : 'bg-[#f5f9f8]'}`}>
      <StatusBar style={isDark ? 'light' : 'dark'} />

      {/* Header */}
      <Animated.View
        entering={FadeIn.duration(500)}
        className="px-6 pt-4 pb-4"
      >
        <View className="flex-row justify-between items-center">
          <Text className={`text-2xl font-inter-bold ${isDark ? 'text-white' : 'text-[#1e293b]'}`}>
            Partners
          </Text>
        </View>
        <Text className={`text-sm mt-1 font-inter-regular ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          Connect with friends to stay accountable``
        </Text>
      </Animated.View>

      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        {/* Coming Soon Card */}
        <Animated.View
          entering={FadeInDown.delay(150).duration(500)}
          className={`mb-6 p-6 rounded-2xl ${isDark ? 'bg-gray-800/60' : 'bg-white'} shadow-sm border ${isDark ? 'border-gray-700' : 'border-gray-100'}`}
        >
          <View className="items-center mb-6">
            <Feather name="users" size={60} color="#059669" />
            <Text className={`text-xl font-inter-bold mt-4 ${isDark ? 'text-white' : 'text-[#1e293b]'}`}>
              Coming Soon
            </Text>
            <Text className={`text-sm text-center mt-2 font-inter-regular ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              The partners feature is currently under development
            </Text>
          </View>

          <View className={`p-5 rounded-xl mb-6 ${isDark ? 'bg-gray-700/40' : 'bg-[#e6f7f1]'}`}>
            <Text className={`text-base font-inter-semibold mb-2 ${isDark ? 'text-white' : 'text-[#1e293b]'}`}>
              What to expect
            </Text>
            <View className="space-y-3">
              <View className="flex-row items-center">
                <View className="w-2 h-2 rounded-full bg-[#059669] mr-2" />
                <Text className={`text-sm font-inter-regular ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Connect with friends to track habits together
                </Text>
              </View>
              <View className="flex-row items-center">
                <View className="w-2 h-2 rounded-full bg-[#059669] mr-2" />
                <Text className={`text-sm font-inter-regular ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Send and receive habit invitations
                </Text>
              </View>
              <View className="flex-row items-center">
                <View className="w-2 h-2 rounded-full bg-[#059669] mr-2" />
                <Text className={`text-sm font-inter-regular ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Stay accountable with partner streaks
                </Text>
              </View>
              <View className="flex-row items-center">
                <View className="w-2 h-2 rounded-full bg-[#059669] mr-2" />
                <Text className={`text-sm font-inter-regular ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Message partners for motivation
                </Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            className="py-3 rounded-xl bg-[#059669]"
            activeOpacity={0.7}
          >
            <Text className="text-white font-inter-medium text-center">
              Join Waitlist
            </Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Feature Preview */}
        <Animated.View
          entering={FadeInDown.delay(300).duration(500)}
          className={`mb-10 p-6 rounded-2xl ${isDark ? 'bg-gray-800/60' : 'bg-white'} shadow-sm border ${isDark ? 'border-gray-700' : 'border-gray-100'}`}
        >
          <Text className={`text-base font-inter-semibold mb-3 ${isDark ? 'text-white' : 'text-[#1e293b]'}`}>
            Why use partners?
          </Text>
          
          <Text className={`text-sm font-inter-regular mb-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Research shows that having an accountability partner increases your chances of sticking to habits by up to 95%
          </Text>
          
          <View className="space-y-4">
            <View className={`p-4 rounded-xl ${isDark ? 'bg-gray-700/40' : 'bg-gray-50'}`}>
              <View className="flex-row items-center mb-2">
                <Feather name="trending-up" size={18} color="#059669" />
                <Text className={`ml-2 font-inter-medium ${isDark ? 'text-white' : 'text-[#1e293b]'}`}>
                  Better Consistency
                </Text>
              </View>
              <Text className={`text-sm font-inter-regular ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Partners help you stay on track with your habits through mutual accountability
              </Text>
            </View>
            
            <View className={`p-4 rounded-xl ${isDark ? 'bg-gray-700/40' : 'bg-gray-50'}`}>
              <View className="flex-row items-center mb-2">
                <Feather name="zap" size={18} color="#059669" />
                <Text className={`ml-2 font-inter-medium ${isDark ? 'text-white' : 'text-[#1e293b]'}`}>
                  Increased Motivation
                </Text>
              </View>
              <Text className={`text-sm font-inter-regular ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Friendly competition and support keeps you motivated to maintain your streaks
              </Text>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PartnersScreen;