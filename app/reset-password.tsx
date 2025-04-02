import { useAuthStore } from '@/lib/stores/authStore';
import { useThemeStore } from '@/lib/stores/themeStore';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Alert, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import Animated, { FadeIn } from 'react-native-reanimated';

export default function ResetPasswordScreen() {
  const isDark = useThemeStore((state) => state.isDark);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const resetPassword = useAuthStore((state) => state.resetPassword);

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword(email);
      Alert.alert(
        'Success',
        'Password reset instructions have been sent to your email',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1">
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <View className="absolute inset-0">
        <LinearGradient
          colors={isDark ?
            ['#1a1a1a', '#0d3d31'] :
            ['#ffffff', '#e6f7f1']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ flex: 1 }}
        />
      </View>

      <KeyboardAwareScrollView
        bottomOffset={Platform.OS === 'ios' ? 400 : 200}
        keyboardShouldPersistTaps="handled"
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        {/* Back Button and Title */}
        <View className="pt-12 px-6 flex-row items-center">
          <TouchableOpacity
            onPress={() => router.back()}
            className="p-2 mr-4"
          >
            <Feather name="arrow-left" size={24} color={isDark ? '#ffffff' : '#000000'} />
          </TouchableOpacity>
          <Text className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Reset Password
          </Text>
        </View>

        {/* Form Container */}
        <Animated.View
          entering={FadeIn.duration(800)}
          className="flex-1 px-8 pt-10"
        >
          <View className="items-center mb-10">
            <View className="h-20 w-20 bg-[#059669] rounded-full mb-6 items-center justify-center">
              <Feather name="lock" size={40} color="white" />
            </View>
            <Text className={`text-[#059669] text-xl font-bold mb-2`}>
              Forgot your password?
            </Text>
            <Text className={`text-center ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Enter your email address and we'll send you instructions to reset your password
            </Text>
          </View>

          {/* Email Input */}
          <View className="mb-6">
            <Text className={`text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Email Address
            </Text>
            <View className={`flex-row items-center overflow-hidden rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'} border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
              <View className="p-3 pl-4">
                <Feather name="mail" size={20} color="#059669" />
              </View>
              <TextInput
                placeholder="your@email.com"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                className={`flex-1 p-3 text-base ${isDark ? 'text-white' : 'text-gray-900'}`}
                placeholderTextColor={isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.3)'}
              />
            </View>
          </View>

          {/* Reset Button */}
          <TouchableOpacity
            onPress={handleResetPassword}
            activeOpacity={0.8}
            disabled={isLoading}
            className={`mb-8 rounded-xl py-4 bg-[#059669]`}
          >
            <Text className="text-center font-semibold text-base text-white">
              {isLoading ? 'Sending...' : 'Send Reset Instructions'}
            </Text>
          </TouchableOpacity>

          {/* Back to Login */}
          <View className="flex-row justify-center items-center">
            <Text className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Remember your password?{' '}
            </Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.push('/login')}
            >
              <Text className="text-[#059669] font-semibold">
                Back to Login
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </KeyboardAwareScrollView>
    </View>
  );
}