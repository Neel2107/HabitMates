import React, { useState } from 'react';
import { View, Text, Alert } from 'react-native';
import { useThemeStore } from '@/lib/stores/themeStore';
import { supabase } from '@/lib/supabase';
import { CustomButton } from '../ui/CustomButton';
import { useAuthStore } from '@/lib/stores/authStore';

interface StreakRescueProps {
  habitId: string;
  onRescueComplete: () => void;
}

export const StreakRescue = ({ habitId, onRescueComplete }: StreakRescueProps) => {
  const isDark = useThemeStore((state) => state.isDark);
  const [isLoading, setIsLoading] = useState(false);
  const session = useAuthStore((state) => state.session);
  
  const rescueStreak = async () => {
    if (!session?.user) return;
    
    setIsLoading(true);
    try {
      // First check if user has rescues remaining
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('streak_rescues_remaining')
        .eq('id', session.user.id)
        .single();
        
      if (userError) throw userError;
      
      if (!userData || userData.streak_rescues_remaining <= 0) {
        Alert.alert(
          "No Rescues Left",
          "You don't have any streak rescues remaining. Complete more habits to earn rescues!",
          [{ text: "OK" }]
        );
        return;
      }
      
      // Create a streak entry for yesterday
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      
      // Insert the rescue streak
      const { error: streakError } = await supabase
        .from('streaks')
        .insert({
          habit_id: habitId,
          date: yesterdayStr,
          user_completed: true,
          is_rescue: true
        });
        
      if (streakError) throw streakError;
      
      // Decrement user's rescue count
      const { error: updateError } = await supabase
        .from('users')
        .update({ 
          streak_rescues_remaining: userData.streak_rescues_remaining - 1 
        })
        .eq('id', session.user.id);
        
      if (updateError) throw updateError;
      
      Alert.alert(
        "Streak Rescued!",
        "Your streak has been rescued. Keep up the good work!",
        [{ text: "OK" }]
      );
      
      onRescueComplete();
      
    } catch (error: any) {
      console.error("Error rescuing streak:", error);
      Alert.alert("Error", "Failed to rescue streak. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <View className="bg-red-50 dark:bg-red-900/30 p-4 rounded-lg mb-6">
      <Text className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-red-800'}`}>
        Streak at Risk!
      </Text>
      <Text className={`mb-4 ${isDark ? 'text-gray-300' : 'text-red-700'}`}>
        You missed yesterday's check-in. Use a streak rescue to maintain your current streak.
      </Text>
      <CustomButton
        title="Rescue My Streak"
        onPress={rescueStreak}
        isLoading={isLoading}
        backgroundColor="#dc2626"
        icon="life-buoy"
      />
    </View>
  );
};