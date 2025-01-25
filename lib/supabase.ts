import 'react-native-url-polyfill/auto'
import { createClient } from '@supabase/supabase-js';
import { storage } from './storage';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(SUPABASE_URL!, SUPABASE_KEY!, {
  auth: {
    storage: {
      getItem: (key) => storage.getString(key) || null,
      setItem: (key, value) => storage.set(key, value),
      removeItem: (key) => storage.delete(key),
    },
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});