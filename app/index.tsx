import { useAuthStore } from "@/lib/stores/authStore";
import { Redirect } from "expo-router";

export default function Index() {
  const session = useAuthStore((state) => state.session);

  if (!session) {
    return <Redirect href="/login" />;
  }

  return <Redirect href="/(auth)/home" />;
}