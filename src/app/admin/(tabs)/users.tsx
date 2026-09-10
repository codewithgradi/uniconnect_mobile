import React, { useState, useMemo } from "react";
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
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const pageSize = 10;

  const {
    data: profiles = [],
    isLoading,
    isError,
  } = useSearchProfiles({
    searchItem: search.trim() !== "" ? search : undefined,
    targetProgramme: undefined,
  });

  const filteredProfiles = useMemo(() => {
    return profiles.filter((profile: any) => {
      const userType = (
        profile.userType ||
        profile.user?.userType ||
        profile.role ||
        profile.user?.role ||
        profile.type ||
        ""
      )
        .toLowerCase()
        .trim();

      if (activeTab === "Students") {
        return userType.includes("student") || userType === "";
      } else {
        return (
          userType.includes("alumni") ||
          userType.includes("alumnus") ||
          userType.includes("graduate")
        );
      }
    });
  }, [profiles, activeTab]);

  const paginatedProfiles = useMemo(() => {
    return filteredProfiles.slice(0, page * pageSize);
  }, [filteredProfiles, page]);

  const hasMore = paginatedProfiles.length < filteredProfiles.length;

  const loadMoreItems = () => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    setTimeout(() => {
      setPage((prev) => prev + 1);
      setIsLoadingMore(false);
    }, 200);
  };

  const getInitials = (
    firstName?: string,
    lastName?: string,
    fallbackName?: string,
  ) => {
    if (firstName && lastName) {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    }
    if (firstName) {
      return firstName.substring(0, 2).toUpperCase();
    }
    if (fallbackName) {
      const parts = fallbackName.trim().split(" ");
      if (parts.length >= 2) {
        return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
      }
      return fallbackName.substring(0, 2).toUpperCase();
    }
    return "US";
  };

  if (isLoading) {
    return (
      <View
        style={[
          styles.container,
          styles.centered,
          isDark ? styles.darkBg : styles.lightBg,
        ]}
      >
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
    );
  }

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
          onChangeText={(text) => {
            setSearch(text);
            setPage(1);
          }}
        />
      </View>

      {/* Role Filter Tabs */}
      <View style={styles.tabRow}>
        {(["Students", "Alumni"] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabBtn, activeTab === tab && styles.activeTabBtn]}
            onPress={() => {
              setActiveTab(tab);
              setPage(1);
            }}
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
      <FlatList
        data={paginatedProfiles}
        keyExtractor={(item: any, index) =>
          item.id?.toString() || index.toString()
        }
        renderItem={({ item }: { item: any }) => {
          const firstName = item.firstName || "";
          const lastName = item.lastName || "";
          const rawName = item.name || "";
          const initials = getInitials(firstName, lastName, rawName);

          return (
            <View
              style={[
                styles.userCard,
                isDark ? styles.darkCard : styles.lightCard,
              ]}
            >
              <View style={styles.userLeft}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{initials}</Text>
                </View>
                <View style={styles.userInfoArea}>
                  <View style={styles.nameRow}>
                    <Text
                      style={[
                        styles.userName,
                        isDark ? styles.darkText : styles.lightText,
                      ]}
                    >
                      {firstName}
                    </Text>
                    <Text
                      style={[
                        styles.userName,
                        isDark ? styles.darkText : styles.lightText,
                      ]}
                    >
                      {lastName}
                    </Text>
                  </View>
                  <Text style={styles.userRole} numberOfLines={1}>
                    {item.headline ||
                      item.userType ||
                      item.user?.userType ||
                      item.role ||
                      activeTab}
                  </Text>
                </View>
              </View>
            </View>
          );
        }}
        onEndReached={() => {
          if (hasMore && !isLoadingMore) {
            loadMoreItems();
          }
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isLoadingMore ? (
            <View style={styles.footerLoader}>
              <ActivityIndicator size="small" color="#006837" />
              <Text
                style={[
                  styles.loadingMoreText,
                  isDark ? styles.darkText : styles.lightText,
                ]}
              >
                Loading more profiles...
              </Text>
            </View>
          ) : null
        }
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
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 16 },
  centered: { justifyContent: "center", alignItems: "center" },
  lightBg: { backgroundColor: "#FFFFFF" },
  darkBg: { backgroundColor: "#111827" },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    gap: 10,
    marginBottom: 14,
  },
  searchInput: { flex: 1, fontSize: 14 },
  tabRow: { flexDirection: "row", gap: 8, marginBottom: 16 },
  tabBtn: {
    paddingHorizontal: 18,
    paddingVertical: 7,
    borderRadius: 18,
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
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 10,
  },
  userLeft: { flexDirection: "row", alignItems: "center", gap: 14, flex: 1 },
  userInfoArea: { flex: 1 },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#006837",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  avatarText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 13,
    letterSpacing: 0.5,
  },
  userName: { fontSize: 14, fontWeight: "700" },
  userRole: { fontSize: 12, color: "#6B7280", marginTop: 2 },
  loadingText: { marginTop: 12, fontSize: 13, fontWeight: "600" },
  footerLoader: {
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  loadingMoreText: { fontSize: 12, fontWeight: "600" },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 60,
    gap: 8,
  },
  emptyTitle: { fontSize: 16, fontWeight: "700" },
  emptySub: { fontSize: 12, color: "#9CA3AF", textAlign: "center" },
  lightCard: {
    backgroundColor: "#F9FAFB",
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 3,
    elevation: 1,
  },
  darkCard: { backgroundColor: "#1F2937", borderColor: "#374151" },
  lightText: { color: "#111827" },
  darkText: { color: "#FFFFFF" },
  listContent: { paddingBottom: 24 },
});
