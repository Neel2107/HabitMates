import { useThemeStore } from '@/lib/stores/themeStore';
import { View } from 'react-native';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const isDark = useThemeStore((state) => state.isDark);

  return (
    <View className={`flex-1 ${isDark ? 'dark' : ''}`}>
      {children}
    </View>
  );
}