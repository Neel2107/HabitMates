import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { storage } from '../storage';

type ThemeMode = 'system' | 'light' | 'dark';

interface ThemeState {
  mode: ThemeMode;
  isDark: boolean;
  setMode: (mode: ThemeMode) => void;
  setIsDark: (isDark: boolean) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      mode: 'system',
      isDark: false,
      setMode: (mode: ThemeMode) => set({ mode }),
      setIsDark: (isDark: boolean) => set({ isDark }),
    }),
    {
      name: 'theme-storage',
      storage: {
        getItem: (name) => {
          const str = storage.getString(name);
          return str ? JSON.parse(str) : null;
        },
        setItem: (name, value) => {
          storage.set(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          storage.delete(name);
        },
      },
    }
  )
);