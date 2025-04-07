import { useAuthStore } from '@/lib/stores/authStore';
import { useThemeStore } from '@/lib/stores/themeStore';
import { CustomButton } from '@/components/ui/CustomButton';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
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
import Svg, { Circle, Path } from 'react-native-svg';

// Custom SVG Avatar component for placeholder
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

            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
            });

            if (!result.canceled && result.assets[0].uri) {
                setIsLoading(true);
                try {
                    const uri = result.assets[0].uri;

                    const publicUrl = await uploadAvatar(uri);

                    if (publicUrl) {
                        setAvatarUrl(publicUrl);
                        await updateProfile({
                            avatar_url: publicUrl,
                        });
                        Alert.alert('Success', 'Profile picture updated successfully');
                    } else {
                        throw new Error('Failed to get public URL');
                    }
                } catch (error: any) {
                    console.error('Detailed upload error:', {
                        message: error.message,
                        stack: error.stack,
                        cause: error.cause
                    });
                    Alert.alert('Error', 'Failed to upload image. Please try again.');
                } finally {
                    setIsLoading(false);
                }
            }
        } catch (error: any) {
            Alert.alert('Error', 'Failed to pick image');
            console.error('Image picker error:', error);
        }
    };

    const handleSaveProfile = async () => {
        try {
            setIsLoading(true);
            
            // First, update user metadata (which can store any custom fields)
            await updateProfile({
                username: formData.username,
                // Store additional profile info in user metadata
                // These will be saved in auth.users.user_metadata
                avatar_url: avatarUrl,
                updated_at: new Date().toISOString()
            });
            
            // Update Supabase auth user metadata directly for the additional fields
            const { error } = await supabase.auth.updateUser({
                data: {
                    full_name: formData.fullName,
                    bio: formData.bio,
                    location: formData.location,
                    website: formData.website
                }
            });
            
            if (error) throw error;
            
            Alert.alert('Success', 'Profile updated successfully', [
                { text: 'OK', onPress: () => router.back() }
            ]);
        } catch (error: any) {
            Alert.alert('Error', error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView className={`flex-1 ${isDark ? 'bg-[#1a1a1a]' : 'bg-[#f5f9f8]'}`}>
            <StatusBar style={isDark ? 'light' : 'dark'} />

            {/* Header */}
            <Animated.View
                entering={FadeIn.duration(500)}
                className="px-6 pt-4 pb-4 flex-row items-center"
            >
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="p-2 rounded-full mr-4"
                    activeOpacity={0.7}
                >
                    <Feather
                        name="arrow-left"
                        size={24}
                        color={isDark ? '#e2e8f0' : '#0f172a'}
                    />
                </TouchableOpacity>
                <Text className={`text-2xl font-inter-bold ${isDark ? 'text-white' : 'text-[#1e293b]'}`}>
                    Edit Profile
                </Text>
            </Animated.View>

            <KeyboardAwareScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 40 }}
            >
                {/* Profile Picture Section */}
                <Animated.View
                    entering={FadeInDown.delay(100).duration(500)}
                    className={`mx-6 mb-6 p-6 rounded-2xl border shadow-sm ${isDark ? 'bg-gray-800/60 border-gray-700' : 'bg-white border-gray-100'}`}
                >
                    <View className="items-center">
                        <View className="relative">
                            {isLoading ? (
                                <View className="w-24 h-24 rounded-full bg-gray-300 items-center justify-center">
                                    <Feather name="loader" size={30} color="#059669" />
                                </View>
                            ) : (
                                <UserAvatar
                                    size={96}
                                    color="#059669"
                                    avatarUrl={avatarUrl}
                                />
                            )}
                            <TouchableOpacity
                                onPress={handleImagePick}
                                className="absolute bottom-0 right-0 w-10 h-10 rounded-full items-center justify-center bg-[#059669]"
                                activeOpacity={0.8}
                                disabled={isLoading}
                            >
                                <Feather name="camera" size={18} color="white" />
                            </TouchableOpacity>
                        </View>

                        <Text className={`text-base font-inter-medium mt-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                            Change profile picture
                        </Text>
                    </View>
                </Animated.View>

                {/* Form Fields */}
                <Animated.View
                    entering={FadeInDown.delay(200).duration(500)}
                    className={`mx-6 mb-6 rounded-2xl border shadow-sm ${isDark ? 'bg-gray-800/60 border-gray-700' : 'bg-white border-gray-100'}`}
                >
                    {/* Username Field */}
                    <View className={`p-4 border-b ${isDark ? 'border-gray-700/50' : 'border-gray-100'}`}>
                        <Text className={`text-sm font-inter-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                            Username
                        </Text>
                        <TextInput
                            className={`font-inter-regular ${isDark ? 'text-white' : 'text-gray-800'}`}
                            value={formData.username}
                            onChangeText={(text) => setFormData({ ...formData, username: text })}
                            placeholder="Enter username"
                            placeholderTextColor={isDark ? '#94a3b8' : '#64748b'}
                        />
                    </View>

                    {/* Full Name Field */}
                    <View className={`p-4 border-b ${isDark ? 'border-gray-700/50' : 'border-gray-100'}`}>
                        <Text className={`text-sm font-inter-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                            Full Name
                        </Text>
                        <TextInput
                            className={`font-inter-regular ${isDark ? 'text-white' : 'text-gray-800'}`}
                            value={formData.fullName}
                            onChangeText={(text) => setFormData({ ...formData, fullName: text })}
                            placeholder="Enter your full name"
                            placeholderTextColor={isDark ? '#94a3b8' : '#64748b'}
                        />
                    </View>

                    {/* Bio Field */}
                    <View className={`p-4 border-b ${isDark ? 'border-gray-700/50' : 'border-gray-100'}`}>
                        <Text className={`text-sm font-inter-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                            Bio
                        </Text>
                        <TextInput
                            className={`font-inter-regular ${isDark ? 'text-white' : 'text-gray-800'}`}
                            value={formData.bio}
                            onChangeText={(text) => setFormData({ ...formData, bio: text })}
                            placeholder="Tell us about yourself"
                            placeholderTextColor={isDark ? '#94a3b8' : '#64748b'}
                            multiline
                            numberOfLines={3}
                            style={{ height: 80, textAlignVertical: 'top' }}
                        />
                    </View>

                    {/* Location Field */}
                    <View className={`p-4 border-b ${isDark ? 'border-gray-700/50' : 'border-gray-100'}`}>
                        <Text className={`text-sm font-inter-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                            Location
                        </Text>
                        <TextInput
                            className={`font-inter-regular ${isDark ? 'text-white' : 'text-gray-800'}`}
                            value={formData.location}
                            onChangeText={(text) => setFormData({ ...formData, location: text })}
                            placeholder="Your location"
                            placeholderTextColor={isDark ? '#94a3b8' : '#64748b'}
                        />
                    </View>

                    {/* Website Field */}
                    <View className={`p-4`}>
                        <Text className={`text-sm font-inter-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                            Website
                        </Text>
                        <TextInput
                            className={`font-inter-regular ${isDark ? 'text-white' : 'text-gray-800'}`}
                            value={formData.website}
                            onChangeText={(text) => setFormData({ ...formData, website: text })}
                            placeholder="Your website URL"
                            placeholderTextColor={isDark ? '#94a3b8' : '#64748b'}
                            autoCapitalize="none"
                            keyboardType="url"
                        />
                    </View>
                </Animated.View>

                {/* Save Button - replaced with CustomButton */}
                <Animated.View
                    entering={FadeInDown.delay(300).duration(500)}
                    className="mx-6 mb-6"
                >
                    <CustomButton
                        title="Save Changes"
                        onPress={handleSaveProfile}
                        isLoading={isLoading}
                        loadingText="Saving..."
                        disabled={isLoading}
                        backgroundColor="#059669"
                        textColor="white"
                    />
                </Animated.View>
            </KeyboardAwareScrollView>
        </SafeAreaView>
    );
};

export default EditProfileScreen;