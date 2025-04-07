import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { useThemeStore } from '@/lib/stores/themeStore';
import { HabitHeatmap } from '../HabitHeatmap';
import { CartesianChart, Bar } from "victory-native";

interface StreakVisualizationProps {
  streakInfo: {
    currentStreak: number;
    longestStreak: number;
    streakDates: string[];
  };
  streaks: any[];
  frequency: 'daily' | 'weekly';
}

export const StreakVisualization = ({ streakInfo, streaks, frequency }: StreakVisualizationProps) => {
  const isDark = useThemeStore((state) => state.isDark);
  const screenWidth = Dimensions.get('window').width - 40; // 40px padding
  
  // Prepare data for the chart
  const prepareChartData = () => {
    const today = new Date();
    const chartData = [];
    
    // For simplicity, we'll just show streak counts for the last 7 periods
    const periods = 7;
    
    for (let i = periods - 1; i >= 0; i--) {
      const date = new Date(today);
      let label;
      
      if (frequency === 'daily') {
        date.setDate(date.getDate() - i);
        label = date.getDate().toString();
      } else {
        date.setDate(date.getDate() - (i * 7));
        label = `W${i+1}`;
      }
      
      // Check if this date has a completed streak
      const dateStr = date.toISOString().split('T')[0];
      const completed = streakInfo.streakDates.includes(dateStr);
      
      chartData.push({
        x: label,
        y: completed ? 1 : 0,
        completed: completed
      });
    }
    
    return chartData;
  };

  // Define colors as constants to avoid type issues
  const completedColor = "#059669";
  const missedColor = "#ef4444";

  return (
    <View className="mb-6">
      <Text className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
        Streak Visualization
      </Text>
      
      {/* Streak Stats */}
      <View className="flex-row justify-between mb-4">
        <View className="bg-emerald-100 dark:bg-emerald-900 p-3 rounded-lg flex-1 mr-2">
          <Text className="text-emerald-800 dark:text-emerald-100 text-xs">Current Streak</Text>
          <Text className="text-emerald-800 dark:text-emerald-100 text-xl font-bold">
            {streakInfo.currentStreak} {frequency === 'daily' ? 'days' : 'weeks'}
          </Text>
        </View>
        <View className="bg-amber-100 dark:bg-amber-900 p-3 rounded-lg flex-1 ml-2">
          <Text className="text-amber-800 dark:text-amber-100 text-xs">Longest Streak</Text>
          <Text className="text-amber-800 dark:text-amber-100 text-xl font-bold">
            {streakInfo.longestStreak} {frequency === 'daily' ? 'days' : 'weeks'}
          </Text>
        </View>
      </View>
      
      {/* Heatmap */}
      <HabitHeatmap streaks={streaks} />
      
      {/* Chart */}
      <View className="mt-4">
        <Text className={`text-base font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Completion Trend
        </Text>
        <View style={{ height: 200, width: screenWidth }}>
          <CartesianChart
            data={prepareChartData()}
            xKey="x"
            yKeys={["y"]}
            axisOptions={{
              // Remove font property entirely as it's causing issues
              labelColor: isDark ? "#ffffff" : "#333333",
              // tickColor: isDark ? "#ffffff" : "#333333",
              // gridColor: isDark ? "#333333" : "#e5e5e5",
            }}
            domainPadding={{ left: 20, right: 20 }}
            // chartPadding={{ left: 40, bottom: 40, right: 20, top: 20 }}
            // yAxisOptions={{
            //   tickValues: [0, 1],
            //   tickLabels: ["Missed", "Completed"],
            // }}
            // xAxisOptions={{
            //   tickLabelStyle: { color: isDark ? "#ffffff" : "#333333" },
            // }}
            // chartBackgroundColor={isDark ? "#1a1a1a" : "#ffffff"}
          >
            {({ points, chartBounds }) => (
              <Bar
                points={points.y}
                chartBounds={chartBounds}
                // Use a fixed color instead of a function
                color={completedColor}
                // Use roundedCorners instead of cornerRadius
                roundedCorners={{ topLeft: 5, topRight: 5 }}
                animate={{ type: "timing", duration: 500 }}
              />
            )}
          </CartesianChart>
        </View>
      </View>
    </View>
  );
};