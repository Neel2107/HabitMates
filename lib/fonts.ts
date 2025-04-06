import * as Font from 'expo-font';

export const loadFonts = async () => {
  await Font.loadAsync({
    'Inter_28pt-Thin': require('@/assets/fonts/Inter_28pt-Thin.ttf'),
    'Inter_28pt-ExtraLight': require('@/assets/fonts/Inter_28pt-ExtraLight.ttf'),
    'Inter_28pt-Light': require('@/assets/fonts/Inter_28pt-Light.ttf'),
    'Inter': require('@/assets/fonts/Inter_28pt-Medium.ttf'), // Using Medium as default
    'Inter_28pt-Medium': require('@/assets/fonts/Inter_28pt-Medium.ttf'),
    'Inter_28pt-SemiBold': require('@/assets/fonts/Inter_28pt-SemiBold.ttf'),
    'Inter_28pt-Bold': require('@/assets/fonts/Inter_28pt-Bold.ttf'),
    'Inter_28pt-ExtraBold': require('@/assets/fonts/Inter_28pt-ExtraBold.ttf'),
  });
};