import { Tabs } from "expo-router";
import { useColorScheme } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function AdminTabsLayout() {
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
          height: 90,
          paddingBottom: 8,
          paddingTop: 8,
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Admin Dashboard",
          tabBarLabel: "Dashboard",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="grid-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="users"
        options={{
          title: "User Management",
          tabBarLabel: "Users",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="verifications"
        options={{
          title: "Verifications",
          tabBarLabel: "Verify",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="checkmark-circle-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="moderation"
        options={{
          title: "Content Moderation",
          tabBarLabel: "Content",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="shield-checkmark-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="analytics"
        options={{
          title: "Admin Analytics",
          tabBarLabel: "Analytics",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="stats-chart" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
