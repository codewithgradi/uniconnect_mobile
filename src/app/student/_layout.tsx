import { Stack } from "expo-router";
import { useColorScheme } from "react-native";

export default function StudentStackLayout() {
  const isDark = useColorScheme() === "dark";

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: isDark ? "#111827" : "#FFFFFF" },
        headerTitleStyle: {
          color: isDark ? "#FFFFFF" : "#111827",
          fontWeight: "700",
        },
        headerTintColor: isDark ? "#008748" : "#006837",
        headerShadowVisible: false,
      }}
    >
      {/* Bottom Tabs Group */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

      {/* Detail / Modal Sub-screens (Stack layer hides tab bar automatically) */}
      <Stack.Screen
        name="opportunities/[id]"
        options={{ title: "Opportunity Details", headerBackTitle: "Back" }}
      />
      <Stack.Screen
        name="profile/[id]"
        options={{ title: "Profile Info", headerBackTitle: "Back" }}
      />
      <Stack.Screen
        name="messages/[id]"
        options={{ title: "Chat", headerBackTitle: "Back" }}
      />
      <Stack.Screen name="events" options={{ title: "Events" }} />
      <Stack.Screen name="notifications" options={{ title: "Notifications" }} />
      <Stack.Screen name="settings" options={{ title: "Profile Settings" }} />
      <Stack.Screen name="assistant" options={{ title: "AI Assistant" }} />
    </Stack>
  );
}
