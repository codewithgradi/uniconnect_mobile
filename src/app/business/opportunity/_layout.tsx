import { Stack } from "expo-router";
import { useColorScheme } from "react-native";

export default function OpportunitiesStackLayout() {
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
      <Stack.Screen name="index" options={{ title: "Opportunities" }} />
      <Stack.Screen name="[id]" options={{ title: "Opportunity Details" }} />
    </Stack>
  );
}
