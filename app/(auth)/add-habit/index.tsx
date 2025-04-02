import CustomSwitch from '@/components/Switch/CustomSwitch';
import { useAuthStore } from '@/lib/stores/authStore';
import { useHabitsStore } from '@/lib/stores/habitsStore';
import { useThemeStore } from '@/lib/stores/themeStore';
import { Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, LinearTransition } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

interface FormErrors {
    name?: string;
    target_days?: string;
}

const AddHabitScreen = () => {
    const isDark = useThemeStore((state) => state.isDark);
    const { createHabit, updateHabit, deleteHabit, habits } = useHabitsStore();
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [selectedPartners, setSelectedPartners] = useState<string[]>([]);
    const [errors, setErrors] = useState<FormErrors>({});
    const session = useAuthStore((state) => state.session);
    const { id } = useLocalSearchParams();
    const habitId = Array.isArray(id) ? id[0] : id;
    const isEditing = !!habitId;

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

    useEffect(() => {
        if (isEditing && habitId) {
            const habitToEdit = habits.find(h => String(h.id) === String(habitId));
            if (habitToEdit) {
                setFormData({
                    name: habitToEdit.name || '',
                    description: habitToEdit.description || '',
                    frequency: habitToEdit.frequency || 'daily',
                    target_days: habitToEdit.target_days || 7,
                    is_public: habitToEdit.is_public || false,
                    start_date: habitToEdit.start_date || new Date().toISOString(),
                    end_date: habitToEdit.end_date || null,
                    status: habitToEdit.status || 'active'
                });
            }
        }
    }, [habitId, habits, isEditing]);

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Habit name is required';
        }

        if (formData.target_days <= 0) {
            newErrors.target_days = 'Target days must be greater than 0';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        try {
            if (isEditing && habitId) {
                await updateHabit(habitId, formData);
                Alert.alert('Success', 'Habit updated successfully');
            } else {
                await createHabit(formData);
                Alert.alert('Success', 'Habit created successfully');
            }
            router.back();
        } catch (error: any) {
            Alert.alert('Error', error.message || 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = () => {
        if (!isEditing || !habitId) return;

        Alert.alert(
            'Delete Habit',
            'Are you sure you want to delete this habit? This action cannot be undone.',
            [
                {
                    text: 'Cancel',
                    style: 'cancel'
                },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            setIsDeleting(true);
                            await deleteHabit(habitId);
                            Alert.alert('Success', 'Habit deleted successfully');
                            router.back();
                        } catch (error: any) {
                            Alert.alert('Error', error.message || 'Failed to delete habit');
                        } finally {
                            setIsDeleting(false);
                        }
                    }
                }
            ]
        );
    };

    const handleTargetDaysChange = (text: string) => {
        const days = parseInt(text) || 0;
        if (days > 3650) {
            setErrors(prev => ({
                ...prev,
                target_days: 'Target days cannot exceed 10 years (3650 days)'
            }));
            return;
        }

        setErrors(prev => ({ ...prev, target_days: undefined }));
        setFormData(prev => ({
            ...prev,
            target_days: days
        }));
    };

    return (
        <SafeAreaView className={`flex-1 ${isDark ? 'bg-[#1a1a1a]' : 'bg-white'}`}>
            <StatusBar style={isDark ? 'light' : 'dark'} />

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
                <Text className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {isEditing ? 'Edit Habit' : 'New Habit'}
                </Text>
                <TouchableOpacity
                    onPress={handleSave}
                    disabled={isLoading}
                    className={`py-2 px-4 rounded-full ${isLoading ? 'opacity-70' : ''} ${isDark ? 'bg-[#059669]' : 'bg-[#059669]'}`}
                    activeOpacity={0.7}
                >
                    {isLoading ? (
                        <ActivityIndicator size="small" color="white" />
                    ) : (
                        <Text className="text-white font-medium">
                            {isEditing ? 'Update' : 'Create'}
                        </Text>
                    )}
                </TouchableOpacity>
            </Animated.View>

            <ScrollView
                className="flex-1 px-6"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 40 }}
            >
                <Animated.View
                    className="gap-6"
                    layout={LinearTransition.damping(15)}
                >
                    {/* Basic Info Fields */}
                    <Animated.View
                        entering={FadeInDown.duration(500).delay(200)}
                        layout={LinearTransition.damping(15)}
                        className={`rounded-2xl border ${isDark
                            ? 'bg-gray-800/60 border-gray-700'
                            : 'bg-white border-gray-100'}`}
                    >
                        <View className="p-4">
                            <Text className={`text-sm font-medium mb-2 ${isDark
                                ? 'text-gray-300'
                                : 'text-gray-700'
                                }`}>
                                Habit Name
                            </Text>
                            <View className="flex-row items-center">
                                <Feather
                                    name="star"
                                    size={18}
                                    color={isDark ? '#94a3b8' : '#64748b'}
                                    style={{ marginRight: 12 }}
                                />
                                <TextInput
                                    value={formData.name}
                                    onChangeText={(text) => {
                                        setFormData((prev) => ({
                                            ...prev,
                                            name: text,
                                        }));
                                        if (text.trim()) {
                                            setErrors(prev => ({ ...prev, name: undefined }));
                                        }
                                    }}
                                    className={`flex-1 text-base ${isDark
                                        ? 'text-white'
                                        : 'text-gray-800'
                                        }`}
                                    placeholderTextColor={isDark ? '#94a3b8' : '#64748b'}
                                    placeholder="e.g., Morning Meditation"
                                />
                            </View>
                            {errors.name && (
                                <Text className="text-red-500 text-xs mt-1 ml-8">
                                    {errors.name}
                                </Text>
                            )}
                        </View>
                    </Animated.View>

                    <Animated.View
                        entering={FadeInDown.duration(500).delay(300)}
                        layout={LinearTransition.damping(15)}
                        className={`rounded-2xl border ${isDark
                            ? 'bg-gray-800/60 border-gray-700'
                            : 'bg-white border-gray-100'}`}
                    >
                        <View className="p-4">
                            <Text className={`text-sm font-medium mb-2 ${isDark
                                ? 'text-gray-300'
                                : 'text-gray-700'
                                }`}>
                                Description
                            </Text>
                            <View className="flex-row items-start">
                                <Feather
                                    name="file-text"
                                    size={18}
                                    color={isDark ? '#94a3b8' : '#64748b'}
                                    style={{ marginRight: 12, marginTop: 4 }}
                                />
                                <TextInput
                                    value={formData.description}
                                    onChangeText={(text) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            description: text,
                                        }))
                                    }
                                    multiline={true}
                                    numberOfLines={3}
                                    className={`flex-1 text-base ${isDark
                                        ? 'text-white'
                                        : 'text-gray-800'
                                        }`}
                                    placeholderTextColor={isDark ? '#94a3b8' : '#64748b'}
                                    placeholder="What do you want to achieve?"
                                    textAlignVertical="top"
                                />
                            </View>
                        </View>
                    </Animated.View>

                    {/* Frequency Selection with enhanced UI */}
                    <Animated.View
                        entering={FadeInDown.duration(500).delay(400)}
                        layout={LinearTransition.damping(15)}
                        className={`rounded-2xl border ${isDark
                            ? 'bg-gray-800/60 border-gray-700'
                            : 'bg-white border-gray-100'}`}
                    >
                        <View className="p-4">
                            <Text className={`text-sm font-medium mb-4 ${isDark
                                ? 'text-gray-300'
                                : 'text-gray-700'}`}>
                                How often?
                            </Text>
                            <View className="gap-4">
                                <View className="flex-row gap-3">
                                    {[
                                        { value: 'daily', icon: 'sun', label: 'Daily' },
                                        { value: 'weekly', icon: 'calendar', label: 'Weekly' }
                                    ].map((freq) => (
                                        <TouchableOpacity
                                            key={freq.value}
                                            onPress={() => setFormData(prev => ({ ...prev, frequency: freq.value as 'daily' | 'weekly' }))}
                                            className={`flex-1 py-3 px-4 rounded-xl border ${formData.frequency === freq.value
                                                ? isDark
                                                    ? 'bg-[#059669] border-[#059669]'
                                                    : 'bg-[#059669] border-[#059669]'
                                                : isDark
                                                    ? 'border-gray-700'
                                                    : 'border-gray-200'
                                                }`}
                                        >
                                            <View className="flex-row items-center justify-center gap-2">
                                                <Feather
                                                    name={freq.icon as 'sun' | 'calendar'}
                                                    size={18}
                                                    color={formData.frequency === freq.value
                                                        ? '#ffffff'
                                                        : isDark ? '#94a3b8' : '#64748b'}
                                                />
                                                <Text
                                                    className={`font-medium ${formData.frequency === freq.value
                                                        ? 'text-white'
                                                        : isDark
                                                            ? 'text-white'
                                                            : 'text-gray-800'
                                                        }`}
                                                >
                                                    {freq.label}
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    ))}
                                </View>

                                <View className="mt-2">
                                    <View className="flex-row items-center justify-between mb-2">
                                        <Text className={`text-sm font-medium ${isDark
                                            ? 'text-gray-300'
                                            : 'text-gray-700'}`}>
                                            Target Days
                                        </Text>
                                        <Text className={`text-xs ${isDark
                                            ? 'text-gray-400'
                                            : 'text-gray-500'}`}>
                                            {formData.target_days} days
                                        </Text>
                                    </View>
                                    <View className={`rounded-xl border ${isDark
                                        ? 'border-gray-700'
                                        : 'border-gray-200'}`}>
                                        <TextInput
                                            value={formData.target_days.toString()}
                                            onChangeText={handleTargetDaysChange}
                                            keyboardType="numeric"
                                            className={`px-4 py-3 text-base ${isDark
                                                ? 'text-white'
                                                : 'text-gray-800'}`}
                                            placeholderTextColor={isDark ? '#94a3b8' : '#64748b'}
                                            placeholder="Enter target days (max 3650)"
                                        />
                                    </View>
                                    {errors.target_days && (
                                        <Text className="text-red-500 text-xs mt-1">
                                            {errors.target_days}
                                        </Text>
                                    )}
                                </View>
                            </View>
                        </View>
                    </Animated.View>

                    {/* Privacy Settings with enhanced UI */}
                    <Animated.View
                        entering={FadeInDown.duration(500).delay(500)}
                        layout={LinearTransition.damping(15)}
                        className={`rounded-2xl border ${isDark
                            ? 'bg-gray-800/60 border-gray-700'
                            : 'bg-white border-gray-100'}`}
                    >
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => {
                                setFormData(prev => ({ ...prev, is_public: !prev.is_public }));
                            }}
                            className="p-4"
                        >
                            <View className="flex-row items-center justify-between">
                                <View className="flex-1 mr-4">
                                    <Text className={`text-sm font-medium ${isDark
                                        ? 'text-gray-300'
                                        : 'text-gray-700'}`}>
                                        Make Public
                                    </Text>
                                    <Text className={`text-xs mt-1 ${isDark
                                        ? 'text-gray-400'
                                        : 'text-gray-500'}`}>
                                        Others can see and join your habit
                                    </Text>
                                </View>
                                <CustomSwitch
                                    value={formData.is_public}
                                    onValueChange={(value) =>
                                        setFormData(prev => ({ ...prev, is_public: value }))
                                    }
                                />
                            </View>
                        </TouchableOpacity>
                    </Animated.View>

                    {/* Partner Selection */}
                    <Animated.View
                        entering={FadeInDown.duration(500).delay(600)}
                        className={`rounded-2xl border ${isDark
                            ? 'bg-gray-800/60 border-gray-700'
                            : 'bg-white border-gray-100'}`}
                    >
                        <View className="p-4">
                            <Text className={`text-sm font-medium mb-4 ${isDark
                                ? 'text-gray-300'
                                : 'text-gray-700'}`}>
                                Invite Partners
                            </Text>
                            <TouchableOpacity
                                onPress={() => {
                                    // TODO: Implement partner selection modal
                                    Alert.alert('Coming Soon', 'Partner selection will be available soon!');
                                }}
                                className={`flex-row items-center p-3 rounded-xl border ${isDark
                                    ? 'border-gray-700'
                                    : 'border-gray-200'}`}
                            >
                                <Feather
                                    name="users"
                                    size={20}
                                    color={isDark ? '#94a3b8' : '#64748b'}
                                />
                                <Text className={`ml-3 ${isDark
                                    ? 'text-white'
                                    : 'text-gray-800'}`}>
                                    Select Partners
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </Animated.View>

                    {/* Delete Habit Button (only show when editing) */}
                    {isEditing && (
                        <Animated.View
                            entering={FadeInDown.duration(500).delay(700)}
                            className="mt-4"
                        >
                            <TouchableOpacity
                                onPress={handleDelete}
                                disabled={isDeleting}
                                className={`py-4 px-4 rounded-xl border border-red-500 ${isDeleting ? 'opacity-50' : ''
                                    } ${isDark ? 'bg-gray-800/30' : 'bg-red-50'
                                    }`}
                                activeOpacity={0.7}
                            >
                                <View className="flex-row items-center justify-center">
                                    {isDeleting ? (
                                        <ActivityIndicator size="small" color="#ef4444" />
                                    ) : (
                                        <>
                                            <Feather name="trash-2" size={18} color="#ef4444" />
                                            <Text className="ml-2 font-medium text-red-500">
                                                Delete Habit
                                            </Text>
                                        </>
                                    )}
                                </View>
                            </TouchableOpacity>
                        </Animated.View>
                    )}
                </Animated.View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default AddHabitScreen;