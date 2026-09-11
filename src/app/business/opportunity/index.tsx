import {
  useGetMyPostings,
  useCloseOpportunity,
} from "@/api/hooks/useOpportunity";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
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

  const getStatusInfo = (status: string | number | undefined) => {
    const s = typeof status === "string" ? status.toLowerCase() : status;

    if (s === 2 || s === "pendingapproval" || s === "pending") {
      return { label: "PENDING_SYNC", isPending: true };
    }
    if (s === 1 || s === "draft") {
      return { label: "STAGED_DRAFT", isPending: true };
    }
    if (s === 4 || s === "closed") {
      return { label: "OFFLINE", isPending: false };
    }
    if (s === 5 || s === "rejected") {
      return { label: "TERMINATED", isPending: false };
    }
    return { label: "ONLINE", isPending: false };
  };

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
    const { label, isPending } = getStatusInfo(item.status);
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
                isPending ? styles.badgePending : styles.badgePublished,
              ]}
            >
              <Text
                style={[
                  styles.statusBadgeText,
                  isPending ? styles.textPending : styles.textPublished,
                ]}
              >
                {label}
              </Text>
            </View>
          </View>

          {item.targetProgramme ? (
            <View style={styles.programmeContainer}>
              <Text style={styles.programmeText}>
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

          <View style={styles.cardFooterInfo}>
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

        <View style={styles.actionRow}>
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
              <ActivityIndicator size="small" color="#FF3366" />
            ) : (
              <>
                <Ionicons
                  name="radio-button-off-outline"
                  size={14}
                  color="#FF3366"
                  style={{ marginRight: 6 }}
                />
                <Text style={styles.closeButtonText}>DISCONNECT NODE</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, isDark ? styles.darkBg : styles.lightBg]}
    >
      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#00FF66" />
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
            color="#FF3366"
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
            style={styles.retryButton}
            onPress={() => refetch()}
          >
            <Text style={styles.retryText}>RE-ESTABLISH LINK</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={currentData}
          keyExtractor={(item, index) => item.id || index.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isFetching && !isLoading}
              onRefresh={refetch}
              tintColor="#00FF66"
            />
          }
          ListEmptyComponent={
            <View style={styles.centered}>
              <Ionicons
                name="git-network-outline"
                size={40}
                color={isDark ? "#1F2937" : "#E5E7EB"}
                style={{ marginBottom: 8 }}
              />
              <Text
                style={[
                  styles.emptyText,
                  isDark ? styles.darkSubText : styles.lightSubText,
                ]}
              >
                NO ACTIVE NETWORK NODES DETECTED.
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
  badgePublished: {
    backgroundColor: "rgba(0, 255, 102, 0.15)",
  },
  badgePending: {
    backgroundColor: "rgba(0, 229, 255, 0.15)",
  },
  statusBadgeText: {
    fontSize: 9,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  textPublished: {
    color: "#00FF66",
  },
  textPending: {
    color: "#00E5FF",
  },
  programmeContainer: {
    marginBottom: 6,
  },
  programmeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#00E5FF",
    letterSpacing: 0.5,
    fontFamily: "monospace",
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
    borderTopColor: "rgba(156, 163, 175, 0.15)",
    paddingTop: 8,
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
    borderTopColor: "rgba(156, 163, 175, 0.15)",
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
    borderColor: "rgba(255, 51, 102, 0.3)",
  },
  lightCloseButton: {
    backgroundColor: "rgba(255, 51, 102, 0.05)",
  },
  darkCloseButton: {
    backgroundColor: "rgba(255, 51, 102, 0.1)",
  },
  closeButtonText: {
    color: "#FF3366",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
  },
  lightText: { color: "#111827" },
  darkText: { color: "#F9FAFB" },
  lightSubText: { color: "#6B7280" },
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
    color: "#FF3366",
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
    borderColor: "#00FF66",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  retryText: {
    color: "#00FF66",
    fontWeight: "800",
    fontSize: 10,
    letterSpacing: 1,
  },
});
