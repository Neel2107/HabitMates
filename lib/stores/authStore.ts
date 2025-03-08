import { Session } from '@supabase/supabase-js';
import { create } from 'zustand';
import { supabase } from '../supabase';


interface AuthState {
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  signOut: () => Promise<void>;
  setSession: (session: Session | null) => void;
  setIsLoading: (isLoading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
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

  signUp: async (email: string, password: string, username: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
        },
      },
    });
    if (error) throw error;

    try {
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: data.user?.id,
          username,
          avatar_url: null,
          is_active: true,
          banned: false,
          streak_rescues_remaining: 3,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

      if (profileError) {
        console.error('Error creating user profile:', profileError);
        // If profile creation fails, attempt to delete the auth user
        await supabase.auth.admin.deleteUser(data.user?.id as string);
        throw profileError;
      }

      if (data.session) {
        set({ session: data.session });
      }
    } catch (error) {
      console.error('Error in signup process:', error);
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