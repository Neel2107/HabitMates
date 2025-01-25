import { Session } from '@supabase/supabase-js';
import { create } from 'zustand';
import { supabase } from '../supabase';

export const useAuthStore = create<{
  session: Session | null;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  setSession: (session: Session | null) => void;
}>((set) => ({
  session: null,
  isLoading: true,
  setIsLoading: (isLoading) => set({ isLoading }),
  
  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;

    try {
      // Create or update user profile
      const { error: upsertError } = await supabase
        .from('users')
        .upsert({
          id: data.session.user.id,
          username: email.split('@')[0],
          avatar_url: null,
          is_active: true,
          banned: false,
          streak_rescues_remaining: 3,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'id',
          ignoreDuplicates: false,
        });

      if (upsertError) {
        console.error('Error upserting user profile:', upsertError);
        throw upsertError;
      }

      set({ session: data.session });
    } catch (error) {
      console.error('Error in user profile creation:', error);
      throw error;
    }
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    set({ session: null });
  },
  setSession: (session) => set({ session }),
}));