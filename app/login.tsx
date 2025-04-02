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

export default function LoginScreen() {
  const isDark = useThemeStore((state) => state.isDark);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
        {/* Logo and Title Section */}
        <View className="w-full py-16 items-center">
          <View className="h-20 w-20 bg-[#059669] rounded-2xl mb-6 items-center justify-center">
            <Feather name="check-circle" size={40} color="white" />
          </View>
          <Text className={`text-4xl font-bold text-[#059669]`}>
            HabitMates
          </Text>
          <Text className={`mt-2 text-base ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Build better habits together
          </Text>
        </View>

        {/* Form Container */}
        <Animated.View
          entering={FadeIn.duration(800)}
          className="flex-1 px-8 pt-6"
        >
          {/* Email Input */}
          <View className="mb-5">
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

          {/* Password Input */}
          <View className="mb-6">
            <Text className={`text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Password
            </Text>
            <View className={`flex-row items-center overflow-hidden rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'} border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
              <View className="p-3 pl-4">
                <Feather name="lock" size={20} color="#059669" />
              </View>
              <TextInput
                placeholder="••••••••"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                className={`flex-1 p-3 text-base ${isDark ? 'text-white' : 'text-gray-900'}`}
                placeholderTextColor={isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.3)'}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                activeOpacity={0.7}
                className="p-3 pr-4"
              >
                <Feather
                  name={showPassword ? 'eye-off' : 'eye'}
                  size={20}
                  color={isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.3)'}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Login Button */}
          <TouchableOpacity
            onPress={handleLogin}
            activeOpacity={0.8}
            disabled={isLoading}
            className={`mb-6 rounded-xl py-4 bg-[#059669]`}
          >
            <Text className="text-center font-semibold text-base text-white">
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Text>
          </TouchableOpacity>

          {/* Forgot Password Link */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.push('/reset-password')}
            className="mb-6"
          >
            <Text className={`text-center text-base ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Forgot your password?
            </Text>
          </TouchableOpacity>

          {/* Sign Up Link */}
          <View className="flex-row justify-center items-center">
            <Text className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              New here?{' '}
            </Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.navigate('/signup')}
            >
              <Text className="text-[#059669] font-semibold">
                Create account
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </KeyboardAwareScrollView>
    </View>
  );
}