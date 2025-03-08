import { useAuthStore } from '@/lib/stores/authStore';
import { useThemeStore } from '@/lib/stores/themeStore';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Alert, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

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
        <Animated.View
          entering={FadeInDown.duration(1000).springify()}
          className="w-full h-80 items-center justify-end"
        >
          <View className="items-center">
            <Text className="text-5xl font-bold mb-3 text-white">
              Reset Password
            </Text>
            <Text className="text-lg text-white/80 text-center px-6">
              Enter your email address and we'll send you instructions to reset your password
            </Text>
          </View>
        </Animated.View>

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
              <View className="mb-6">
                <Text className="text-base font-medium mb-2 text-white/90">
                  Email Address
                </Text>
                <View className="overflow-hidden rounded-xl bg-white/10">
                  <TextInput
                    placeholder="john@example.com"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    className="p-4 text-base text-white"
                    placeholderTextColor="rgba(255,255,255,0.5)"
                  />
                </View>
              </View>

              <TouchableOpacity
                onPress={handleResetPassword}
                activeOpacity={0.8}
                disabled={isLoading}
                className="mb-6"
              >
                <View className='overflow-hidden rounded-xl'>
                  <TouchableOpacity
                    className='overflow-hidden rounded-xl bg-zinc-200 p-4'
                  >
                    <Text className="text-center font-semibold text-base text-indigo-950">
                      {isLoading ? 'Sending...' : 'Send Reset Instructions'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>

              <View className="flex-row justify-center items-center">
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => router.back()}
                >
                  <Text className="text-white font-semibold">
                    Back to Login
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