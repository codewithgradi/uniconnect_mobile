import { Stack } from "expo-router";

export default function AdminRootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Main Tab Navigator */}
      <Stack.Screen name="(tabs)" />

      {/* Detail Screens rendered inside the Stack */}
      <Stack.Screen
        name="verifications/[id]"
        options={{
          headerShown: true,
          title: "Opportunity Details",
          headerBackTitle: "Back",
        }}
      />
     
    </Stack>
  );
}
