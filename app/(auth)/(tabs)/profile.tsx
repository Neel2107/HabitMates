import CustomSwitch from '@/components/Switch/CustomSwitch';
import { useAuthStore } from '@/lib/stores/authStore';
import { useThemeStore } from '@/lib/stores/themeStore';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
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
    const session = useAuthStore((state) => state.session);
    const signOut = useAuthStore((state) => state.signOut);
    const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);

    const userName = session?.user?.email?.split('@')[0] || 'User';
    const userEmail = session?.user?.email || 'email@example.com';
    const avatarUrl = session?.user?.user_metadata?.avatar_url;

    return (
        <SafeAreaView className={`flex-1 ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
            <StatusBar style={isDark ? 'light' : 'dark'} />
            {/* Modern Minimal Header */}
            <View className="items-center pt-4">
                <View className="relative">
                    <Image
                        source={{
                            uri: avatarUrl || 'https://cdn-icons-png.flaticon.com/512/6543/6543853.png'
                        }}
                        className={`w-20 h-20 rounded-full border-2 ${isDark ? 'border-slate-700' : 'border-slate-100'}`}
                    />
                    <TouchableOpacity
                        onPress={() => router.push('/(auth)/edit-profile')}
                        className={`absolute bottom-0 right-0 w-8 h-8 rounded-full items-center justify-center ${isDark ? 'bg-indigo-600' : 'bg-indigo-500'
                            }`}
                        activeOpacity={0.8}
                    >
                        <Feather name="edit-2" size={15} color="white" />
                    </TouchableOpacity>
                </View>
                <Text className={`text-xl font-bold mt-4 capitalize ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    {userName}
                </Text>
                <Text className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {userEmail}
                </Text>
            </View>


            <ScrollView className="flex-1 px-6  "
                contentContainerClassName='gap-4 pt-4'
                showsVerticalScrollIndicator={false}>
                {/* Achievements */}
                <View className="">
                    <Text className={`text-base font-medium mb-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        ACHIEVEMENTS
                    </Text>
                    {achievements.map((achievement, index) => (
                        <Animated.View
                            key={achievement.id}
                            entering={FadeInDown.delay(index * 100).duration(500)}
                            className={`mb-3 p-4 rounded-2xl border   ${isDark
                                ? 'bg-slate-800 border-slate-700'
                                : 'bg-white border-slate-100'
                                }`}
                        >
                            <View className="flex-row items-center">
                                <View className={`w-12 h-12 rounded-xl items-center justify-center ${isDark ? 'bg-slate-700' : 'bg-slate-100'
                                    }`}>
                                    <Text style={{ fontSize: 24 }}>{achievement.icon}</Text>
                                </View>
                                <View className="flex-1 ml-3">
                                    <Text className={`text-base font-semibold ${isDark ? 'text-white' : 'text-slate-800'
                                        }`}>
                                        {achievement.name}
                                    </Text>
                                    <Text className={`text-sm mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'
                                        }`}>
                                        {achievement.description}
                                    </Text>
                                </View>
                            </View>
                        </Animated.View>
                    ))}
                </View>

                {/* Settings */}
                <View className="">
                    <Text className={`text-base font-medium mb-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        SETTINGS
                    </Text>
                    <View className={`rounded-2xl border   overflow-hidden ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'
                        }`}>
                        <TouchableOpacity
                            className={`p-4 flex-row items-center justify-between border-b ${isDark ? 'border-slate-700' : 'border-slate-100'
                                }`}
                            activeOpacity={0.7}
                            onPress={() => router.navigate('/(auth)/edit-profile')}
                        >
                            <View className="flex-row items-center">
                                <View className={`w-8 h-8 rounded-full items-center justify-center ${isDark ? 'bg-blue-900/30' : 'bg-blue-100'
                                    }`}>
                                    <Feather name="user" size={18} color={isDark ? '#60a5fa' : '#3b82f6'} />
                                </View>
                                <Text className={`font-medium ml-3 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                    Edit Profile
                                </Text>
                            </View>
                            <Feather name="chevron-right" size={20} color={isDark ? '#94a3b8' : '#64748b'} />
                        </TouchableOpacity>

                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => setNotificationsEnabled(!notificationsEnabled)}
                            className={`p-4 flex-row items-center justify-between border-b ${isDark ? 'border-slate-700' : 'border-slate-100'
                                }`}>
                            <View className="flex-row items-center">
                                <View className={`w-8 h-8 rounded-full items-center justify-center ${isDark ? 'bg-purple-900/30' : 'bg-purple-100'
                                    }`}>
                                    <Feather name="bell" size={18} color={isDark ? '#a78bfa' : '#8b5cf6'} />
                                </View>
                                <Text className={`font-medium ml-3 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                    Notifications
                                </Text>
                            </View>

                            <CustomSwitch
                                value={notificationsEnabled}
                                onValueChange={setNotificationsEnabled}
                            />

                        </TouchableOpacity>

                        {/* Theme Mode */}
                        <View className={`p-4 flex-row items-center justify-between border-b ${isDark ? 'border-slate-700' : 'border-slate-100'
                            }`}>
                            <View className="flex-row items-center">
                                <View className={`w-8 h-8 rounded-full items-center justify-center ${isDark ? 'bg-indigo-900/30' : 'bg-indigo-100'
                                    }`}>
                                    <Feather name="sun" size={18} color={isDark ? '#818cf8' : '#6366f1'} />
                                </View>
                                <Text className={`font-medium ml-3 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                    Theme
                                </Text>
                            </View>
                            <View className="flex-row items-center gap-2">
                                {(['system', 'light', 'dark'] as const).map((themeMode) => (
                                    <TouchableOpacity
                                        key={themeMode}
                                        onPress={() => setMode(themeMode)}
                                        className={`px-3 py-1 rounded-full ${mode === themeMode
                                            ? isDark ? 'bg-indigo-900/30' : 'bg-indigo-100'
                                            : isDark ? 'bg-slate-700/50' : 'bg-slate-100'
                                            }`}
                                    >
                                        <Text className={`text-sm capitalize ${mode === themeMode
                                            ? isDark ? 'text-indigo-400' : 'text-indigo-500'
                                            : isDark ? 'text-slate-400' : 'text-slate-500'
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
                            <View className={`w-8 h-8 rounded-full items-center justify-center ${isDark ? 'bg-red-900/30' : 'bg-red-100'
                                }`}>
                                <Feather name="log-out" size={18} color={isDark ? '#f87171' : '#ef4444'} />
                            </View>
                            <Text className={`font-medium ml-3 ${isDark ? 'text-red-400' : 'text-red-500'}`}>
                                Log Out
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default ProfileScreen;