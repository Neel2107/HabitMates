import { CustomButton } from '@/components/ui/CustomButton';
import { useAuthStore } from '@/lib/stores/authStore';
import { useThemeStore } from '@/lib/stores/themeStore';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Alert, Image, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import Animated, { FadeIn, FadeOut, LinearTransition, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

export default function LoginScreen() {
  const isDark = useThemeStore((state) => state.isDark);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const signIn = useAuthStore((state) => state.signIn);

  // Animation value for password icon
  const passwordIconRotation = useSharedValue(0);

  // Animated style for password icon
  const passwordIconStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${passwordIconRotation.value}deg` }],
    };
  });

  // Toggle password visibility with animation
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

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
        className="flex-1"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
      >
        <Animated.View
          layout={LinearTransition.damping(14)}
          className="px-8 py-6">
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
                className="bg-white p-4 rounded-xl text-xl font-inter-regular border border-zinc-200 text-gray-800"
                placeholderTextColor="#9ca3af"
              />
            </View>

            {/* Password Input with Show/Hide Toggle */}
            <View className="mb-2">
              <View className="flex-row items-center bg-white rounded-xl border border-zinc-200">
                <TextInput
                  placeholder="Password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  className="flex-1 p-4 text-xl font-inter-regular text-gray-800"
                  placeholderTextColor="#9ca3af"
                />
                <TouchableOpacity
                  onPress={togglePasswordVisibility}
                  className="pr-4"
                >
                  {showPassword ? (
                    <Animated.View
                      entering={FadeIn.duration(200)}
                      exiting={FadeOut.duration(200)}
                    >
                      <Feather name="eye-off" size={24} color="#059669" />
                    </Animated.View>
                  ) : (
                    <Animated.View
                      entering={FadeIn.duration(200)}
                      exiting={FadeOut.duration(200)}
                    >
                      <Feather name="eye" size={24} color="#059669" />
                    </Animated.View>
                  )}
                </TouchableOpacity>
              </View>
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
            <CustomButton
              onPress={handleLogin}
              title="LOG IN"
              isLoading={isLoading}
              loadingText="SIGNING IN..."
              disabled={isLoading || !email || !password}
              style={{ marginBottom: 32 }}
            />

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
        </Animated.View>
      </KeyboardAwareScrollView>
    </View>
  );
}