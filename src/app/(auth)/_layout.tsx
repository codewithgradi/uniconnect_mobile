import { Stack } from "expo-router";
import { useColorScheme } from "react-native";

export default function AuthLayout() {
  const isDark = useColorScheme() === "dark";

  return (
    <Stack
      screenOptions={{
        headerShown: true, // Enables the top navigation bar with back arrow
        headerStyle: {
          backgroundColor: isDark ? "#111827" : "#FFFFFF",
        },
        headerTintColor: isDark ? "#008748" : "#006837", // Green back arrow/title
        headerTitleStyle: {
          fontWeight: "600",
        },
        headerShadowVisible: false, // Clean look without bottom border
        contentStyle: {
          backgroundColor: isDark ? "#111827" : "#FFFFFF",
        },
      }}
    >
      <Stack.Screen
        name="role"
        options={{
          title: "Select Role",
          headerBackTitle: "Back",
        }}
      />
      <Stack.Screen
        name="login"
        options={{
          title: "Sign In",
          headerBackTitle: "Back",
        }}
      />
      <Stack.Screen
        name="register"
        options={{
          title: "Register",
          headerBackTitle: "Back",
        }}
      />
      <Stack.Screen
        name="verification"
        options={{
          title: "Email Verification",
          headerBackTitle: "Back",
        }}
      />
    </Stack>
  );
}
