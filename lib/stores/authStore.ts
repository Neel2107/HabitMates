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
  updateProfile: (data: { 
    username?: string; 
    avatar_url?: string | null;
    updated_at?: string;
  }) => Promise<void>;
  uploadAvatar: (file: string) => Promise<string>;
  resetPassword: (email: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
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

  updateProfile: async (data) => {
    try {
        // Update user metadata in Supabase Auth
        const { error: metadataError } = await supabase.auth.updateUser({
            data: {
                ...get().session?.user?.user_metadata,
                ...data
            }
        });

        if (metadataError) throw metadataError;

        // Update users table
        const { error: profileError } = await supabase
            .from('users')
            .update({
                ...data,
                updated_at: new Date().toISOString(),
            })
            .eq('id', get().session?.user?.id);

        if (profileError) throw profileError;

        // Update local session with new metadata
        const { data: { session } } = await supabase.auth.getSession();
        set({ session });

    } catch (error) {
        console.error('Profile update error:', error);
        throw error;
    }
},

  uploadAvatar: async (uri: string) => {
    try {
        console.log('Starting avatar upload for URI:', uri);
        
        // Handle Android file URI
        const formData = new FormData();
        formData.append('file', {
            uri: uri,
            type: 'image/jpeg',
            name: 'avatar.jpg'
        } as any);
        
        const fileExt = 'jpeg';
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `${get().session?.user?.id}/${fileName}`;
        
        console.log('Uploading to path:', filePath);

        // Direct upload using the file URI
        const { error: uploadError, data: uploadData } = await supabase.storage
            .from('avatars')
            .upload(filePath, formData, {
                contentType: 'image/jpeg',
                upsert: true
            });

        if (uploadError) {
            console.error('Supabase upload error:', uploadError);
            throw uploadError;
        }

        console.log('Upload successful:', uploadData);

        const { data: { publicUrl } } = supabase.storage
            .from('avatars')
            .getPublicUrl(filePath);

        console.log('Generated public URL:', publicUrl);
        return publicUrl;
    } catch (error: any) {
        console.error('Detailed avatar upload error:', {
            message: error.message,
            stack: error.stack,
            cause: error.cause
        });
        throw error;
    }
},

resetPassword: async (email: string) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: 'habitmates://reset-confirm',
  });
  if (error) throw error;
},
}));