import { useThemeStore } from '@/lib/stores/themeStore';
import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { Streak } from '@/lib/types';

interface HabitHeatmapProps {
  streaks: Streak[];
}

export const HabitHeatmap = ({ streaks }: HabitHeatmapProps) => {
  const isDark = useThemeStore((state) => state.isDark);
  const screenWidth = Dimensions.get('window').width;
  const cellSize = 14;
  const spacing = 2;
  const labelWidth = 30;
  const availableWidth = screenWidth - 40;
  const weeksToShow = Math.floor((availableWidth - labelWidth) / (cellSize + spacing));
  
  const generateHeatmapData = () => {
    const data = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString().split('T')[0];

    const startDate = new Date(today);
    startDate.setDate(today.getDate() - ((weeksToShow - 1) * 7));
    
    // Get to the nearest Sunday
    const daysSinceMonday = startDate.getDay();
    startDate.setDate(startDate.getDate() - daysSinceMonday);

    for (let week = 0; week < weeksToShow; week++) {
      const weekData = [];
      for (let day = 0; day < 7; day++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + (week * 7) + day);
        const dateStr = currentDate.toISOString().split('T')[0];
        
        // Use actual streaks data
        const streak = streaks.find(s => s.date === dateStr);
        
        weekData.push({
          date: dateStr,
          completed: Boolean(streak?.user_completed),
          isToday: dateStr === todayStr,
          isFuture: currentDate > today
        });
      }
      data.push(weekData);
    }

    return data;
  };

  const getColorForCompletion = (completed: boolean, isToday: boolean, isFuture: boolean) => {
    console.log('Color params:', { completed, isToday, isFuture }); // Debug log
    
    if (completed) {
      return '#059669'; // Always show green for completed, regardless of today/future
    }
    if (isFuture) {
      return isDark ? '#1a1a1a' : '#f8fafc';
    }
    if (isToday) {
      return isDark ? '#334155' : '#e2e8f0';
    }
    return isDark ? '#1f2937' : '#f1f5f9';
  };

  const heatmapData = generateHeatmapData();
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <View className="mb-4">
      <Text className={`text-base font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
        Activity History
      </Text>
      <View className="flex-row">
        {/* Week days labels */}
        <View className="mr-1">
          {weekDays.map((day, index) => (
            <Text
              key={day}
              className={`text-[10px] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
              style={{ height: cellSize + spacing }}
            >
              {index % 2 === 0 ? day : ''}
            </Text>
          ))}
        </View>
        
        {/* Heatmap grid */}
        <View className="flex-row gap-0.5">
          {heatmapData.map((week, weekIndex) => (
            <View key={weekIndex} className="gap-0.5">
              {week.map((day) => (
                <View
                  key={day.date}
                  style={{
                    width: cellSize,
                    height: cellSize,
                    backgroundColor: getColorForCompletion(
                      day.completed,
                      day.isToday,
                      day.isFuture
                    ),
                    borderRadius: 2,
                    borderWidth: day.isToday ? 1 : 0,
                    borderColor: isDark ? '#475569' : '#cbd5e1'
                  }}
                />
              ))}
            </View>
          ))}
        </View>
      </View>
      <View className="flex-row justify-between mt-1">
        <Text className={`text-[10px] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          {weeksToShow} weeks ago
        </Text>
        <Text className={`text-[10px] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          Now
        </Text>
      </View>
    </View>
  );
};