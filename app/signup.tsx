import { useAuthStore } from '@/lib/stores/authStore';
import { useThemeStore } from '@/lib/stores/themeStore';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Alert, Image, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import Animated, { FadeIn } from 'react-native-reanimated';

export default function SignUpScreen() {
  const isDark = useThemeStore((state) => state.isDark);
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const signUp = useAuthStore((state) => state.signUp);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.username) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await signUp(formData.email, formData.password, formData.username);
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
 

      <KeyboardAwareScrollView
        bottomOffset={Platform.OS === 'ios' ? 400 : 200}
        keyboardShouldPersistTaps="handled"
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
      >
        <View className="px-8 py-6">
          {/* Header with Illustration */}
          <View className="items-center mb-8">
          <Image 
                source={require('@/assets/images/signup.png')} 
                style={{ width: 240, height: 240 }}
                resizeMode="cover"
              />
            <Text className="text-4xl  font-inter-bold text-[#1e293b] mt-2">
              Join HabitMates today
            </Text>
          </View>

          {/* Signup Form */}
          <Animated.View
            entering={FadeIn.duration(800)}
            className="mb-8"
          >
            {/* Email Input */}
            <View className="mb-4">
              <TextInput
                placeholder="Email address"
                value={formData.email}
                onChangeText={(text) => {
                  setFormData(prev => ({ ...prev, email: text }));
                  if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
                }}
                autoCapitalize="none"
                keyboardType="email-address"
                className={`bg-white p-4 rounded-xl text-xl font-inter-regular border ${errors.email ? 'border-red-500' : 'border-gray-200'} text-gray-800`}
                placeholderTextColor="#9ca3af"
              />
              {errors.email && (
                <Text className="text-red-500 mt-1 text-xs pl-1">
                  {errors.email}
                </Text>
              )}
            </View>

            {/* Username Input */}
            <View className="mb-4">
              <TextInput
                placeholder="Username"
                value={formData.username}
                onChangeText={(text) => {
                  setFormData(prev => ({ ...prev, username: text }));
                  if (errors.username) setErrors(prev => ({ ...prev, username: '' }));
                }}
                autoCapitalize="none"
                className={`bg-white p-4 rounded-xl text-xl font-inter-regular border ${errors.username ? 'border-red-500' : 'border-gray-200'} text-gray-800`}
                placeholderTextColor="#9ca3af"
              />
              {errors.username && (
                <Text className="text-red-500 mt-1 text-xs pl-1">
                  {errors.username}
                </Text>
              )}
            </View>

            {/* Password Input */}
            <View className="mb-4">
              <TextInput
                placeholder="Password"
                value={formData.password}
                onChangeText={(text) => {
                  setFormData(prev => ({ ...prev, password: text }));
                  if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
                }}
                secureTextEntry
                className={`bg-white p-4 rounded-xl text-xl font-inter-regular border ${errors.password ? 'border-red-500' : 'border-gray-200'} text-gray-800`}
                placeholderTextColor="#9ca3af"
              />
              {errors.password && (
                <Text className="text-red-500 mt-1 text-xs pl-1">
                  {errors.password}
                </Text>
              )}
            </View>

            {/* Confirm Password Input */}
            <View className="mb-6">
              <TextInput
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChangeText={(text) => {
                  setFormData(prev => ({ ...prev, confirmPassword: text }));
                  if (errors.confirmPassword) setErrors(prev => ({ ...prev, confirmPassword: '' }));
                }}
                secureTextEntry
                className={`bg-white p-4 rounded-xl text-xl font-inter-regular border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-200'} text-gray-800`}
                placeholderTextColor="#9ca3af"
              />
              {errors.confirmPassword && (
                <Text className="text-red-500 mt-1 text-xs pl-1">
                  {errors.confirmPassword}
                </Text>
              )}
            </View>

            {/* Create Account Button */}
            <TouchableOpacity
              onPress={handleSignUp}
              activeOpacity={0.8}
              disabled={isLoading}
              className="rounded-xl overflow-hidden mb-8"
            >
              <LinearGradient
                colors={['#059669', '#047857']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className="py-4"
              >
                <Text className="text-center font-inter-bold text-xl text-white">
                  {isLoading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Sign In Link */}
            <View className="flex-row justify-center items-center">
              <Text className="text-gray-700 font-inter-regular text-base">
                Already have an account? 
              </Text>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => router.push('/login')}
                className="ml-1"
              >
                <Text className="text-[#059669] font-inter-semibold text-base">
                  Sign in
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}