// app/_layout.tsx
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen name="index" options={{ title: "Home" }} />
      <Stack.Screen name="auth/FirstScreen" options={{ title: "Welcome" }} />
      <Stack.Screen name="auth/Login" options={{ title: "Login" }} />
      <Stack.Screen name="auth/SignUp" options={{ title: "Sign Up" }} />
      <Stack.Screen name="auth/ProfileScreen" options={{ title: "Profile" }} />
      {/* Add more screens here if needed */}
    </Stack>
  );
}
