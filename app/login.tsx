import { AnimatedButton } from '@/components/ui/AnimatedButton';
import { useAuthStore } from '@/lib/stores/authStore';
import { useThemeStore } from '@/lib/stores/themeStore';
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
    <View className={`flex-1 ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <KeyboardAwareScrollView
        bottomOffset={400}
        keyboardShouldPersistTaps="always"
        className="flex-1"
        showsVerticalScrollIndicator={false}
      >
        {/* Animated Header */}
        <Animated.View
          entering={FadeInUp.duration(1000).springify()}
          className="w-full h-72 items-center justify-center bg-indigo-500 rounded-b-[40px]"
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
              <Text className="text-slate-700 mb-2 font-semibold">Email Address</Text>
              <View className="bg-white p-4 rounded-2xl border border-slate-200">
                <TextInput
                  placeholder="john@example.com"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  className="text-slate-700 text-base"
                  placeholderTextColor="#94a3b8"
                />
              </View>
            </Animated.View>

            {/* Password Input */}
            <Animated.View entering={FadeInDown.duration(600).delay(800)}>
              <Text className="text-slate-700 mb-2 font-semibold">Password</Text>
              <View className="bg-white p-4 rounded-2xl border border-slate-200">
                <TextInput
                  placeholder="••••••••"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  className="text-slate-700 text-base"
                  placeholderTextColor="#94a3b8"
                />
              </View>
            </Animated.View>

            {/* Login Button */}
            <Animated.View entering={FadeInDown.duration(600).delay(900)}>
              <AnimatedButton
                title="Sign In"
                onPress={handleLogin}
                isLoading={isLoading}
                className="w-full py-5 rounded-2xl bg-indigo-500"
                variant="primary"
              />
            </Animated.View>



            {/* Sign Up Link */}
            <Animated.View
              entering={FadeInDown.duration(600).delay(1100)}
              className="flex-row justify-center gap-1 pt-4"
            >
              <Text className="text-slate-500">New here?</Text>
              <TouchableOpacity activeOpacity={0.7}>
                <Text className="text-indigo-500 font-semibold">Create account</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </Animated.View>
      </KeyboardAwareScrollView>
    </View>
  );
}