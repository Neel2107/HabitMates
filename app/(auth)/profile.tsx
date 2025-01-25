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
    const isDark = useThemeStore((state) => state.isDark);
    const toggleTheme = useThemeStore((state) => state.toggleTheme);
    const session = useAuthStore((state) => state.session);
    const signOut = useAuthStore((state) => state.signOut);
    const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
    // Remove the local darkMode state since we're using global theme state

    const userName = session?.user?.email?.split('@')[0] || 'User';
    const userEmail = session?.user?.email || 'email@example.com';

    return (
        <SafeAreaView className={`flex-1 ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
            {/* Header */}
            <Animated.View
                entering={FadeIn.duration(500)}
                className={`px-6 pt-6 pb-8 ${isDark ? 'bg-indigo-600' : 'bg-indigo-500'}`}
            >
                <View className="items-center">
                    <View className="relative">
                        <Image
                            source={{ uri: 'https://i.pravatar.cc/160' }}
                            className="w-24 h-24 rounded-full border-4 border-white"
                        />
                        <TouchableOpacity
                            className="absolute bottom-0 right-0 bg-white w-8 h-8 rounded-full items-center justify-center"
                            activeOpacity={0.8}
                        >
                            <Feather name="edit-2" size={16} color="#6366f1" />
                        </TouchableOpacity>
                    </View>
                    <Text className="text-white text-2xl font-bold mt-4 capitalize">{userName}</Text>
                    <Text className="text-indigo-100">{userEmail}</Text>
                </View>
            </Animated.View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Achievements */}
                <View className="p-6">
                    <Text className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                        Achievements
                    </Text>
                    {achievements.map((achievement, index) => (
                        <Animated.View
                            key={achievement.id}
                            entering={FadeInDown.delay(index * 100).duration(500)}
                            className={`mb-3 p-4 rounded-2xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
                                }`}
                        >
                            <View className="flex-row items-center">
                                <Text className="text-3xl mr-3">{achievement.icon}</Text>
                                <View className="flex-1">
                                    <Text className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-800'
                                        }`}>
                                        {achievement.name}
                                    </Text>
                                    <Text className={`${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                        {achievement.description}
                                    </Text>
                                </View>
                            </View>
                        </Animated.View>
                    ))}
                </View>

                {/* Settings */}
                <View className="px-6 pb-6">
                    <Text className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                        Settings
                    </Text>

                    <View className={`rounded-2xl border overflow-hidden ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
                        }`}>
                        {/* Notifications */}
                        <View className={`p-4 flex-row items-center justify-between border-b ${isDark ? 'border-slate-700' : 'border-slate-100'
                            }`}>
                            <View className="flex-row items-center">
                                <Feather name="bell" size={20} color={isDark ? '#e2e8f0' : '#64748b'} />
                                <Text className={`font-medium ml-3 ${isDark ? 'text-white' : 'text-slate-800'
                                    }`}>
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

                        {/* Dark Mode */}
                        <View className={`p-4 flex-row items-center justify-between border-b ${isDark ? 'border-slate-700' : 'border-slate-100'
                            }`}>
                            <View className="flex-row items-center">
                                <Feather name="moon" size={20} color={isDark ? '#e2e8f0' : '#64748b'} />
                                <Text className={`font-medium ml-3 ${isDark ? 'text-white' : 'text-slate-800'
                                    }`}>
                                    Dark Mode
                                </Text>
                            </View>
                            <Switch
                                value={isDark}
                                onValueChange={toggleTheme}
                                trackColor={{ false: '#cbd5e1', true: '#93c5fd' }}
                                thumbColor={isDark ? '#3b82f6' : '#f1f5f9'}
                            />
                        </View>

                        {/* Log Out */}
                        <TouchableOpacity
                            onPress={signOut}
                            className={`p-4 flex-row items-center ${isDark ? 'border-slate-700' : 'border-slate-100'
                                }`}
                            activeOpacity={0.7}
                        >
                            <Feather name="log-out" size={20} color="#ef4444" />
                            <Text className="text-red-500 font-medium ml-3">Log Out</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default ProfileScreen;