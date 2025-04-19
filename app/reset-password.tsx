import { CustomButton } from '@/components/ui/CustomButton';
import { useAuthStore } from '@/lib/stores/authStore';
import { useThemeStore } from '@/lib/stores/themeStore';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Alert, Image, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import Animated, { FadeIn } from 'react-native-reanimated';

export default function ResetPasswordScreen() {
  const isDark = useThemeStore((state) => state.isDark);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const resetPassword = useAuthStore((state) => state.resetPassword);

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword(email);
      Alert.alert(
        'Success',
        'Password reset instructions have been sent to your email',
        [{ text: 'OK', onPress: () => router.back() }]
      );
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
              style={{ width: 180, height: 180 }}
              resizeMode="cover"
            />
            <Text className="text-4xl font-inter-bold text-[#1e293b] mt-2">
              Reset your password
            </Text>
            <Text className="text-center text-gray-600 font-inter-regular mt-2 mb-4">
              Enter your email address and we'll send you instructions to reset your password
            </Text>
          </View>

          {/* Reset Password Form */}
          <Animated.View
            entering={FadeIn.duration(800)}
            className="mb-8"
          >
            {/* Email Input */}
            <View className="mb-6">
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

            {/* Reset Button */}
            <View className='mb-8'>
              <CustomButton
                onPress={handleResetPassword}
                title="RESET PASSWORD"
                isLoading={isLoading}
                loadingText="RESETTING..."
                disabled={isLoading || !email}
                textColor="white"
              />
            </View>

            {/* Back to Login */}
            <View className="flex-row justify-center items-center">
              <Text className="text-gray-700 font-inter-regular text-base">
                Remember your password?
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