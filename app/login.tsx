import { useAuthStore } from '@/lib/stores/authStore';
import { useThemeStore } from '@/lib/stores/themeStore';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import Animated, { FadeIn, FadeInDown, FadeInUp, ZoomIn } from 'react-native-reanimated';

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
      console.log(error)
    } finally {
      setIsLoading(false);
    }
  };

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
        {/* Animated Header */}
        <Animated.View
          entering={FadeInUp.duration(1000).springify()}
          className={`w-full h-72 items-center justify-center rounded-b-[40px] ${isDark ? 'bg-indigo-600' : 'bg-indigo-500'
            }`}
        >
          <Animated.Image
            entering={ZoomIn.duration(800).delay(200)}
            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/6543/6543853.png' }}
            className="w-28 h-28 mb-4"
            resizeMode="contain"
          />
          <Animated.Text
            entering={FadeInDown.duration(600).delay(400)}
            className="text-white text-3xl font-bold mb-1"
          >
            HabitMates
          </Animated.Text>
          <Animated.Text
            entering={FadeInDown.duration(600).delay(500)}
            className="text-indigo-100 text-lg font-medium"
          >
            Build habits together
          </Animated.Text>
        </Animated.View>

        {/* Form Container */}
        <Animated.View
          entering={FadeIn.duration(800).delay(600)}
          className="flex-1 px-6 pt-8"
        >
          <View className="flex-col gap-6">
            {/* Email Input */}
            <Animated.View entering={FadeInDown.duration(600).delay(700)}>
              <Text className={`mb-2 font-semibold ${isDark ? 'text-slate-200' : 'text-slate-700'
                }`}>
                Email Address
              </Text>
              <View className={`p-4 rounded-2xl border ${isDark
                ? 'bg-slate-800 border-slate-700'
                : 'bg-white border-slate-200'
                }`}>
                <TextInput
                  placeholder="john@example.com"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  className={`text-base ${isDark ? 'text-slate-200' : 'text-slate-700'
                    }`}
                  placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
                />
              </View>
            </Animated.View>

            {/* Password Input */}
            <Animated.View entering={FadeInDown.duration(600).delay(800)}>
              <Text className={`mb-2 font-semibold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                Password
              </Text>
              <View className={`p-4 rounded-2xl border flex-row items-center ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
                }`}>
                <TextInput
                  placeholder="••••••••"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  className={`flex-1 text-base ${isDark ? 'text-slate-200' : 'text-slate-700'
                    }`}
                  placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
                />
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
              </View>
            </Animated.View>

            {/* Forgot Password */}
            <Animated.View
              entering={FadeInDown.duration(600).delay(850)}
              className="items-end"
            >
              <TouchableOpacity activeOpacity={0.7}>
                <Text className={`font-medium ${isDark ? 'text-indigo-400' : 'text-indigo-500'
                  }`}>
                  Forgot Password?
                </Text>
              </TouchableOpacity>
            </Animated.View>

            {/* Login Button */}
            <Animated.View entering={FadeInDown.duration(600).delay(900)}>
              <TouchableOpacity
                onPress={handleLogin}
                activeOpacity={0.7}
                disabled={isLoading}
                className={`w-full py-5 rounded-2xl items-center justify-center ${isDark ? 'bg-indigo-500' : 'bg-indigo-500'
                  } ${isLoading ? 'opacity-70' : ''}`}
              >
                <Text className="text-white font-semibold text-lg">
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Text>
              </TouchableOpacity>
            </Animated.View>

            {/* Sign Up Link */}
            <Animated.View
              entering={FadeInDown.duration(600).delay(1100)}
              className="flex-row justify-center gap-1 pt-4"
            >
              <Text className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                New here?
              </Text>
              <TouchableOpacity activeOpacity={0.7}>
                <Text className={`font-semibold ${isDark ? 'text-indigo-400' : 'text-indigo-500'
                  }`}>
                  Create account
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </Animated.View>
      </KeyboardAwareScrollView>
    </View>
  );
}