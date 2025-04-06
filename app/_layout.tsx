import { ThemeProvider } from '@/components/ThemeProvider';
import { useAuthStore } from "@/lib/stores/authStore";
import { useThemeStore } from "@/lib/stores/themeStore";
import { supabase } from "@/lib/supabase";
import { loadFonts } from "@/lib/fonts";
import { Stack } from "expo-router";
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from "react-native-keyboard-controller";
import "../global.css";

export default function RootLayout() {
  const isDark = useThemeStore((state) => state.isDark);
  const setSession = useAuthStore((state) => state.setSession);
  const isLoading = useAuthStore((state) => state.isLoading);
  const setIsLoading = useAuthStore((state) => state.setIsLoading);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const loadApp = async () => {
      try {
        // Load fonts
        await loadFonts();
        setFontsLoaded(true);
        
        // Check for existing session
        setIsLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setIsLoading(false);
        
        // Hide splash screen
        await SplashScreen.hideAsync();
      } catch (e) {
        console.warn(e);
        setIsLoading(false);
        await SplashScreen.hideAsync();
      }
    };

    loadApp();
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (isLoading || !fontsLoaded) {
    return (
      <View className={`flex-1 items-center justify-center ${isDark ? 'bg-app-dark' : 'bg-app-light'}`}>
        <ActivityIndicator size="large" color={isDark ? '#6ee7b7' : '#059669'} />
      </View>
    );
  }

  return (
    <ThemeProvider>
      <KeyboardProvider>

      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
        }}
        />
        </KeyboardProvider>
    </ThemeProvider>
  );
}