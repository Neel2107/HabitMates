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
  today.setHours(0, 0, 0, 0);

  // Include last_completed_at in the dates if it exists
  const lastCompletedAt = habit.last_completed_at ? new Date(habit.last_completed_at) : null;
  
  const sortedDates = [
    ...streaks
      .filter(s => s.user_completed)
      .map(s => new Date(s.date)),
    ...(lastCompletedAt ? [lastCompletedAt] : [])
  ]
    .sort((a, b) => b.getTime() - a.getTime())
    .filter((date, index, self) => 
      index === self.findIndex(d => 
        d.toISOString().split('T')[0] === date.toISOString().split('T')[0]
      )
    );

  let currentStreak = 0;
  let longestStreak = habit.longest_streak_count || 0;
  let tempStreak = 0;
  let lastCompletedDate = sortedDates[0]?.toISOString() || habit.last_completed_at || null;
  const streakDates: string[] = [];

  const isToday = (date: Date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d.getTime() === today.getTime();
  };

  const isYesterday = (date: Date) => {
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d.getTime() === yesterday.getTime();
  };

  const isWithinLastWeek = (date: Date) => {
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    return date >= weekAgo;
  };

  // Calculate streaks based on habit frequency
  if (habit.frequency === 'daily') {
    let previousDate: Date | null = null;

    for (const currentDate of sortedDates) {
      const dateStr = currentDate.toISOString().split('T')[0];
      streakDates.push(dateStr);

      if (!previousDate) {
        tempStreak = 1;
        previousDate = currentDate;
        continue;
      }

      const diffDays = Math.floor(
        (previousDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (diffDays === 1) {
        tempStreak++;
      } else {
        if (tempStreak > longestStreak) {
          longestStreak = tempStreak;
        }
        tempStreak = 1;
      }

      previousDate = currentDate;
    }
  } else if (habit.frequency === 'weekly') {
    let previousDate: Date | null = null;

    for (const currentDate of sortedDates) {
      const dateStr = currentDate.toISOString().split('T')[0];
      streakDates.push(dateStr);

      if (!previousDate) {
        tempStreak = 1;
        previousDate = currentDate;
        continue;
      }

      const diffWeeks = Math.floor(
        (previousDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24 * 7)
      );

      if (diffWeeks === 1) {
        tempStreak++;
      } else {
        if (tempStreak > longestStreak) {
          longestStreak = tempStreak;
        }
        tempStreak = 1;
      }

      previousDate = currentDate;
    }
  }

  // Update longest streak if the last temp streak is longer
  if (tempStreak > longestStreak) {
    longestStreak = tempStreak;
  }

  // Calculate current streak
  if (sortedDates.length > 0) {
    const lastDate = sortedDates[0];
    
    if (habit.frequency === 'daily') {
      if (isToday(lastDate) || isYesterday(lastDate)) {
        currentStreak = tempStreak;
      } else {
        currentStreak = 0;
      }
    } else if (habit.frequency === 'weekly') {
      if (isWithinLastWeek(lastDate)) {
        currentStreak = tempStreak;
      } else {
        currentStreak = 0;
      }
    }
  }

  return {
    currentStreak: Math.max(currentStreak, habit.current_streak_count || 0),
    longestStreak: Math.max(longestStreak, habit.longest_streak_count || 0),
    lastCompletedDate,
    streakDates
  };
};