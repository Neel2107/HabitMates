import CustomSwitch from '@/components/Switch/CustomSwitch';
import { useAuthStore } from '@/lib/stores/authStore';
import { useThemeStore } from '@/lib/stores/themeStore';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Path } from 'react-native-svg';

// Custom SVG Avatar component
const UserAvatar = ({ size = 80, color = "#059669", avatarUrl = null }: { size?: number; color?: string; avatarUrl?: string | null }) => {
    if (avatarUrl) {
        return (
            <Image
                source={{ uri: avatarUrl }}
                style={{ width: size, height: size, borderRadius: size / 2 }}
            />
        );
    }

    return (
        <Svg width={size} height={size} viewBox="0 0 80 80" fill="none">
            <Circle cx="40" cy="40" r="40" fill={color} />
            <Circle cx="40" cy="30" r="14" fill="white" />
            <Path d="M16 62C22 46 58 46 64 62" fill="white" />
            <Circle cx="40" cy="40" r="38" stroke="white" strokeWidth="2" />
        </Svg>
    );
};


// Move these interface definitions outside the component
interface BaseSettingProps {
    icon: string;
    name: string;
    color: string;
    bgColor: string;
    danger?: boolean;
}

const ProfileScreen = () => {
    const mode = useThemeStore((state) => state.mode);
    const setMode = useThemeStore((state) => state.setMode);
    const isDark = useThemeStore((state) => state.isDark);
    const session = useAuthStore((state) => state.session);
    const signOut = useAuthStore((state) => state.signOut);
    const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);

    const userName = session?.user?.user_metadata?.username || session?.user?.email?.split('@')[0] || 'User';
    const userEmail = session?.user?.email || 'email@example.com';
    const avatarUrl = session?.user?.user_metadata?.avatar_url;

    // Move these component definitions inside the main component to access isDark
    // Regular setting item with navigation/press action
    const NavigationSettingItem = ({ icon, name, color, bgColor, action, danger = false }: BaseSettingProps & { action?: () => void }) => (
        <TouchableOpacity
            className={`p-4 flex-row items-center justify-between border-b ${isDark ? 'border-gray-700/50' : 'border-gray-100'
                }`}
            activeOpacity={action ? 0.7 : 1}
            onPress={action}
        >
            <View className="flex-row items-center">
                <View className={`w-9 h-9 rounded-full items-center justify-center ${bgColor}`}>
                    <Feather name={icon as any} size={18} color={color} />
                </View>
                <Text className={`font-inter-medium ml-3 ${danger ? (isDark ? 'text-red-400' : 'text-red-500') :
                    isDark ? 'text-white' : 'text-gray-800'
                    }`}>
                    {name}
                </Text>
            </View>
            <Feather name="chevron-right" size={20} color={isDark ? '#94a3b8' : '#64748b'} />
        </TouchableOpacity>
    );

    // Setting item with toggle switch
    const SwitchSettingItem = ({ icon, name, color, bgColor, value, onValueChange }: BaseSettingProps & {
        value: boolean;
        onValueChange: (value: boolean) => void
    }) => (
        <TouchableOpacity
            className={`p-4 flex-row items-center justify-between border-b ${isDark ? 'border-gray-700/50' : 'border-gray-100'
                }`}
            activeOpacity={1}
            onPress={() => onValueChange(!value)}
        >
            <View className="flex-row items-center">
                <View className={`w-9 h-9 rounded-full items-center justify-center ${bgColor}`}>
                    <Feather name={icon as any} size={18} color={color} />
                </View>
                <Text className={`font-inter-medium ml-3 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                    {name}
                </Text>
            </View>
            <CustomSwitch
                value={value}
                onValueChange={onValueChange}
            />
        </TouchableOpacity>
    );

    // Action setting item without chevron (like logout)
    const ActionSettingItem = ({ icon, name, color, bgColor, action, danger = false }: BaseSettingProps & { action?: () => void }) => (
        <TouchableOpacity
            className={`p-4 flex-row items-center justify-between border-b ${isDark ? 'border-gray-700/50' : 'border-gray-100'
                }`}
            activeOpacity={0.7}
            onPress={action}
        >
            <View className="flex-row items-center">
                <View className={`w-9 h-9 rounded-full items-center justify-center ${bgColor}`}>
                    <Feather name={icon as any} size={18} color={color} />
                </View>
                <Text className={`font-inter-medium ml-3 ${danger ? (isDark ? 'text-red-400' : 'text-red-500') :
                    isDark ? 'text-white' : 'text-gray-800'
                    }`}>
                    {name}
                </Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView className={`flex-1 ${isDark ? 'bg-[#1a1a1a]' : 'bg-[#f5f9f8]'}`}>
            <StatusBar style={isDark ? 'light' : 'dark'} />

            {/* Header with profile info */}
            <Animated.View
                entering={FadeIn.duration(500)}
                className="px-6 pt-4 pb-6"
            >
                <View className="flex-row justify-between items-center">
                    <Text className={`text-2xl font-inter-bold ${isDark ? 'text-white' : 'text-[#1e293b]'}`}>
                        Profile
                    </Text>
                </View>
            </Animated.View>

            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 40 }}
            >
                {/* Profile Card */}
                <Animated.View
                    entering={FadeInDown.duration(500).delay(100)}
                    className={`mx-6 mb-6 p-6 rounded-2xl border shadow-sm ${isDark ? 'bg-gray-800/60 border-gray-700' : 'bg-white border-gray-100'
                        }`}
                >
                    <View className="items-center">
                        <View className="relative">
                            <UserAvatar
                                size={80}
                                color="#059669"
                                avatarUrl={avatarUrl}
                            />
                            {/* Keep this edit button on the avatar as it's a common pattern */}
                            <TouchableOpacity
                                onPress={() => router.push('/(auth)/edit-profile')}
                                className="absolute bottom-0 right-0 w-8 h-8 rounded-full items-center justify-center bg-[#059669]"
                                activeOpacity={0.8}
                            >
                                <Feather name="edit-2" size={15} color="white" />
                            </TouchableOpacity>
                        </View>

                        <Text className={`text-xl font-inter-bold mt-4 capitalize ${isDark ? 'text-white' : 'text-[#1e293b]'}`}>
                            {userName}
                        </Text>
                        <Text className={`text-sm font-inter-regular mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            {userEmail}
                        </Text>

                        <View className="flex-row gap-4 mt-6">
                            {/* Keep only one primary edit profile button */}
                            <TouchableOpacity
                                className="bg-[#059669] px-5 py-2.5 rounded-xl"
                                activeOpacity={0.8}
                                onPress={() => router.push('/(auth)/edit-profile')}
                            >
                                <Text className="text-white font-inter-medium">Edit Profile</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                className={`px-5 py-2.5 rounded-xl border ${isDark ? 'border-gray-700' : 'border-gray-200'
                                    }`}
                                activeOpacity={0.8}
                            >
                                <Text className={`font-inter-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>Share Stats</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Animated.View>

                {/* Settings */}
                <View className="px-6">
                    <Text className={`text-base font-inter-semibold mb-4 ${isDark ? 'text-gray-300' : 'text-[#1e293b]'}`}>
                        SETTINGS
                    </Text>

                    <View className={`rounded-2xl border overflow-hidden shadow-sm ${isDark ? 'bg-gray-800/60 border-gray-700' : 'bg-white border-gray-100'
                        }`}>
                        {/* Remove this duplicate navigation item */}
                        {/* <NavigationSettingItem
                            icon="user"
                            name="Edit Profile"
                            color={isDark ? '#059669' : '#059669'}
                            bgColor={isDark ? 'bg-[#059669]/20' : 'bg-[#e6f7f1]'}
                            action={() => router.navigate('/(auth)/edit-profile')}
                        /> */}

                        <SwitchSettingItem
                            icon="bell"
                            name="Notifications"
                            color={isDark ? '#059669' : '#059669'}
                            bgColor={isDark ? 'bg-[#059669]/20' : 'bg-[#e6f7f1]'}
                            value={notificationsEnabled}
                            onValueChange={setNotificationsEnabled}
                        />

                        {/* Theme Mode */}
                        <View className={`p-4 flex flex-row justify-between items-center border-b ${isDark ? 'border-gray-700/50' : 'border-gray-100'}`}>
                            <View className="flex-row items-center mb-3">
                                <View className={`w-9 h-9 rounded-full items-center justify-center ${isDark ? 'bg-[#059669]/20' : 'bg-[#e6f7f1]'
                                    }`}>
                                    <Feather
                                        name={isDark ? "moon" : "sun"}
                                        size={18}
                                        color="#059669"
                                    />
                                </View>
                                <Text className={`font-inter-medium ml-3 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                                    Theme
                                </Text>
                            </View>

                            <View className="flex-row gap-2 ml-12">
                                {(['system', 'light', 'dark'] as const).map((themeMode) => (
                                    <TouchableOpacity
                                        key={themeMode}
                                        onPress={() => setMode(themeMode)}
                                        className={`px-4 py-2 rounded-xl ${mode === themeMode
                                            ? 'bg-[#059669]'
                                            : isDark ? 'bg-gray-700/50' : 'bg-gray-100'
                                            }`}
                                    >
                                        <Text className={`text-sm capitalize font-inter-medium ${mode === themeMode
                                            ? 'text-white'
                                            : isDark ? 'text-gray-300' : 'text-gray-700'
                                            }`}>
                                            {themeMode}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        <ActionSettingItem
                            icon="log-out"
                            name="Log Out"
                            color={isDark ? '#f87171' : '#ef4444'}
                            bgColor={isDark ? 'bg-red-900/30' : 'bg-red-100'}
                            action={signOut}
                            danger={true}
                        />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default ProfileScreen;