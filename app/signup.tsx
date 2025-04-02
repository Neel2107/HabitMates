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

export default function SignUpScreen() {
  const isDark = useThemeStore((state) => state.isDark);
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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

  const renderInput = (
    field: keyof typeof formData,
    label: string,
    placeholder: string,
    icon: string,
    isPassword = false,
  ) => (
    <View className="mb-5">
      <Text className={`text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
        {label}
      </Text>
      <View className={`flex-row items-center overflow-hidden rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'} border ${errors[field] ? 'border-red-500' : isDark ? 'border-gray-700' : 'border-gray-200'}`}>
        <View className="p-3 pl-4">
          <Feather name={icon as any} size={20} color={errors[field] ? "#ef4444" : "#059669"} />
        </View>
        <TextInput
          placeholder={placeholder}
          value={formData[field]}
          onChangeText={(text) => {
            setFormData(prev => ({ ...prev, [field]: text }));
            if (errors[field]) {
              setErrors(prev => ({ ...prev, [field]: '' }));
            }
          }}
          secureTextEntry={isPassword && !showPassword}
          autoCapitalize="none"
          keyboardType={field === 'email' ? 'email-address' : 'default'}
          className={`flex-1 p-3 text-base ${isDark ? 'text-white' : 'text-gray-900'}`}
          placeholderTextColor={isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.3)'}
        />
        {isPassword && (
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
        )}
      </View>
      {errors[field] && (
        <Animated.Text
          entering={FadeIn.duration(300)}
          className="text-red-500 mt-1 text-xs pl-1"
        >
          {errors[field]}
        </Animated.Text>
      )}
    </View>
  );

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
            Create Account
          </Text>
        </View>

        {/* Form Container */}
        <View className="flex-1 px-8 pt-10">
          <Text className={`text-[#059669] text-xl font-bold mb-8`}>
            Join HabitMates today
          </Text>

          {renderInput('email', 'Email Address', 'your@email.com', 'mail')}
          {renderInput('username', 'Username', 'johnsmith', 'user')}
          {renderInput('password', 'Password', '••••••••', 'lock', true)}
          {renderInput('confirmPassword', 'Confirm Password', '••••••••', 'check', true)}

          {/* Create Account Button */}
          <TouchableOpacity
            onPress={handleSignUp}
            activeOpacity={0.8}
            disabled={isLoading}
            className={`mt-4 mb-6 rounded-xl py-4 bg-[#059669]`}
          >
            <Text className="text-center font-semibold text-base text-white">
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Text>
          </TouchableOpacity>

          {/* Sign In Link */}
          <View className="flex-row justify-center items-center">
            <Text className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Already have an account?{' '}
            </Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.push('/login')}
            >
              <Text className="text-[#059669] font-semibold">
                Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}