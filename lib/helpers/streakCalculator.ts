import { Habit } from "../types";

export interface StreakInfo {
  currentStreak: number;
  longestStreak: number;
  lastCompletedDate: string | null;
  streakDates: string[];
}

export const calculateStreak = (habit: Habit): StreakInfo => {
  const streaks = habit.streaks || [];
  const today = new Date();
  const sortedDates = streaks
    .filter(s => s.user_completed) // Only count completed streaks
    .map(s => new Date(s.date))
    .sort((a, b) => b.getTime() - a.getTime());

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  let lastCompletedDate = sortedDates[0]?.toISOString() || null;
  const streakDates: string[] = [];

  // Calculate streaks based on habit frequency
  if (habit.frequency === 'daily') {
    for (let i = 0; i < sortedDates.length; i++) {
      const currentDate = sortedDates[i];
      const nextDate = sortedDates[i + 1];

      // Add current date to streak dates
      streakDates.push(currentDate.toISOString().split('T')[0]);

      if (!nextDate) {
        tempStreak++;
        break;
      }

      const diffDays = Math.floor(
        (currentDate.getTime() - nextDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (diffDays === 1) {
        tempStreak++;
      } else {
        if (tempStreak > longestStreak) {
          longestStreak = tempStreak;
        }
        tempStreak = 1;
      }
    }
  } else if (habit.frequency === 'weekly') {
    // Weekly streak calculation logic remains the same
    for (let i = 0; i < sortedDates.length; i++) {
      const currentDate = sortedDates[i];
      const nextDate = sortedDates[i + 1];

      streakDates.push(currentDate.toISOString().split('T')[0]);

      if (!nextDate) {
        tempStreak++;
        break;
      }

      const diffWeeks = Math.floor(
        (currentDate.getTime() - nextDate.getTime()) / (1000 * 60 * 60 * 24 * 7)
      );

      if (diffWeeks === 1) {
        tempStreak++;
      } else {
        if (tempStreak > longestStreak) {
          longestStreak = tempStreak;
        }
        tempStreak = 1;
      }
    }
  }

  // Update longest streak if the last temp streak is longer
  if (tempStreak > longestStreak) {
    longestStreak = tempStreak;
  }

  // Calculate current streak
  if (sortedDates.length > 0) {
    const lastDate = new Date(sortedDates[0]);
    const diffDays = Math.floor(
      (today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (habit.frequency === 'daily' && diffDays <= 1) {
      currentStreak = tempStreak;
    } else if (habit.frequency === 'weekly' && diffDays <= 7) {
      currentStreak = tempStreak;
    }
  }

  return {
    currentStreak,
    longestStreak,
    lastCompletedDate,
    streakDates
  };
};