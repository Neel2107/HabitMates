import { create } from 'zustand';
import { calculateStreak, StreakInfo } from '../helpers/streakCalculator';
import { supabase } from '../supabase';
import type { Habit } from '../types';
import { MMKV } from 'react-native-mmkv';


const storage = new MMKV({ id: 'habits-cache' });

interface HabitsState {
  habits: Habit[];
  isLoading: boolean;
  error: string | null;
  fetchHabits: () => Promise<void>;
  toggleHabitCompletion: (habitId: string) => Promise<void>;
  createHabit: (habit: Partial<Habit>) => Promise<void>;
  updateHabit: (habitId: string, habit: Partial<Habit>) => Promise<void>;
  deleteHabit: (habitId: string) => Promise<void>;
  pendingActions: {
    [key: string]: {
      type: 'toggle' | 'create' | 'update' | 'delete';
      data: any;
      timestamp: number;
    }
  };
  initFromCache: () => void;
  syncPendingActions: () => Promise<void>;
}

export const useHabitsStore = create<HabitsState>((set, get) => ({
  habits: [],
  isLoading: false,
  error: null,
  pendingActions: {},

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
        partner_id: habit.partner_id,
        current_streak: habit.current_streak,
        longest_streak: habit.longest_streak,
        is_public: habit.is_public,
        created_at: habit.created_at,
        updated_at: habit.updated_at,
        todayCompleted: habit.streaks?.[0]?.user_completed || false,
        target_days: habit.target_days,
        status: habit.status || 'active',
        start_date: habit.start_date,
        end_date: habit.end_date,
        streaks: habit.streaks || [],
        // Add the new required fields
        last_completed_at: habit.last_completed_at || null,
        current_streak_count: habit.current_streak_count || 0,
        longest_streak_count: habit.longest_streak_count || 0,
        streak_start_date: habit.streak_start_date || null
      }));
    
      // Calculate streaks for each habit
      const habitsWithStreaks = transformedHabits.map(habit => ({
        ...habit,
        streakInfo: calculateStreak(habit)
      }));

      set({ habits: habitsWithStreaks });
    } catch (error: any) {
      console.error("Error fetching habits:", error);
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

 // Modified toggleHabitCompletion with optimistic updates
 toggleHabitCompletion: async (habitId: string) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const userId = (await supabase.auth.getUser()).data.user?.id;
    
    // Find the habit in the current state
    const habit = get().habits.find(h => h.id === habitId);
    if (!habit) return;
    
    // Create a unique action ID
    const actionId = `toggle-${habitId}-${Date.now()}`;
    
    // Optimistically update the UI
    set(state => {
      const updatedHabits = state.habits.map(h => {
        if (h.id === habitId) {
          // Toggle the completion status
          const newCompletionStatus = !h.todayCompleted;
          
          // Calculate new streak count (simplified for optimistic update)
          let newStreakCount = h.current_streak_count;
          if (newCompletionStatus) {
            // If completing, increment streak
            newStreakCount += 1;
          } else {
            // If uncompleting, decrement streak (but not below 0)
            newStreakCount = Math.max(0, newStreakCount - 1);
          }
          
          return {
            ...h,
            todayCompleted: newCompletionStatus,
            current_streak_count: newStreakCount,
            // Update longest streak if needed
            longest_streak_count: Math.max(h.longest_streak_count, newStreakCount)
          };
        }
        return h;
      });
      
      // Add to pending actions
      return {
        habits: updatedHabits,
        pendingActions: {
          ...state.pendingActions,
          [actionId]: {
            type: 'toggle',
            data: { habitId, previousState: habit.todayCompleted },
            timestamp: Date.now()
          }
        }
      };
    });
    
    // Cache the updated state
    storage.set('habits-cache', JSON.stringify(get().habits));
    
    // Perform the actual API call
    const { data: existingStreak, error: fetchError } = await supabase
      .from('streaks')
      .select('*')
      .eq('habit_id', habitId)
      .eq('date', today)
      .single();
    
    if (fetchError && fetchError.code !== 'PGRST116') {
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
    
    // Remove from pending actions after successful API call
    set(state => ({
      pendingActions: Object.fromEntries(
        Object.entries(state.pendingActions).filter(([key]) => key !== actionId)
      )
    }));
    
    // Refresh habits to get updated streak information
    await get().fetchHabits();
    
  } catch (error: any) {
    console.error("Error toggling habit completion:", error);
    
    // Revert the optimistic update on error
    await get().fetchHabits();
    
    set({ error: error.message });
  }
},


    // Add method to initialize from cache
    initFromCache: () => {
      try {
        const cachedHabits = storage.getString('habits-cache');
        if (cachedHabits) {
          set({ habits: JSON.parse(cachedHabits) });
        }
      } catch (error) {
        console.error("Error loading from cache:", error);
      }
    },

      // Add method to sync pending actions
  syncPendingActions: async () => {
    const pendingActions = get().pendingActions;
    
    for (const [actionId, action] of Object.entries(pendingActions)) {
      try {
        if (action.type === 'toggle') {
          await get().toggleHabitCompletion(action.data.habitId);
        }
        // Add other action types as needed
      } catch (error) {
        console.error(`Error syncing action ${actionId}:`, error);
      }
    }
  },

  createHabit: async (habit: Partial<Habit>) => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error('User not authenticated');

      // Modified to match the actual database schema
      const { data, error } = await supabase
      .from('habits')
      .insert({
        name: habit.name,
        description: habit.description,
        frequency: habit.frequency,
        is_public: habit.is_public,
        target_days: habit.target_days,
        status: habit.status || 'active',
        start_date: habit.start_date,
        end_date: habit.end_date,
        owner_id: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
        // Removed fields that don't exist in the schema:
        // current_streak, longest_streak, current_streak_count, 
        // longest_streak_count, last_completed_at, streak_start_date
      })
      .select('*')
      .single();

      if (error) {
        console.error("Error creating habit:", error);
        throw error;
      }
      
      // Transform the returned data to match our app's Habit type
      const transformedHabit: Habit = {
        id: data.id,
        name: data.name,
        description: data.description,
        frequency: data.frequency,
        owner_id: data.owner_id,
        partner_id: data.partner_id,
        is_public: data.is_public,
        created_at: data.created_at,
        updated_at: data.updated_at,
        todayCompleted: false,
        target_days: data.target_days,
        status: data.status,
        start_date: data.start_date,
        end_date: data.end_date,
        streaks: [],
        // Handle fields that might not exist in the database but are used in our app
        current_streak: 0,
        longest_streak: 0,
        last_completed_at: null,
        current_streak_count: 0,
        longest_streak_count: 0,
        streak_start_date: null
      };

      set(state => ({
        habits: [transformedHabit, ...state.habits]
      }));

      await get().fetchHabits();
    } catch (error: any) {
      console.error("Error in createHabit:", error);
      throw error;
    }
  },

  updateHabit: async (habitId: string, habit: Partial<Habit>) => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error('User not authenticated');

      // Create update object with only the fields provided
      const updateData: any = {
        updated_at: new Date().toISOString()
      };

      // Only include fields that are provided in the update
      if (habit.name !== undefined) updateData.name = habit.name;
      if (habit.description !== undefined) updateData.description = habit.description;
      if (habit.frequency !== undefined) updateData.frequency = habit.frequency;
      if (habit.is_public !== undefined) updateData.is_public = habit.is_public;
      if (habit.target_days !== undefined) updateData.target_days = habit.target_days;
      if (habit.status !== undefined) updateData.status = habit.status;
      if (habit.start_date !== undefined) updateData.start_date = habit.start_date;
      if (habit.end_date !== undefined) updateData.end_date = habit.end_date;

      const { error } = await supabase
        .from('habits')
        .update(updateData)
        .eq('id', habitId)
        .eq('owner_id', user.id); // Security check to ensure user only updates their habits

      if (error) {
        console.error("Error updating habit:", error);
        throw error;
      }

      // Update local state with optimistic update
      set(state => ({
        habits: state.habits.map(h =>
          h.id === habitId
            ? { ...h, ...updateData }
            : h
        )
      }));

      // Refresh habits to sync with server
      await get().fetchHabits();
    } catch (error: any) {
      console.error("Error in updateHabit:", error);
      throw error;
    }
  },

  deleteHabit: async (habitId: string) => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error('User not authenticated');

      // First, perform optimistic update in the UI
      set(state => ({
        habits: state.habits.filter(h => h.id !== habitId)
      }));

      let success = false;

      try {
        // Method 1: Try the RPC function first (if it exists)
        try {
          console.log(`Attempting to use RPC function for habit deletion: ${habitId}`);
          const { error: rpcError } = await supabase.rpc('delete_habit_with_dependencies', { habit_id: habitId });

          if (!rpcError) {
            console.log(`✅ Successfully deleted habit ${habitId} using RPC function`);
            success = true;
            return;
          } else {
            console.log(`❌ RPC function failed: ${rpcError.message}, code: ${rpcError.code}, details: ${rpcError.details}`);
          }
        } catch (rpcErr: any) {
          console.log(`❌ RPC function unavailable: ${rpcErr.message || rpcErr}`);
        }

        // Method 2: Try direct deletion (if habits have cascade delete set up)
        try {
          console.log(`Attempting direct habit deletion: ${habitId}`);
          const { error: directDeleteError } = await supabase
            .from('habits')
            .delete()
            .eq('id', habitId)
            .eq('owner_id', user.id);

          if (!directDeleteError) {
            console.log(`✅ Successfully deleted habit ${habitId} directly`);
            success = true;
            return;
          } else {
            console.log(`❌ Direct deletion failed: ${directDeleteError.message}, code: ${directDeleteError.code}`);
          }
        } catch (directErr: any) {
          console.log(`❌ Direct deletion error: ${directErr.message || directErr}`);
        }

        // Method 3: Manual sequential deletion as last resort
        console.log(`Attempting manual sequential deletion for habit ${habitId}`);

        // 1. Try deleting habit invites
        const { error: invitesError } = await supabase
          .from('habit_invites')
          .delete()
          .eq('habit_id', habitId);

        if (invitesError) {
          console.log(`⚠️ Could not delete habit invites: ${invitesError.message} (${invitesError.code})`);
          // Continue anyway, there might not be any invites
        } else {
          console.log(`✅ Successfully deleted habit invites`);
        }

        // 2. Try deleting streaks
        const { error: streaksError } = await supabase
          .from('streaks')
          .delete()
          .eq('habit_id', habitId);

        if (streaksError) {
          console.log(`⚠️ Could not delete streaks: ${streaksError.message} (${streaksError.code})`);
          // Continue anyway, there might not be any streaks
        } else {
          console.log(`✅ Successfully deleted streaks`);
        }

        // 3. Finally try deleting the habit
        const { error: habitError } = await supabase
          .from('habits')
          .delete()
          .eq('id', habitId)
          .eq('owner_id', user.id);

        if (habitError) {
          console.log(`❌ Final habit deletion failed: ${habitError.message} (${habitError.code})`);
          throw habitError;
        } else {
          console.log(`✅ Successfully deleted habit`);
          success = true;
        }

      } catch (error: any) {
        console.error("Error during deletion process:", error);
        success = false;
        throw error;
      } finally {
        if (!success) {
          console.log("Deletion failed, reverting optimistic update");
          await get().fetchHabits();
        }
      }
    } catch (error: any) {
      console.error("Error in deleteHabit:", error);
      throw error;
    }
  }
}));
