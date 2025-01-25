import { useAuthStore } from "@/lib/stores/authStore";
import { supabase } from "@/lib/supabase";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from "react-native-keyboard-controller";
import { View, ActivityIndicator } from 'react-native';
import "../global.css";
import { useThemeStore } from "@/lib/stores/themeStore";
import { ThemeProvider } from '@/components/ThemeProvider';

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
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <KeyboardProvider>
          <Stack screenOptions={{
            headerShown: false,
          }} />
        </KeyboardProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}