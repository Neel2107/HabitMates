import { create } from 'zustand';
import { supabase } from '../supabase';
import type { Habit } from '../types';

interface HabitsState {
  habits: Habit[];
  isLoading: boolean;
  error: string | null;
  fetchHabits: () => Promise<void>;
  toggleHabitCompletion: (habitId: string) => Promise<void>;
  createHabit: (habit: Partial<Habit>) => Promise<void>;
}

export const useHabitsStore = create<HabitsState>((set, get) => ({
  habits: [],
  isLoading: false,
  error: null,

  fetchHabits: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data: habits, error } = await supabase
        .from('habits')
        .select(`
          *,
          streaks(
            date,
            user_completed,
            partner_completed
          )
        `)
        .eq('owner_id', (await supabase.auth.getUser()).data.user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const transformedHabits = habits.map((habit: any) => ({
        id: habit.id,
        name: habit.name,
        description: habit.description,
        frequency: habit.frequency,
        owner_id: habit.owner_id,
        partner_id : habit.partner_id,
        current_streak: habit.current_streak,
        longest_streak: habit.longest_streak,
        is_public: habit.is_public,
        created_at: habit.created_at,
        updated_at: habit.updated_at,
        todayCompleted: habit.streaks?.[0]?.user_completed || false,
        target_days: habit.target_days,
        status: habit.status || 'active',
        start_date: habit.start_date,
        end_date: habit.end_date
      }));

      set({ habits: transformedHabits });
    } catch (error: any) {
      console.error("Error fetching habits:", error);
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  toggleHabitCompletion: async (habitId: string) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const userId = (await supabase.auth.getUser()).data.user?.id;

      // First, try to get today's streak
      const { data: existingStreak, error: fetchError } = await supabase
        .from('streaks')
        .select('*')
        .eq('habit_id', habitId)
        .eq('date', today)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "not found" error
        throw fetchError;
      }

      if (existingStreak) {
        // Update existing streak
        const { error } = await supabase
          .from('streaks')
          .update({ user_completed: !existingStreak.user_completed })
          .eq('id', existingStreak.id);

        if (error) throw error;
      } else {
        // Create new streak
        const { error } = await supabase
          .from('streaks')
          .insert({
            habit_id: habitId,
            date: today,
            user_completed: true
          });

        if (error) throw error;
      }

      // Refresh habits to get updated streak information
      await get().fetchHabits();
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  createHabit: async (habit: Partial<Habit>) => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('habits')
        .insert({
          name: habit.name,
          description: habit.description,
          frequency: habit.frequency,
          is_public: habit.is_public,
          owner_id: user.id,
          current_streak: 0,
          longest_streak: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select('*')
        .single();

      if (error) {
        console.error("Error creating habit:", error);
        throw error;
      }
      
      const transformedHabit: Habit = {
        id: data.id,
        name: data.name,
        description: data.description,
        frequency: data.frequency,
        owner_id: data.owner_id,
        partner_id: data.partner_id,
        current_streak: data.current_streak,
        longest_streak: data.longest_streak,
        is_public: data.is_public,
        created_at: data.created_at,
        updated_at: data.updated_at,
        todayCompleted: false
      };

      set(state => ({
        habits: [transformedHabit, ...state.habits]
      }));

      await get().fetchHabits();
    } catch (error: any) {
      console.error("Error in createHabit:", error);
      throw error;
    }
  }
}));