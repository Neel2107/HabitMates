import { useState, useEffect } from 'react';
import { Habit } from '../types';
import { calculateStreak, StreakInfo } from '../helpers/streakCalculator';
import { supabase } from '../supabase';

export function useStreaks(habitId?: string) {
  const [streakInfo, setStreakInfo] = useState<StreakInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStreakInfo = async (id: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch the habit with its streaks
      const { data: habit, error: habitError } = await supabase
        .from('habits')
        .select(`
          *,
          streaks(
            date,
            user_completed,
            partner_completed
          )
        `)
        .eq('id', id)
        .single();

      if (habitError) throw habitError;
      
      // Calculate streak info
      const info = calculateStreak(habit as Habit);
      setStreakInfo(info);
      
      // Update the streak counts in the database if they don't match
      if (habit.current_streak_count !== info.currentStreak || 
          habit.longest_streak_count !== info.longestStreak) {
        
        const { error: updateError } = await supabase
          .from('habits')
          .update({
            current_streak_count: info.currentStreak,
            longest_streak_count: info.longestStreak,
            last_completed_at: info.lastCompletedDate
          })
          .eq('id', id);
          
        if (updateError) console.error("Error updating streak counts:", updateError);
      }
      
    } catch (err: any) {
      console.error("Error in useStreaks:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (habitId) {
      fetchStreakInfo(habitId);
    }
  }, [habitId]);

  return {
    streakInfo,
    isLoading,
    error,
    refreshStreakInfo: habitId ? () => fetchStreakInfo(habitId) : null
  };
}