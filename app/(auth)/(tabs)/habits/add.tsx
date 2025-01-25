import { jsonLog } from '@/lib/helpers';
import { useAuthStore } from '@/lib/stores/authStore';
import { useHabitsStore } from '@/lib/stores/habitsStore';
import { useThemeStore } from '@/lib/stores/themeStore';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, Layout } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const AddHabitScreen = () => {
    const isDark = useThemeStore((state) => state.isDark);
    const createHabit = useHabitsStore((state) => state.createHabit);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedPartners, setSelectedPartners] = useState<string[]>([]);
    const session = useAuthStore((state) => state.session);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        frequency: 'daily' as 'daily' | 'weekly',
        target_days: 7,
        is_public: false,
        start_date: new Date().toISOString(),
        end_date: null as string | null,
        status: 'active' as 'active' | 'completed' | 'archived'
    });

    const handleCreate = async () => {
        if (!formData.name) {
            Alert.alert('Error', 'Please enter a habit name');
            return;
        }
        setIsLoading(true);
        jsonLog(formData);
        try {
            await createHabit(formData);
            router.back();
        } catch (error: any) {
            Alert.alert('Error', error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView className={`flex-1 ${isDark ? 'bg-app-dark' : 'bg-app-light'}`}>
            <Animated.View
                entering={FadeIn.duration(500)}
                className="px-6 pt-4 pb-6 flex-row items-center justify-between"
            >
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="p-2 -ml-2"
                    activeOpacity={0.7}
                >
                    <Feather
                        name="x"
                        size={24}
                        color={isDark ? '#e2e8f0' : '#0f172a'}
                    />
                </TouchableOpacity>
                <Text className={`text-xl font-bold ${isDark ? 'text-content-primary-dark' : 'text-content-primary-light'}`}>
                    New Habit
                </Text>
                <TouchableOpacity
                    onPress={handleCreate}
                    disabled={isLoading}
                    className={`py-2 px-4 rounded-full ${isDark ? 'bg-brand-primary-dark' : 'bg-brand-primary'}`}
                    activeOpacity={0.7}
                >
                    <Text className="text-white font-medium">
                        {isLoading ? 'Creating...' : 'Create'}
                    </Text>
                </TouchableOpacity>
            </Animated.View>

            <ScrollView
                className="flex-1 px-6"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 40 }}
            >
                <Animated.View
                    className="gap-6"
                    layout={Layout.springify()}
                >
                    {/* Basic Info Fields */}
                    {[
                        { label: 'Habit Name', key: 'name', icon: 'star', placeholder: 'e.g., Morning Meditation' },
                        { label: 'Description', key: 'description', icon: 'file-text', multiline: true, placeholder: 'What do you want to achieve?' },
                    ].map((field, index) => (
                        <Animated.View
                            key={field.key}
                            entering={FadeInDown.duration(500).delay(200 + index * 100)}
                            layout={Layout.springify()}
                            className={`rounded-2xl border ${isDark
                                ? 'bg-app-card-dark border-border-dark'
                                : 'bg-app-card-light border-border-light'}`}
                        >
                            <View className="p-4">
                                <Text className={`text-sm font-medium mb-2 ${isDark
                                    ? 'text-content-secondary-dark'
                                    : 'text-content-secondary-light'
                                    }`}>
                                    {field.label}
                                </Text>
                                <View className="flex-row items-center">
                                    <Feather
                                        name={field.icon as any}
                                        size={18}
                                        color={isDark ? '#94a3b8' : '#64748b'}
                                        style={{ marginRight: 12 }}
                                    />
                                    <TextInput
                                        value={formData[field.key as keyof typeof formData] as string}
                                        onChangeText={(text) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                [field.key]: text,
                                            }))
                                        }
                                        multiline={field.multiline}
                                        numberOfLines={field.multiline ? 3 : 1}
                                        className={`flex-1 text-base ${isDark
                                            ? 'text-content-primary-dark'
                                            : 'text-content-primary-light'
                                            }`}
                                        placeholderTextColor={isDark ? '#94a3b8' : '#64748b'}
                                        placeholder={`Enter ${field.label.toLowerCase()}`}
                                    />
                                </View>
                            </View>
                        </Animated.View>
                    ))}

                    {/* Frequency Selection with enhanced UI */}
                    <Animated.View
                        entering={FadeInDown.duration(500).delay(400)}
                        layout={Layout.springify()}
                        className={`rounded-2xl border ${isDark
                            ? 'bg-app-card-dark border-border-dark'
                            : 'bg-app-card-light border-border-light'}`}
                    >
                        <View className="p-4">
                            <Text className={`text-sm font-medium mb-4 ${isDark
                                ? 'text-content-secondary-dark'
                                : 'text-content-secondary-light'}`}>
                                How often?
                            </Text>
                            <View className="gap-4">
                                <View className="flex-row items-center p-2 rounded-xl bg-gray-100 dark:bg-gray-800">
                                    {[
                                        { value: 'daily', icon: 'sun', label: 'Daily', description: 'Every day' },
                                        { value: 'weekly', icon: 'calendar', label: 'Weekly', description: 'Specific days' }
                                    ].map((freq) => (
                                        <TouchableOpacity
                                            key={freq.value}
                                            onPress={() => setFormData(prev => ({ ...prev, frequency: freq.value as 'daily' | 'weekly' }))}
                                            className={`flex-1 py-4 px-4 rounded-lg ${formData.frequency === freq.value
                                                ? isDark
                                                    ? 'bg-brand-primary-dark'
                                                    : 'bg-brand-primary'
                                                : 'bg-transparent'}`}
                                        >
                                            <View className="items-center gap-2">
                                                <Feather
                                                    name={freq.icon as 'sun' | 'calendar'}
                                                    size={24}
                                                    color={formData.frequency === freq.value
                                                        ? '#ffffff'
                                                        : isDark ? '#94a3b8' : '#64748b'}
                                                />
                                                <Text
                                                    className={`font-semibold ${formData.frequency === freq.value
                                                        ? 'text-white'
                                                        : isDark ? 'text-content-primary-dark' : 'text-content-primary-light'}`}
                                                >
                                                    {freq.label}
                                                </Text>
                                                <Text
                                                    className={`text-xs ${formData.frequency === freq.value
                                                        ? 'text-white/80'
                                                        : isDark ? 'text-content-secondary-dark' : 'text-content-secondary-light'}`}
                                                >
                                                    {freq.description}
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    ))}
                                </View>

                                {/* Target Days Input with better UX */}
                                // Update the Target Days section
                                <View className="mt-4">
                                    <View className="flex-row items-center justify-between mb-2">
                                        <Text className={`text-sm font-medium ${isDark
                                            ? 'text-content-secondary-dark'
                                            : 'text-content-secondary-light'}`}>
                                            Target Days
                                        </Text>
                                        <Text className={`text-xs ${isDark
                                            ? 'text-content-tertiary-dark'
                                            : 'text-content-tertiary-light'}`}>
                                            {formData.target_days} days
                                        </Text>
                                    </View>
                                    <View className={`p-4 rounded-xl border ${isDark
                                        ? 'bg-app-card-dark border-border-dark'
                                        : 'bg-app-card-light border-border-light'}`}>
                                        <TextInput
                                            value={formData.target_days.toString()}
                                            onChangeText={(text) =>
                                                setFormData(prev => ({
                                                    ...prev,
                                                    target_days: parseInt(text) || 0
                                                }))
                                            }
                                            keyboardType="numeric"
                                            className={`text-base ${isDark
                                                ? 'text-content-primary-dark'
                                                : 'text-content-primary-light'}`}
                                            placeholderTextColor={isDark ? '#94a3b8' : '#64748b'}
                                            placeholder="Enter target days"
                                        />
                                    </View>
                                </View>
                            </View>
                        </View>
                    </Animated.View>

                    {/* Privacy Settings with enhanced UI */}
                    <Animated.View
                        entering={FadeInDown.duration(500).delay(500)}
                        layout={Layout.springify()}
                        className={`rounded-2xl border ${isDark
                            ? 'bg-app-card-dark border-border-dark'
                            : 'bg-app-card-light border-border-light'}`}
                    >
                        <View className="p-4">
                            <View className="flex-row items-center justify-between">
                                <View className="flex-1 mr-4">
                                    <Text className={`text-sm font-medium ${isDark
                                        ? 'text-content-secondary-dark'
                                        : 'text-content-secondary-light'}`}>
                                        Make Public
                                    </Text>
                                    <Text className={`text-xs mt-1 ${isDark
                                        ? 'text-slate-400'
                                        : 'text-content-tertiary-light'}`}>
                                        Others can see and join your habit
                                    </Text>
                                </View>
                                <Switch
                                    value={formData.is_public}
                                    onValueChange={(value) =>
                                        setFormData(prev => ({ ...prev, isPublic: value }))
                                    }
                                />
                            </View>
                        </View>
                    </Animated.View>

                    {/* Partner Selection */}
                    <Animated.View
                        entering={FadeInDown.duration(500).delay(600)}
                        className={`rounded-2xl border ${isDark
                            ? 'bg-app-card-dark border-border-dark'
                            : 'bg-app-card-light border-border-light'}`}
                    >
                        <View className="p-4">
                            <Text className={`text-sm font-medium mb-4 ${isDark
                                ? 'text-content-secondary-dark'
                                : 'text-content-secondary-light'}`}>
                                Invite Partners
                            </Text>
                            <TouchableOpacity
                                onPress={() => {
                                    // TODO: Implement partner selection modal
                                    Alert.alert('Coming Soon', 'Partner selection will be available soon!');
                                }}
                                className={`flex-row items-center p-3 rounded-xl border ${isDark
                                    ? 'border-border-dark'
                                    : 'border-border-light'}`}
                            >
                                <Feather
                                    name="users"
                                    size={20}
                                    color={isDark ? '#94a3b8' : '#64748b'}
                                />
                                <Text className={`ml-3 ${isDark
                                    ? 'text-content-primary-dark'
                                    : 'text-content-primary-light'}`}>
                                    Select Partners
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                </Animated.View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default AddHabitScreen;