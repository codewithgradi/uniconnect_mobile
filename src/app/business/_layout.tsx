import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";
import { useColorScheme } from "react-native";

export default function BusinessLayout() {
  const isDark = useColorScheme() === "dark";

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: isDark ? "#111827" : "#FFFFFF" },
        headerTitleStyle: {
          color: isDark ? "#FFFFFF" : "#111827",
          fontWeight: "700",
        },
        headerTintColor: isDark ? "#008748" : "#006837",
        headerShadowVisible: false,
        tabBarActiveTintColor: isDark ? "#008748" : "#006837",
        tabBarInactiveTintColor: isDark ? "#9CA3AF" : "#6B7280",
        tabBarStyle: {
          backgroundColor: isDark ? "#111827" : "#FFFFFF",
          borderTopColor: isDark ? "#374151" : "#E5E7EB",
          height: 120,
          paddingBottom: 8,
          paddingTop: 8,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Dashboard",
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="edit-profile"
        options={{
          title: "Edit Profile",
          href: null,
        }}
      />

      <Tabs.Screen
        name="applicants"
        options={{
          title: "Applicants",
          tabBarLabel: "Applicants",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="messages"
        options={{
          title: "Messages",
          tabBarLabel: "Messages",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubbles-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="analytics"
        options={{
          title: "Analytics",
          tabBarLabel: "Analytics",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="stats-chart-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Company Profile",
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />

      {/* Hidden Routes */}
      <Tabs.Screen
        name="post-opportunity"
        options={{ title: "Post Opportunity", href: null }}
      />
      <Tabs.Screen
        name="applicant/[id]"
        options={{ title: "Applicant Details", href: null }}
      />
      <Tabs.Screen
        name="messages/[id]"
        options={{ title: "Chat", href: null }}
      />
    </Tabs>
  );
}
