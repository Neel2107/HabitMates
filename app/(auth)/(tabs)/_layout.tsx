import { ThemeProvider } from "@/components/ThemeProvider";
import { useAuthStore } from "@/lib/stores/authStore";
import { useThemeStore } from "@/lib/stores/themeStore";
import { Redirect, Tabs } from "expo-router";
import { StatusBar } from 'expo-status-bar';
import { HandshakeIcon, Home, ListChecks, User } from 'lucide-react-native';
import { Platform, Pressable, View } from "react-native";

export default function AuthLayout() {
  const isDark = useThemeStore((state) => state.isDark);
  const session = useAuthStore((state) => state.session);



  if (!session) {
    return <Redirect href="/login" />;
  }

  return (
    <ThemeProvider>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <View className={`flex-1 ${isDark ? 'bg-app-dark' : 'bg-app-light'}`}>
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: isDark ? '#6ee7b7' : '#059669',
            tabBarInactiveTintColor: isDark ? '#94a3b8' : '#64748b',
            tabBarStyle: {
              paddingTop: Platform.OS === 'android' ? 14 : 0,
              height: 65,
              backgroundColor: isDark ? '#171717' : '#ffffff',
              borderTopWidth: 1,
              borderColor: isDark ? '#1f1f1f' : '#e5e7eb'
            },
            headerPressColor: 'transparent',
            headerShown: false,
            tabBarButton: (props) => (
              <Pressable
                {...props}
                android_ripple={{ color: 'transparent' }}  // Disables the ripple effect for Android
              />
            ),
            tabBarShowLabel: false,
          }}>
          <Tabs.Screen
            name="home"
            options={{
              title: "Home",
              tabBarIcon: ({ color }) => <Home size={24} color={color} />,
              tabBarLabelStyle: {
                fontWeight: '500'
              }
            }}
          />
          <Tabs.Screen
            name="habits"
            options={{
              title: "Habits",
              tabBarIcon: ({ color }) => <ListChecks size={24} color={color} />,
              tabBarLabelStyle: {
                fontWeight: '500'
              }
            }}
          />
          <Tabs.Screen
            name="partners"
            options={{
              title: "Partners",
              tabBarIcon: ({ color }) => <HandshakeIcon size={24} color={color} />,
              tabBarLabelStyle: {
                fontWeight: '500'
              }
            }}
          />
          <Tabs.Screen
            name="profile"
            options={{
              title: "Profile",
              tabBarIcon: ({ color }) => <User size={24} color={color} />,
              tabBarLabelStyle: {
                fontWeight: '500'
              }
            }}
          />
        </Tabs>
      </View>
    </ThemeProvider>
  );
}