import { AnimatedButton } from '@/components/ui/AnimatedButton';
import { useAuthStore } from '@/lib/stores/authStore';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Alert, Text, TextInput, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown
} from 'react-native-reanimated';

export default function LoginScreen() {
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
      router.replace('/(auth)/home');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="dark" />

      <Animated.View
        entering={FadeIn.duration(1000)}
        className="w-full h-1/3 bg-blue-500 rounded-b-[40px] items-center justify-center"
      >

      </Animated.View>

      <Animated.View
        entering={FadeInDown.duration(1000).delay(300)}
        className="flex-1 px-6 pt-8"
      >
        <Text className="text-3xl font-bold mb-2">Welcome Back!</Text>
        <Text className="text-gray-500 mb-8">Sign in to continue</Text>

        <View className="flex-col gap-4">
          <TextInput
            className="bg-gray-50 p-4 rounded-xl border border-gray-200"
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <TextInput
            className="bg-gray-50 p-4 rounded-xl border border-gray-200"
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <AnimatedButton
            title="Sign In"
            className='w-full py-4 rounded-xl bg-blue-500'
            onPress={handleLogin}
            isLoading={isLoading}
            disabled={!email || !password}
          />

          <Text className="text-center text-gray-500 mt-4">
            Don't have an account? Contact your administrator
          </Text>
        </View>
      </Animated.View>
    </View>
  );
}