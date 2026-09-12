import { Stack } from "expo-router";
import { useColorScheme } from "react-native";

export default function BusinessLayout() {
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
      <Stack.Screen
        name="edit-profile"
        options={{ headerShown: true, title: "Profile Update" }}
      />

      {/* Detail / Modal Sub-screens (Stack layer hides tab bar automatically) */}
      <Stack.Screen
        name="post-opportunity"
        options={{ title: "Create Opportunity ", headerBackTitle: "Back" }}
      />
      <Stack.Screen
        name="messages"
        options={{ title: "Conversations", headerBackTitle: "Back" }}
      />
      <Stack.Screen
        name="messages/[id]"
        options={{ title: "Chat", headerBackTitle: "Back" }}
      />
      <Stack.Screen
        name="applicant/[id]"
        options={{ title: "Applicants", headerBackTitle: "Back" }}
      />
      <Stack.Screen
        name="user/[id]"
        options={{ title: "Profile", headerBackTitle: "Back" }}
      />
      
      <Stack.Screen
        name="opportunity"
        options={{ title: "Opportunity", headerShown:false }}
      />
    </Stack>
  );
}
