import { View, Text, ScrollView } from 'react-native';
import React from 'react';
import Animated, { 
  FadeInRight,
  FadeIn
} from 'react-native-reanimated';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/lib/stores/authStore';

const mockHabits = [
  { id: 1, name: 'Morning Workout', streak: 5 },
  { id: 2, name: 'Read 30 minutes', streak: 12 },
  { id: 3, name: 'Meditate', streak: 3 },
];

export default function HomePage() {
  const signOut = useAuthStore((state) => state.signOut);

  return (
    <View className="flex-1 bg-white">
      <Animated.View 
        entering={FadeIn.duration(500)}
        className="pt-12 px-6 pb-6 bg-blue-500"
      >
        <Text className="text-2xl font-bold text-white">Welcome Back!</Text>
      </Animated.View>
      
      <ScrollView className="flex-1 p-6">
        <Text className="text-xl font-semibold mb-4">Your Habits</Text>
        {mockHabits.map((habit, index) => (
          <Animated.View
            key={habit.id}
            entering={FadeInRight.delay(index * 100).duration(500)}
            className="bg-white mb-4 p-4 rounded-xl shadow-sm border border-gray-200"
          >
            <Text className="text-lg font-medium">{habit.name}</Text>
            <Text className="text-gray-600">🔥 {habit.streak} day streak</Text>
          </Animated.View>
        ))}
      </ScrollView>

      <View className="p-6">
        <Button 
          title="Sign Out" 
          variant="secondary" 
          onPress={signOut} 
        />
      </View>
    </View>
  );
}