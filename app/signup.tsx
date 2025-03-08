import { useAuthStore } from '@/lib/stores/authStore';
import { useThemeStore } from '@/lib/stores/themeStore';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View, Platform } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

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
    placeholder: string,
    isPassword = false,
  ) => (
    <View className="mb-6">
      <Text className="text-base font-medium mb-2 text-white/90">
        {placeholder}
      </Text>
      <View className="overflow-hidden rounded-xl bg-white/10">
        <View className="flex-row items-center">
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
            className="flex-1 p-4 text-base text-white"
            placeholderTextColor="rgba(255,255,255,0.5)"
          />
          {isPassword && (
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              activeOpacity={0.7}
              className="pr-4"
            >
              <Feather
                name={showPassword ? 'eye-off' : 'eye'}
                size={20}
                color="rgba(255,255,255,0.6)"
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
      {errors[field] && (
        <Animated.Text 
          entering={FadeIn.duration(300)}
          className="text-red-400 mt-1 text-sm"
        >
          {errors[field]}
        </Animated.Text>
      )}
    </View>
  );

  return (
    <View className="flex-1">
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <View style={{ position: 'absolute', width: '100%', height: '100%' }}>
        <LinearGradient
          colors={isDark ?
            ['#6366f1', '#059669', '#6ee7b7'] :
            ['#059669', '#6ee7b7', '#818cf8']
          }
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
        {/* Header Section */}
        <Animated.View
          entering={FadeInDown.duration(1000).springify()}
          className="w-full h-80 items-center justify-end"
        >
          <View className="items-center">
            <Text className="text-5xl font-bold mb-3 text-white">
              HabitMates
            </Text>
            <Text className="text-lg text-white/80">
              Join our community today
            </Text>
          </View>
        </Animated.View>

        {/* Form Container */}
        <Animated.View
          entering={FadeIn.duration(1000)}
          className="flex-1 pt-10"
        >
          <View className="overflow-hidden rounded-t-3xl flex-1">
            <BlurView
              intensity={Platform.select({
                ios: isDark ? 90 : 70,
                android: isDark ? 70 : 45,
              })}
              tint={Platform.select({
                ios: 'dark',
                android: isDark ? 'dark' : 'light',
              })}
            
              className="p-8 flex-1"
            >
              {renderInput('email', 'Email Address')}
              {renderInput('username', 'Username')}
              {renderInput('password', 'Password', true)}
              {renderInput('confirmPassword', 'Confirm Password', true)}

              {/* Sign Up Button */}
              <TouchableOpacity
                onPress={handleSignUp}
                activeOpacity={0.8}
                disabled={isLoading}
                className="mb-6"
              >
                <View className='overflow-hidden rounded-xl'>
                  <TouchableOpacity
                    className='overflow-hidden rounded-xl bg-zinc-200 p-4'
                  >
                    <Text className="text-center font-semibold text-base text-indigo-950">
                      {isLoading ? 'Creating Account...' : 'Create Account'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>

              {/* Sign In Link */}
              <View className="flex-row justify-center items-center">
                <Text className="text-white/60">
                  Already have an account?{' '}
                </Text>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => router.push('/login')}
                >
                  <Text className="text-white font-semibold">
                    Sign In
                  </Text>
                </TouchableOpacity>
              </View>
            </BlurView>
          </View>
        </Animated.View>
      </KeyboardAwareScrollView>
    </View>
  );
}