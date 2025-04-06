import { useAuthStore } from '@/lib/stores/authStore';
import { useThemeStore } from '@/lib/stores/themeStore';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Alert, Image, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import Animated, { FadeIn } from 'react-native-reanimated';

export default function LoginScreen() {
  const isDark = useThemeStore((state) => state.isDark);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const signIn = useAuthStore((state) => state.signIn);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      await signIn(email, password);
      router.replace('/(auth)/(tabs)/home');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-[#f5f9f8]">
      <StatusBar style={isDark ? 'light' : 'dark'} />

      <KeyboardAwareScrollView
        bottomOffset={Platform.OS === 'ios' ? 400 : 200}
        keyboardShouldPersistTaps="handled"
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
      >
        <View className="px-8 py-6">
          {/* App Icon and Title */}
          <View className="items-center mb-12">
            <View className="rounded-3xl overflow-hidden mb-4">
              <Image 
                source={require('@/assets/images/habit-mates.png')} 
                style={{ width: 240, height: 240 }}
                resizeMode="cover"
              />
            </View>
            <Text className="text-6xl font-inter-bold text-[#1e293b] mb-1">
              HabitMates
            </Text>
          </View>

          {/* Login Form */}
          <Animated.View
            entering={FadeIn.duration(800)}
            className="mb-8"
          >
            {/* Email Input */}
            <View className="mb-4">
              <TextInput
                placeholder="Email address"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                className="bg-white p-4 rounded-xl text-xl font-inter-regular border border-gray-200 text-gray-800"
                placeholderTextColor="#9ca3af"
              />
            </View>

            {/* Password Input */}
            <View className="mb-2">
              <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                className="bg-white p-4 rounded-xl text-xl font-inter-regular border border-gray-200 text-gray-800"
                placeholderTextColor="#9ca3af"
              />
            </View>

            {/* Forgot Password Link */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.push('/reset-password')}
              className="mb-6 self-end"
            >
              <Text className="text-gray-600 text-base font-inter-medium">
                Forgot password?
              </Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity
              onPress={handleLogin}
              activeOpacity={0.8}
              disabled={isLoading}
              className="rounded-xl py-4 bg-[#059669] mb-8"
            >
              <Text className="text-center font-inter-bold text-xl text-white">
                LOG IN
              </Text>
            </TouchableOpacity>

            {/* Sign Up Link */}
            <View className="flex-row justify-center items-center">
              <Text className="text-gray-700 font-inter-regular">
                Don't have an account? 
              </Text>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => router.navigate('/signup')}
                className="ml-1"
              >
                <Text className="text-[#059669] font-inter-semibold">
                  Sign up
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}