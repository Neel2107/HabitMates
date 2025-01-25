import { ThemeProvider } from '@/components/ThemeProvider';
import { useAuthStore } from "@/lib/stores/authStore";
import { useThemeStore } from "@/lib/stores/themeStore";
import { supabase } from "@/lib/supabase";
import { Stack } from "expo-router";
import { StatusBar } from 'expo-status-bar';
import { useEffect } from "react";
import { ActivityIndicator, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from "react-native-keyboard-controller";
import "../global.css";

export default function RootLayout() {
  const isDark = useThemeStore((state) => state.isDark);
  const setSession = useAuthStore((state) => state.setSession);
  const isLoading = useAuthStore((state) => state.isLoading);
  const setIsLoading = useAuthStore((state) => state.setIsLoading);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
      } catch (error) {
        console.error('Error loading session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    initializeAuth();
  }, []);

  if (isLoading) {
    return (
      <View className={`flex-1 items-center justify-center ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <ActivityIndicator size="large" color={isDark ? '#60a5fa' : '#3b82f6'} />
      </View>
    );
  }

  return (
    <ThemeProvider>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <GestureHandlerRootView className="flex-1">
        <KeyboardProvider>
          {isLoading ? (
            <View className={`flex-1 items-center justify-center ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
              <ActivityIndicator size="large" color={isDark ? '#60a5fa' : '#3b82f6'} />
            </View>
          ) : (
            <Stack screenOptions={{ headerShown: false }} />
          )}
        </KeyboardProvider>
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}