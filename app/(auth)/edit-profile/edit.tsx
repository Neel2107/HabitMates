import { useAuthStore } from '@/lib/stores/authStore';
import { useThemeStore } from '@/lib/stores/themeStore';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
    Alert,
    Image,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';


const EditProfileScreen = () => {
    const isDark = useThemeStore((state) => state.isDark);
    const session = useAuthStore((state) => state.session);

    const updateProfile = useAuthStore((state) => state.updateProfile);
    const uploadAvatar = useAuthStore((state) => state.uploadAvatar);

    const [avatarUrl, setAvatarUrl] = useState<string | null>(
        session?.user?.user_metadata?.avatar_url || null
    );

    const [formData, setFormData] = useState({
        fullName: session?.user?.user_metadata?.full_name || '',
        username: session?.user?.user_metadata?.username || '',
        bio: session?.user?.user_metadata?.bio || '',
        location: session?.user?.user_metadata?.location || '',
        website: session?.user?.user_metadata?.website || '',
    });

    const [isLoading, setIsLoading] = useState(false);


    const handleImagePick = async () => {
        try {
            const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
            
            if (!permissionResult.granted) {
                Alert.alert("Permission Required", "You need to grant access to your photos to upload an avatar.");
                return;
            }
    
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
                base64: true, // Enable base64 output
            });
    
            if (!result.canceled && result.assets[0].uri) {
                setIsLoading(true);
                try {
                    const publicUrl = await uploadAvatar(result.assets[0].uri);
                    setAvatarUrl(publicUrl);
                    await updateProfile({ avatar_url: publicUrl });
                    Alert.alert('Success', 'Profile picture updated successfully');
                } catch (error: any) {
                    Alert.alert('Error', 'Failed to upload image. Please try again.');
                    console.error('Upload error:', error);
                } finally {
                    setIsLoading(false);
                }
            }
        } catch (error: any) {
            Alert.alert('Error', 'Failed to pick image');
            console.error('Image picker error:', error);
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        setIsLoading(true);
        try {
            await updateProfile({
                username: formData.username,
            });
            Alert.alert('Success', 'Profile updated successfully');
            router.back();
        } catch (error: any) {
            Alert.alert('Error', error.message);
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <SafeAreaView className={`flex-1 ${isDark ? 'bg-app-dark' : 'bg-app-light'}`}>
            <StatusBar style={isDark ? 'light' : 'dark'} />

            {/* Header */}
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
                        name="arrow-left"
                        size={24}
                        color={isDark ? '#e2e8f0' : '#0f172a'}
                    />
                </TouchableOpacity>
                <Text className={`text-xl font-bold ${isDark ? 'text-content-primary-dark' : 'text-content-primary-light'
                    }`}>
                    Edit Profile
                </Text>
                <TouchableOpacity
                    onPress={handleSave}
                    disabled={isLoading}
                    className={`py-2 px-4 rounded-full ${isDark ? 'bg-brand-primary' : 'bg-brand-primary'
                        }`}
                    activeOpacity={0.7}
                >
                    <Text className="text-white font-medium">
                        {isLoading ? 'Saving...' : 'Save'}
                    </Text>
                </TouchableOpacity>
            </Animated.View>

            <KeyboardAwareScrollView
                className="flex-1 px-6"
                bottomOffset={50}
                showsVerticalScrollIndicator={false}
            >
                {/* Profile Picture */}
                <Animated.View
                    entering={FadeInDown.duration(500).delay(100)}
                    className="items-center mb-8"
                >
                    <View className="relative">
                        <Image
                            source={{
                                uri: avatarUrl || 'https://i.pravatar.cc/160'
                            }}
                            className={`w-24 h-24 rounded-full border-2 ${isDark ? 'border-border-dark' : 'border-border-light'
                                }`}
                        />
                        <TouchableOpacity
                            onPress={handleImagePick}
                            className={`absolute bottom-0 right-0 w-8 h-8 rounded-full items-center justify-center ${isDark ? 'bg-brand-primary-dark' : 'bg-brand-primary'
                                }`}
                            activeOpacity={0.8}
                        >
                            <Feather name="camera" size={15} color="white" />
                        </TouchableOpacity>
                    </View>
                </Animated.View>

                {/* Form Fields */}
                <View className="flex-col gap-4">
                    {[
                        { label: 'Full Name', key: 'fullName', icon: 'user' },
                        { label: 'Username', key: 'username', icon: 'at-sign' },
                        { label: 'Bio', key: 'bio', icon: 'file-text', multiline: true },
                        { label: 'Location', key: 'location', icon: 'map-pin' },
                        { label: 'Website', key: 'website', icon: 'globe' },
                    ].map((field, index) => (
                        <Animated.View
                            key={field.key}
                            entering={FadeInDown.duration(500).delay(200 + index * 100)}
                            className={`rounded-2xl border ${isDark
                                ? 'bg-app-card-dark border-border-dark'
                                : 'bg-app-card-light border-border-light'
                                }`}
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
                                        value={formData[field.key as keyof typeof formData]}
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
                                        placeholder={`Enter your ${field.label.toLowerCase()}`}
                                    />
                                </View>
                            </View>
                        </Animated.View>
                    ))}
                </View>

                <View className="h-6" />
            </KeyboardAwareScrollView>
        </SafeAreaView>
    );
};

export default EditProfileScreen;