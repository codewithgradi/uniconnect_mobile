import {
  useGetMyPostings,
  useCloseOpportunity,
} from "@/api/hooks/useOpportunity";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState, useMemo } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Platform,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

interface Opportunity {
  id: string;
  title: string;
  description: string;
  targetProgramme?: string;
  status?: string | number;
  createdAtUtc: string;
}

type FilterTab = "ALL" | "ACTIVE" | "CLOSED";

export default function MyPostingsScreen() {
  const router = useRouter();
  const isDark = useColorScheme() === "dark";

  const myQuery = useGetMyPostings();
  const { mutate: closeOpportunity } = useCloseOpportunity();
  const rawData = myQuery.data;

  const currentData: Opportunity[] = Array.isArray(rawData)
    ? rawData
    : rawData
      ? [rawData as Opportunity]
      : [];

  const isLoading = myQuery.isLoading;
  const isFetching = myQuery.isFetching;
  const error = myQuery.error;
  const refetch = myQuery.refetch;

  const [closingId, setClosingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<FilterTab>("ALL");

  const getStatusInfo = (status: string | number | undefined) => {
    const s = typeof status === "string" ? status.toLowerCase() : status;

    if (s === 2 || s === "pendingapproval" || s === "pending") {
      return { label: "PENDING_SYNC", isPending: true, isClosed: false };
    }
    if (s === 1 || s === "draft") {
      return { label: "STAGED_DRAFT", isPending: true, isClosed: false };
    }
    if (s === 4 || s === "closed") {
      return { label: "OFFLINE", isPending: false, isClosed: true };
    }
    if (s === 5 || s === "rejected") {
      return { label: "TERMINATED", isPending: false, isClosed: true };
    }
    return { label: "ONLINE", isPending: false, isClosed: false };
  };

  const filteredData = useMemo(() => {
    return currentData.filter((item) => {
      const { isClosed } = getStatusInfo(item.status);
      if (activeTab === "ACTIVE") return !isClosed;
      if (activeTab === "CLOSED") return isClosed;
      return true;
    });
  }, [currentData, activeTab]);

  const executeClose = (id: string) => {
    console.log("Triggering mutation hook for ID:", id);
    setClosingId(id);
    closeOpportunity(id, {
      onSuccess: () => {
        console.log("Mutation successful!");
        setClosingId(null);
        refetch();
        if (Platform.OS !== "web") {
          Alert.alert("Success", "Node disconnected successfully.");
        }
      },
      onError: (err: any) => {
        console.log("Mutation failed:", err?.response?.data || err.message);
        setClosingId(null);
        const errorMsg =
          err?.response?.data?.message ||
          "Failed to disconnect node. Please try again.";
        if (Platform.OS === "web") {
          window.alert(errorMsg);
        } else {
          Alert.alert("Telemetry Error", errorMsg);
        }
      },
    });
  };

  const handleClosePosting = (id: string, title: string) => {
    console.log("Close button pressed for opportunity ID:", id);

    if (Platform.OS === "web") {
      const confirmed = window.confirm(
        `Are you sure you want to disconnect network node "${title}"?`,
      );
      if (confirmed) {
        executeClose(id);
      }
    } else {
      Alert.alert(
        "Disconnect Node",
        `Are you sure you want to disconnect network node "${title}"?`,
        [
          { text: "Abort", style: "cancel" },
          {
            text: "Disconnect",
            style: "destructive",
            onPress: () => executeClose(id),
          },
        ],
      );
    }
  };

  const renderItem = ({ item }: { item: Opportunity }) => {
    const { label, isPending, isClosed } = getStatusInfo(item.status);
    const isClosing = closingId === item.id;

    return (
      <View style={[styles.card, isDark ? styles.darkCard : styles.lightCard]}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.push(`/business/applicant/${item.id}` as any)}
        >
          <View style={styles.cardHeader}>
            <Text
              style={[
                styles.cardTitle,
                isDark ? styles.darkText : styles.lightText,
              ]}
              numberOfLines={1}
            >
              {item.title}
            </Text>
            <View
              style={[
                styles.statusBadge,
                isPending
                  ? isDark
                    ? styles.badgePendingDark
                    : styles.badgePendingLight
                  : isDark
                    ? styles.badgePublishedDark
                    : styles.badgePublishedLight,
              ]}
            >
              <Text
                style={[
                  styles.statusBadgeText,
                  isPending
                    ? isDark
                      ? styles.textPendingDark
                      : styles.textPendingLight
                    : isDark
                      ? styles.textPublishedDark
                      : styles.textPublishedLight,
                ]}
              >
                {label}
              </Text>
            </View>
          </View>

          {item.targetProgramme ? (
            <View style={styles.programmeContainer}>
              <Text
                style={[
                  styles.programmeText,
                  isDark ? styles.darkProgrammeText : styles.lightProgrammeText,
                ]}
              >
                // {item.targetProgramme}
              </Text>
            </View>
          ) : null}

          <Text
            style={[
              styles.description,
              isDark ? styles.darkSubText : styles.lightSubText,
            ]}
            numberOfLines={2}
          >
            {item.description}
          </Text>

          <View
            style={[
              styles.cardFooterInfo,
              isDark ? styles.darkBorder : styles.lightBorder,
            ]}
          >
            <View style={styles.footerItem}>
              <Ionicons
                name="pulse-outline"
                size={14}
                color={isDark ? "#00E5FF" : "#0284C7"}
              />
              <Text
                style={[
                  styles.dateText,
                  isDark ? styles.darkSubText : styles.lightSubText,
                ]}
              >
                {" "}
                INITIALIZED: {new Date(item.createdAtUtc).toLocaleDateString()}
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={16}
              color={isDark ? "#00FF66" : "#006837"}
            />
          </View>
        </TouchableOpacity>

        {!isClosed && (
          <View
            style={[
              styles.actionRow,
              isDark ? styles.darkBorder : styles.lightBorder,
            ]}
          >
            <TouchableOpacity
              style={[
                styles.closeButton,
                isDark ? styles.darkCloseButton : styles.lightCloseButton,
              ]}
              onPress={() => handleClosePosting(item.id, item.title)}
              disabled={isClosing}
              activeOpacity={0.6}
            >
              {isClosing ? (
                <ActivityIndicator
                  size="small"
                  color={isDark ? "#FF3366" : "#DC2626"}
                />
              ) : (
                <>
                  <Ionicons
                    name="radio-button-off-outline"
                    size={14}
                    color={isDark ? "#FF3366" : "#DC2626"}
                    style={{ marginRight: 6 }}
                  />
                  <Text
                    style={[
                      styles.closeButtonText,
                      isDark
                        ? styles.darkCloseButtonText
                        : styles.lightCloseButtonText,
                    ]}
                  >
                    DISCONNECT NODE
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, isDark ? styles.darkBg : styles.lightBg]}
    >
      <View style={styles.filterContainer}>
        {(["ALL", "ACTIVE", "CLOSED"] as FilterTab[]).map((tab) => {
          const isActive = activeTab === tab;
          return (
            <TouchableOpacity
              key={tab}
              style={[
                styles.filterTab,
                isDark ? styles.filterTabDark : styles.filterTabLight,
                isActive &&
                  (isDark ? styles.activeTabDark : styles.activeTabLight),
              ]}
              onPress={() => setActiveTab(tab)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.filterTabText,
                  isDark ? styles.darkSubText : styles.lightSubText,
                  isActive &&
                    (isDark
                      ? styles.activeTabEditTextDark
                      : styles.activeTabEditTextLight),
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator
            size="large"
            color={isDark ? "#00FF66" : "#006837"}
          />
          <Text
            style={[
              styles.loadingText,
              isDark ? styles.darkText : styles.lightText,
            ]}
          >
            SYNCING NEURAL NETWORK...
          </Text>
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <Ionicons
            name="warning-outline"
            size={40}
            color={isDark ? "#FF3366" : "#DC2626"}
            style={{ marginBottom: 8 }}
          />
          <Text
            style={[
              styles.errorText,
              isDark ? styles.darkText : styles.lightText,
            ]}
          >
            TELEMETRY LINK SEVERED
          </Text>
          <TouchableOpacity
            style={[
              styles.retryButton,
              isDark ? styles.retryButtonDark : styles.retryButtonLight,
            ]}
            onPress={() => refetch()}
          >
            <Text
              style={[
                styles.retryText,
                isDark ? styles.retryTextDark : styles.retryTextLight,
              ]}
            >
              RE-ESTABLISH LINK
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredData}
          keyExtractor={(item, index) => item.id || index.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isFetching && !isLoading}
              onRefresh={refetch}
              tintColor={isDark ? "#00FF66" : "#006837"}
            />
          }
          ListEmptyComponent={
            <View style={styles.centered}>
              <Ionicons
                name="git-network-outline"
                size={40}
                color={isDark ? "#374151" : "#9CA3AF"}
                style={{ marginBottom: 8 }}
              />
              <Text
                style={[
                  styles.emptyText,
                  isDark ? styles.darkSubText : styles.lightSubText,
                ]}
              >
                NO NETWORK NODES MATCHING TELEMETRY FILTER.
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20 },
  lightBg: { backgroundColor: "#F4F6F9" },
  darkBg: { backgroundColor: "#030712" },
  filterContainer: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
    marginBottom: 4,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 6,
    borderWidth: 1,
  },
  filterTabLight: {
    backgroundColor: "#FFFFFF",
    borderColor: "#D1D5DB",
  },
  filterTabDark: {
    backgroundColor: "#111827",
    borderColor: "rgba(156, 163, 175, 0.2)",
  },
  activeTabLight: {
    backgroundColor: "#E6F4EA",
    borderColor: "#006837",
  },
  activeTabDark: {
    backgroundColor: "#111827",
    borderColor: "#00FF66",
  },
  filterTabText: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
  },
  activeTabEditTextLight: {
    color: "#006837",
  },
  activeTabEditTextDark: {
    color: "#00FF66",
  },
  listContainer: {
    paddingBottom: 32,
    paddingTop: 12,
  },
  card: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
  },
  lightCard: { backgroundColor: "#FFFFFF", borderColor: "#E5E7EB" },
  darkCard: { backgroundColor: "#0B0F19", borderColor: "#1F2937" },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "800",
    flex: 1,
    marginRight: 8,
    letterSpacing: 0.5,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  badgePublishedLight: {
    backgroundColor: "#E6F4EA",
  },
  badgePublishedDark: {
    backgroundColor: "rgba(0, 255, 102, 0.15)",
  },
  badgePendingLight: {
    backgroundColor: "#E0F2FE",
  },
  badgePendingDark: {
    backgroundColor: "rgba(0, 229, 255, 0.15)",
  },
  statusBadgeText: {
    fontSize: 9,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  textPublishedLight: {
    color: "#006837",
  },
  textPublishedDark: {
    color: "#00FF66",
  },
  textPendingLight: {
    color: "#0369A1",
  },
  textPendingDark: {
    color: "#00E5FF",
  },
  programmeContainer: {
    marginBottom: 6,
  },
  programmeText: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.5,
    fontFamily: "monospace",
  },
  lightProgrammeText: {
    color: "#0284C7",
  },
  darkProgrammeText: {
    color: "#00E5FF",
  },
  description: {
    fontSize: 12,
    marginBottom: 12,
    lineHeight: 18,
  },
  cardFooterInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    paddingTop: 8,
  },
  lightBorder: {
    borderTopColor: "#E5E7EB",
  },
  darkBorder: {
    borderTopColor: "rgba(156, 163, 175, 0.15)",
  },
  footerItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateText: {
    fontSize: 10,
    fontFamily: "monospace",
    letterSpacing: 0.5,
  },
  actionRow: {
    marginTop: 12,
    borderTopWidth: 1,
    paddingTop: 10,
    alignItems: "flex-end",
  },
  closeButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 4,
    borderWidth: 1,
  },
  lightCloseButton: {
    backgroundColor: "#FEF2F2",
    borderColor: "#FCA5A5",
  },
  darkCloseButton: {
    backgroundColor: "rgba(255, 51, 102, 0.1)",
    borderColor: "rgba(255, 51, 102, 0.3)",
  },
  closeButtonText: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
  },
  lightCloseButtonText: {
    color: "#DC2626",
  },
  darkCloseButtonText: {
    color: "#FF3366",
  },
  lightText: { color: "#111827" },
  darkText: { color: "#F9FAFB" },
  lightSubText: { color: "#4B5563" },
  darkSubText: { color: "#9CA3AF" },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 2,
  },
  errorText: {
    fontSize: 14,
    fontWeight: "800",
    marginBottom: 12,
    letterSpacing: 1,
  },
  emptyText: {
    fontSize: 11,
    textAlign: "center",
    paddingHorizontal: 20,
    letterSpacing: 1,
    fontWeight: "700",
  },
  retryButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  retryButtonLight: {
    borderColor: "#006837",
    backgroundColor: "#E6F4EA",
  },
  retryButtonDark: {
    borderColor: "#00FF66",
  },
  retryText: {
    fontWeight: "800",
    fontSize: 10,
    letterSpacing: 1,
  },
  retryTextLight: {
    color: "#006837",
  },
  retryTextDark: {
    color: "#00FF66",
  },
});
