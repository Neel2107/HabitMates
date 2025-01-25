

import { useAuthStore } from '@/lib/stores/authStore';
import { useThemeStore } from '@/lib/stores/themeStore';
import { Redirect } from 'expo-router';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const NotFoundScreen = () => {
    const isDark = useThemeStore((state) => state.isDark);
    const session = useAuthStore((state) => state.session);
    const isLoading = useAuthStore((state) => state.isLoading);

    if (isLoading) {
        return (
            <SafeAreaView className={`flex-1 ${isDark ? 'bg-app-dark' : 'bg-app-light'}`}>
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color={isDark ? '#6ee7b7' : '#059669'} />
                </View>
            </SafeAreaView>
        );
    }

    return <Redirect href={session ? "/(auth)/(tabs)/home" : "/login"} />;
};

export default NotFoundScreen;