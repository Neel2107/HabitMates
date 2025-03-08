import { ThemeProvider } from "@/components/ThemeProvider";
import { useAuthStore } from "@/lib/stores/authStore";
import { useThemeStore } from "@/lib/stores/themeStore";
import { Redirect, Stack } from "expo-router";
import { StatusBar } from 'expo-status-bar';
import { View } from "react-native";

export default function AuthLayout() {
    const isDark = useThemeStore((state) => state.isDark);
    const session = useAuthStore((state) => state.session);

    if (!session) {
        return <Redirect href="/login" />;
    }

    return (
        <ThemeProvider>
            <StatusBar style={isDark ? 'light' : 'dark'} />
            <View className={`flex-1 ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
                <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="(tabs)" />
                    <Stack.Screen name="edit-profile" />
                </Stack>
            </View>
        </ThemeProvider>
    );
}