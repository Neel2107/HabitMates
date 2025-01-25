import { useThemeStore } from '@/lib/stores/themeStore';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const mode = useThemeStore((state) => state.mode);
  const isDark = useThemeStore((state) => state.isDark);
  const setIsDark = useThemeStore((state) => state.setIsDark);
  const systemColorScheme = useColorScheme();

  useEffect(() => {
    if (mode === 'system') {
      setIsDark(systemColorScheme === 'dark');
    } else {
      setIsDark(mode === 'dark');
    }
  }, [mode, systemColorScheme]);

  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      className="flex-1"
    >
      {children}
    </Animated.View>
  );
}