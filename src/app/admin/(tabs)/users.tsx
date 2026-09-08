import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  ActivityIndicator,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useSearchProfiles } from "@/api/hooks/useProfile";

export default function UserManagementScreen() {
  const isDark = useColorScheme() === "dark";
  const [activeTab, setActiveTab] = useState<"Students" | "Alumni">("Students");
  const [search, setSearch] = useState("");

  const {
    data: profiles = [],
    isLoading,
    isError,
  } = useSearchProfiles({
    searchItem: search.trim() !== "" ? search : undefined,
    targetProgramme: undefined,
  });

  // Filter profiles based on the active tab, checking userType or falling back to user properties
  const filteredProfiles = profiles.filter((profile: any) => {
    // Check userType on the profile itself, or fallback to parent properties if structured differently
    const userType = (
      profile.userType ||
      profile.user?.userType ||
      profile.role ||
      ""
    ).toLowerCase();

    if (activeTab === "Students") {
      return userType.includes("student");
    } else {
      return userType.includes("alumni") || userType.includes(" alumnus");
    }
  });

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
          placeholder="Search profiles..."
          placeholderTextColor="#9CA3AF"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Role Filter Tabs */}
      <View style={styles.tabRow}>
        {(["Students", "Alumni"] as const).map((tab) => (
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
                  : isDark
                    ? styles.darkTabText
                    : styles.inactiveTabText,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Profile List */}
      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#006837" />
          <Text
            style={[
              styles.loadingText,
              isDark ? styles.darkText : styles.lightText,
            ]}
          >
            Searching profiles...
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredProfiles}
          keyExtractor={(item: any) => item.id}
          renderItem={({ item }: { item: any }) => {
            const fullName =
              `${item.firstName || ""} ${item.lastName || ""}`.trim() ||
              "Unknown User";
            const initial = fullName.charAt(0).toUpperCase();

            return (
              <View
                style={[
                  styles.userCard,
                  isDark ? styles.darkCard : styles.lightCard,
                ]}
              >
                <View style={styles.userLeft}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{initial}</Text>
                  </View>
                  <View style={styles.userInfoArea}>
                    <Text
                      style={[
                        styles.userName,
                        isDark ? styles.darkText : styles.lightText,
                      ]}
                    >
                      {fullName}
                    </Text>
                    <Text style={styles.userRole}>
                      {item.headline ||
                        item.userType ||
                        item.user?.userType ||
                        activeTab}
                    </Text>
                  </View>
                </View>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>Active</Text>
                </View>
              </View>
            );
          }}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="search-outline" size={48} color="#006837" />
              <Text
                style={[
                  styles.emptyTitle,
                  isDark ? styles.darkText : styles.lightText,
                ]}
              >
                No Profiles Found
              </Text>
              <Text style={styles.emptySub}>
                No matching {activeTab.toLowerCase()} profiles were found.
              </Text>
            </View>
          }
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 16 },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
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
  darkTabText: { color: "#D1D5DB" },
  userCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
  },
  userLeft: { flexDirection: "row", alignItems: "center", gap: 12, flex: 1 },
  userInfoArea: { flex: 1 },
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
  userRole: { fontSize: 12, color: "#6B7280", marginTop: 1 },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    backgroundColor: "#D1FAE5",
  },
  statusText: { fontSize: 11, fontWeight: "700", color: "#065F46" },
  loadingText: { marginTop: 12, fontSize: 13, fontWeight: "600" },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 60,
    gap: 8,
  },
  emptyTitle: { fontSize: 16, fontWeight: "700" },
  emptySub: { fontSize: 12, color: "#9CA3AF", textAlign: "center" },
  lightCard: { backgroundColor: "#F9FAFB", borderColor: "#E5E7EB" },
  darkCard: { backgroundColor: "#1F2937", borderColor: "#374151" },
  lightText: { color: "#111827" },
  darkText: { color: "#FFFFFF" },
});
