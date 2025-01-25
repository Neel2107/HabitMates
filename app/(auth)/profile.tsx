import { useAuthStore } from '@/lib/stores/authStore';
import { useThemeStore } from '@/lib/stores/themeStore';
import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Image, ScrollView, Switch, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const achievements = [
    { id: 1, name: '7 Day Streak', icon: '🔥', description: 'Completed a habit for 7 days' },
    { id: 2, name: 'Early Bird', icon: '🌅', description: 'Completed morning habits 5 times' },
    { id: 3, name: 'Team Player', icon: '🤝', description: 'Connected with 3 partners' },
];

const ProfileScreen = () => {
    const mode = useThemeStore((state) => state.mode);
    const setMode = useThemeStore((state) => state.setMode);
    const isDark = useThemeStore((state) => state.isDark);
    // Remove the incorrect toggleTheme implementation
    const session = useAuthStore((state) => state.session);
    const signOut = useAuthStore((state) => state.signOut);
    const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);

    const userName = session?.user?.email?.split('@')[0] || 'User';
    const userEmail = session?.user?.email || 'email@example.com';

    return (
        <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-900">
            {/* Modern Minimal Header */}
            <Animated.View
                entering={FadeIn.duration(500)}
                className="px-6 pt-12 pb-6"
            >
                <View className="items-center">
                    <View className="relative">
                        <Image
                            source={{ uri: 'https://i.pravatar.cc/160' }}
                            className="w-20 h-20 rounded-full border-2 border-slate-100 dark:border-slate-700"
                        />
                        <TouchableOpacity
                            className="absolute bottom-0 right-0 bg-indigo-500 dark:bg-indigo-600 w-8 h-8 rounded-full items-center justify-center shadow-sm"
                            activeOpacity={0.8}
                        >
                            <Feather name="edit-2" size={15} color="white" />
                        </TouchableOpacity>
                    </View>
                    <Text className="text-xl font-bold text-slate-800 dark:text-white mt-4 capitalize">
                        {userName}
                    </Text>
                    <Text className="text-sm text-slate-500 dark:text-slate-400">
                        {userEmail}
                    </Text>
                </View>
            </Animated.View>

            <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
                {/* Achievements */}
                <View className="mb-8">
                    <Text className="text-base font-medium text-slate-500 dark:text-slate-400 mb-4">
                        ACHIEVEMENTS
                    </Text>
                    {achievements.map((achievement, index) => (
                        <Animated.View
                            key={achievement.id}
                            entering={FadeInDown.delay(index * 100).duration(500)}
                            className="bg-white dark:bg-slate-800 mb-3 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm"
                        >
                            <View className="flex-row items-center">
                                <View className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-xl items-center justify-center">
                                    <Text className="text-2xl">{achievement.icon}</Text>
                                </View>
                                <View className="flex-1 ml-3">
                                    <Text className="text-base font-semibold text-slate-800 dark:text-white">
                                        {achievement.name}
                                    </Text>
                                    <Text className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                                        {achievement.description}
                                    </Text>
                                </View>
                            </View>
                        </Animated.View>
                    ))}
                </View>

                {/* Settings */}
                <View className="mb-8">
                    <Text className="text-base font-medium text-slate-500 dark:text-slate-400 mb-4">
                        SETTINGS
                    </Text>
                    <View className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
                        <TouchableOpacity
                            className="p-4 flex-row items-center justify-between border-b border-slate-100 dark:border-slate-700"
                            activeOpacity={0.7}
                        >
                            <View className="flex-row items-center">
                                <View className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 items-center justify-center">
                                    <Feather name="user" size={18} color="#3b82f6" />
                                </View>
                                <Text className="font-medium ml-3 text-slate-800 dark:text-white">
                                    Edit Profile
                                </Text>
                            </View>
                            <Feather name="chevron-right" size={20} color={isDark ? '#94a3b8' : '#64748b'} />
                        </TouchableOpacity>

                        <View className="p-4 flex-row items-center justify-between border-b border-slate-100 dark:border-slate-700">
                            <View className="flex-row items-center">
                                <View className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 items-center justify-center">
                                    <Feather name="bell" size={18} color="#8b5cf6" />
                                </View>
                                <Text className="font-medium ml-3 text-slate-800 dark:text-white">
                                    Notifications
                                </Text>
                            </View>
                            <Switch
                                value={notificationsEnabled}
                                onValueChange={setNotificationsEnabled}
                                trackColor={{ false: '#cbd5e1', true: '#93c5fd' }}
                                thumbColor={notificationsEnabled ? '#3b82f6' : '#f1f5f9'}
                            />
                        </View>



                        {/* Theme Mode */}
                        <View className="p-4 flex-row items-center justify-between border-b border-slate-100 dark:border-slate-700">
                            <View className="flex-row items-center">
                                <View className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 items-center justify-center">
                                    <Feather name="sun" size={18} color="#6366f1" />
                                </View>
                                <Text className="font-medium ml-3 text-slate-800 dark:text-white">
                                    Theme
                                </Text>
                            </View>
                            <View className="flex-row items-center space-x-4">
                                {(['system', 'light', 'dark'] as const).map((themeMode) => (
                                    <TouchableOpacity
                                        key={themeMode}
                                        onPress={() => setMode(themeMode)}
                                        className={`px-3 py-1 rounded-full ${mode === themeMode
                                            ? 'bg-indigo-100 dark:bg-indigo-900/30'
                                            : 'bg-slate-100 dark:bg-slate-700/50'
                                            }`}
                                    >
                                        <Text className={`text-sm capitalize ${mode === themeMode
                                            ? 'text-indigo-500 dark:text-indigo-400'
                                            : 'text-slate-500 dark:text-slate-400'
                                            }`}>
                                            {themeMode}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        <TouchableOpacity
                            onPress={signOut}
                            className="p-4 flex-row items-center"
                            activeOpacity={0.7}
                        >
                            <View className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 items-center justify-center">
                                <Feather name="log-out" size={18} color="#ef4444" />
                            </View>
                            <Text className="text-red-500 font-medium ml-3">Log Out</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View className="h-6" />
            </ScrollView>
        </SafeAreaView>
    );
};

export default ProfileScreen;