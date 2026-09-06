import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function UserManagementScreen() {
  const isDark = useColorScheme() === "dark";
  const [activeTab, setActiveTab] = useState<
    "Students" | "Alumni" | "Businesses"
  >("Students");
  const [search, setSearch] = useState("");

  const users = [
    {
      id: "1",
      name: "Sarah Johnson",
      type: "Students",
      role: "Student",
      status: "Active",
    },
    {
      id: "2",
      name: "James Mwangi",
      type: "Alumni",
      role: "Alumni",
      status: "Active",
    },
    {
      id: "3",
      name: "TechCorp Solutions",
      type: "Businesses",
      role: "Business",
      status: "Pending",
    },
    {
      id: "4",
      name: "Lerato Dlamini",
      type: "Alumni",
      role: "Alumni",
      status: "Active",
    },
    {
      id: "5",
      name: "Thabo Nkosi",
      type: "Students",
      role: "Student",
      status: "Suspended",
    },
  ];

  const filteredUsers = users.filter(
    (u) =>
      u.type === activeTab &&
      u.name.toLowerCase().includes(search.toLowerCase()),
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return { bg: "#D1FAE5", text: "#065F46" };
      case "Pending":
        return { bg: "#FEF3C7", text: "#92400E" };
      case "Suspended":
        return { bg: "#FEE2E2", text: "#991B1B" };
      default:
        return { bg: "#E5E7EB", text: "#374151" };
    }
  };

  return (
    <View style={[styles.container, isDark ? styles.darkBg : styles.lightBg]}>
      {/* Search Input */}
      <View
        style={[styles.searchBox, isDark ? styles.darkCard : styles.lightCard]}
      >
        <Ionicons name="search" size={16} color="#9CA3AF" />
        <TextInput
          style={[
            styles.searchInput,
            isDark ? styles.darkText : styles.lightText,
          ]}
          placeholder="Search users..."
          placeholderTextColor="#9CA3AF"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Role Filter Tabs */}
      <View style={styles.tabRow}>
        {(["Students", "Alumni", "Businesses"] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabBtn, activeTab === tab && styles.activeTabBtn]}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab
                  ? styles.activeTabText
                  : styles.inactiveTabText,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* User List */}
      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const badge = getStatusColor(item.status);
          return (
            <View
              style={[
                styles.userCard,
                isDark ? styles.darkCard : styles.lightCard,
              ]}
            >
              <View style={styles.userLeft}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
                </View>
                <View>
                  <Text
                    style={[
                      styles.userName,
                      isDark ? styles.darkText : styles.lightText,
                    ]}
                  >
                    {item.name}
                  </Text>
                  <Text style={styles.userRole}>{item.role}</Text>
                </View>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: badge.bg }]}>
                <Text style={[styles.statusText, { color: badge.text }]}>
                  {item.status}
                </Text>
              </View>
            </View>
          );
        }}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 16 },
  lightBg: { backgroundColor: "#FFFFFF" },
  darkBg: { backgroundColor: "#111827" },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    height: 42,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    gap: 8,
    marginBottom: 14,
  },
  searchInput: { flex: 1, fontSize: 14 },
  tabRow: { flexDirection: "row", gap: 8, marginBottom: 16 },
  tabBtn: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "#E5E7EB",
  },
  activeTabBtn: { backgroundColor: "#006837" },
  tabText: { fontSize: 12, fontWeight: "600" },
  activeTabText: { color: "#FFFFFF" },
  inactiveTabText: { color: "#374151" },
  userCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
  },
  userLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#006837",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: { color: "#FFFFFF", fontWeight: "700", fontSize: 14 },
  userName: { fontSize: 14, fontWeight: "700" },
  userRole: { fontSize: 12, color: "#6B7280" },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
  statusText: { fontSize: 11, fontWeight: "700" },
  lightCard: { backgroundColor: "#F9FAFB", borderColor: "#E5E7EB" },
  darkCard: { backgroundColor: "#1F2937", borderColor: "#374151" },
  lightText: { color: "#111827" },
  darkText: { color: "#FFFFFF" },
});
