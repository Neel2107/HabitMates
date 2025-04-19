import { CustomButton } from '@/components/ui/CustomButton';
import { useAuthStore } from '@/lib/stores/authStore';
import { useThemeStore } from '@/lib/stores/themeStore';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Alert, Image, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import Animated, { FadeIn, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const signUp = useAuthStore((state) => state.signUp);

  // Animation values
  const passwordIconRotation = useSharedValue(0);
  const confirmPasswordIconRotation = useSharedValue(0);

  // Animated styles
  const passwordIconStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${passwordIconRotation.value}deg` }],
    };
  });

  const confirmPasswordIconStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${confirmPasswordIconRotation.value}deg` }],
    };
  });

  // Toggle password visibility with animation
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
    passwordIconRotation.value = withTiming(passwordIconRotation.value + 180, { duration: 300 });
  };

  // Toggle confirm password visibility with animation
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
    confirmPasswordIconRotation.value = withTiming(confirmPasswordIconRotation.value + 180, { duration: 300 });
  };

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
            <Text className="text-4xl font-inter-bold text-[#1e293b] mt-2">
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
                className={`bg-white p-4 rounded-xl text-xl font-inter-regular border ${errors.email ? 'border-red-500' : 'border-zinc-200'} text-gray-800`}
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
                className={`bg-white p-4 rounded-xl text-xl font-inter-regular border ${errors.username ? 'border-red-500' : 'border-zinc-200'} text-gray-800`}
                placeholderTextColor="#9ca3af"
              />
              {errors.username && (
                <Text className="text-red-500 mt-1 text-xs pl-1">
                  {errors.username}
                </Text>
              )}
            </View>

            {/* Password Input with Show/Hide Toggle */}
            <View className="mb-4">
              <View className={`flex-row items-center bg-white rounded-xl border ${errors.password ? 'border-red-500' : 'border-zinc-200'}`}>
                <TextInput
                  placeholder="Password"
                  value={formData.password}
                  onChangeText={(text) => {
                    setFormData(prev => ({ ...prev, password: text }));
                    if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
                  }}
                  secureTextEntry={!showPassword}
                  className="flex-1 p-4 text-xl font-inter-regular text-gray-800"
                  placeholderTextColor="#9ca3af"
                />
                <TouchableOpacity
                  onPress={togglePasswordVisibility}
                  className="pr-4"
                >
                  <Animated.View style={passwordIconStyle}>
                    <Feather
                      name={showPassword ? "eye-off" : "eye"}
                      size={24}
                      color="#059669"
                    />
                  </Animated.View>
                </TouchableOpacity>
              </View>
              {errors.password && (
                <Text className="text-red-500 mt-1 text-xs pl-1">
                  {errors.password}
                </Text>
              )}
            </View>

            {/* Confirm Password Input with Show/Hide Toggle */}
            <View className="mb-6">
              <View className={`flex-row items-center bg-white rounded-xl border ${errors.confirmPassword ? 'border-red-500' : 'border-zinc-200'}`}>
                <TextInput
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChangeText={(text) => {
                    setFormData(prev => ({ ...prev, confirmPassword: text }));
                    if (errors.confirmPassword) setErrors(prev => ({ ...prev, confirmPassword: '' }));
                  }}
                  secureTextEntry={!showConfirmPassword}
                  className="flex-1 p-4 text-xl font-inter-regular text-gray-800"
                  placeholderTextColor="#9ca3af"
                />
                <TouchableOpacity
                  onPress={toggleConfirmPasswordVisibility}
                  className="pr-4"
                >
                  <Animated.View style={confirmPasswordIconStyle}>
                    <Feather
                      name={showConfirmPassword ? "eye-off" : "eye"}
                      size={24}
                      color="#059669"
                    />
                  </Animated.View>
                </TouchableOpacity>
              </View>
              {errors.confirmPassword && (
                <Text className="text-red-500 mt-1 text-xs pl-1">
                  {errors.confirmPassword}
                </Text>
              )}
            </View>

            <CustomButton
              onPress={handleSignUp}
              title="CREATE ACCOUNT"
              isLoading={isLoading}
              loadingText="CREATING ACCOUNT..."
              disabled={isLoading}
              style={{ marginBottom: 32 }}
            />

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