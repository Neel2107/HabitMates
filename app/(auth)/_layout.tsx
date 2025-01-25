import { useAuthStore } from "@/lib/stores/authStore";
import { Redirect, Stack } from "expo-router";

export default function AuthLayout() {
  const session = useAuthStore((state) => state.session);

  if (!session) {
    return <Redirect href="/login" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="home" />
    </Stack>
  );
}