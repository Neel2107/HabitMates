import { useAuthStore } from '@/lib/stores/authStore';
import { useThemeStore } from '@/lib/stores/themeStore';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import Animated, { 
  FadeIn, 
  FadeInDown, 
  FadeInUp, 
  Layout, 
  ZoomIn 
} from 'react-native-reanimated';
import { AnimatedButton } from '@/components/ui/AnimatedButton';

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
    delay = 0
  ) => (
    <Animated.View 
      entering={FadeInDown.duration(600).delay(delay)}
      layout={Layout.springify()}
    >
      <Text className={`mb-2 font-semibold ${
        isDark ? 'text-slate-200' : 'text-slate-700'
      }`}>
        {placeholder}
      </Text>
      <View className={`p-4 rounded-2xl border ${
        errors[field] ? 'border-red-500' :
        isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
      }`}>
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
            className={`flex-1 text-base ${
              isDark ? 'text-slate-200' : 'text-slate-700'
            }`}
            placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
          />
          {isPassword && (
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              activeOpacity={0.7}
              className="ml-2"
            >
              <Feather
                name={showPassword ? 'eye-off' : 'eye'}
                size={20}
                color={isDark ? '#64748b' : '#94a3b8'}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
      {errors[field] && (
        <Animated.Text 
          entering={FadeIn.duration(300)}
          className="text-red-500 mt-1 text-sm"
        >
          {errors[field]}
        </Animated.Text>
      )}
    </Animated.View>
  );

  return (
    <View className={`flex-1 ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <KeyboardAwareScrollView
        bottomOffset={400}
        keyboardShouldPersistTaps="handled"
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <Animated.View
          entering={FadeInUp.duration(1000).springify()}
          className={`w-full h-52 items-center justify-center rounded-b-[40px] ${
            isDark ? 'bg-indigo-600' : 'bg-indigo-500'
          }`}
        >
          <Animated.Image
            entering={ZoomIn.duration(800).delay(200)}
            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/6543/6543853.png' }}
            className="w-24 h-24 mb-2"
            resizeMode="contain"
          />
          <Animated.Text
            entering={FadeInDown.duration(600).delay(400)}
            className="text-white text-2xl font-bold"
          >
            Create Account
          </Animated.Text>
        </Animated.View>

        <Animated.View
          entering={FadeIn.duration(800).delay(600)}
          className="flex-1 px-6 pt-8"
        >
          <View className="flex-col gap-6">
            {renderInput('email', 'Email Address', false, 700)}
            {renderInput('username', 'Username', false, 800)}
            {renderInput('password', 'Password', true, 900)}
            {renderInput('confirmPassword', 'Confirm Password', true, 1000)}

            <Animated.View 
              entering={FadeInDown.duration(600).delay(1100)}
              className="mt-4"
            >
              <AnimatedButton
                onPress={handleSignUp}
                isLoading={isLoading}
                title="Sign Up"
                disabled={isLoading}
              />
            </Animated.View>

            <Animated.View
              entering={FadeInDown.duration(600).delay(1200)}
              className="flex-row justify-center gap-1 pt-4"
            >
              <Text className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                Already have an account?
              </Text>
              <TouchableOpacity 
                activeOpacity={0.7}
                onPress={() => router.push('/login')}
              >
                <Text className={`font-semibold ${
                  isDark ? 'text-indigo-400' : 'text-indigo-500'
                }`}>
                  Sign In
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </Animated.View>
      </KeyboardAwareScrollView>
    </View>
  );
}