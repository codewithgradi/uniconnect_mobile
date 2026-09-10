import { useGetMyPostings, useCloseOpportunity } from "@/api/hooks/useOpportunity";
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
      return { label: "Pending", isPending: true };
    }
    if (s === 1 || s === "draft") {
      return { label: "Draft", isPending: true };
    }
    if (s === 4 || s === "closed") {
      return { label: "Closed", isPending: false };
    }
    if (s === 5 || s === "rejected") {
      return { label: "Rejected", isPending: false };
    }
    return { label: "Published", isPending: false };
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
          Alert.alert("Success", "Posting closed successfully.");
        }
      },
      onError: (err: any) => {
        console.log("Mutation failed:", err?.response?.data || err.message);
        setClosingId(null);
        const errorMsg =
          err?.response?.data?.message ||
          "Failed to close the posting. Please try again.";
        if (Platform.OS === "web") {
          window.alert(errorMsg);
        } else {
          Alert.alert("Error", errorMsg);
        }
      },
    });
  };

  const handleClosePosting = (id: string, title: string) => {
    console.log("Close button pressed for opportunity ID:", id);

    if (Platform.OS === "web") {
      // Use standard web confirmation dialog
      const confirmed = window.confirm(
        `Are you sure you want to close "${title}"?`,
      );
      if (confirmed) {
        executeClose(id);
      }
    } else {
      // Use native mobile alert
      Alert.alert(
        "Close Posting",
        `Are you sure you want to close "${title}"?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Close Posting",
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
          onPress={() => router.push(`/buiness/applicants/${item.id}` as any)}
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
              <Text style={styles.programmeText}>{item.targetProgramme}</Text>
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
                name="time-outline"
                size={14}
                color={isDark ? "#9CA3AF" : "#6B7280"}
              />
              <Text
                style={[
                  styles.dateText,
                  isDark ? styles.darkSubText : styles.lightSubText,
                ]}
              >
                {" "}
                Posted: {new Date(item.createdAtUtc).toLocaleDateString()}
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={16}
              color={isDark ? "#4B5563" : "#9CA3AF"}
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
              <ActivityIndicator size="small" color="#EF4444" />
            ) : (
              <>
                <Ionicons
                  name="close-circle-outline"
                  size={16}
                  color="#EF4444"
                  style={{ marginRight: 6 }}
                />
                <Text style={styles.closeButtonText}>Close Posting</Text>
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
          <ActivityIndicator size="large" color="#006837" />
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <Text
            style={[
              styles.errorText,
              isDark ? styles.darkText : styles.lightText,
            ]}
          >
            Failed to load your postings.
          </Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => refetch()}
          >
            <Text style={styles.retryText}>Retry Request</Text>
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
              tintColor="#006837"
            />
          }
          ListEmptyComponent={
            <View style={styles.centered}>
              <Ionicons
                name="folder-open-outline"
                size={40}
                color={isDark ? "#374151" : "#E5E7EB"}
                style={{ marginBottom: 8 }}
              />
              <Text
                style={[
                  styles.emptyText,
                  isDark ? styles.darkSubText : styles.lightSubText,
                ]}
              >
                You have no active opportunity postings.
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
  lightBg: { backgroundColor: "#FFFFFF" },
  darkBg: { backgroundColor: "#111827" },
  listContainer: {
    paddingBottom: 32,
  },
  card: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  lightCard: { backgroundColor: "#F9FAFB", borderColor: "#E5E7EB" },
  darkCard: { backgroundColor: "#1F2937", borderColor: "#374151" },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "800",
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgePublished: {
    backgroundColor: "#00683722",
  },
  badgePending: {
    backgroundColor: "#D9770622",
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  textPublished: {
    color: "#006837",
  },
  textPending: {
    color: "#D97706",
  },
  programmeContainer: {
    marginBottom: 6,
  },
  programmeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#006837",
  },
  description: {
    fontSize: 13,
    marginBottom: 12,
    lineHeight: 18,
  },
  cardFooterInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB22",
    paddingTop: 8,
  },
  footerItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateText: {
    fontSize: 12,
  },
  actionRow: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB22",
    paddingTop: 10,
    alignItems: "flex-end",
  },
  closeButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#EF444433",
  },
  lightCloseButton: {
    backgroundColor: "#FEF2F2",
  },
  darkCloseButton: {
    backgroundColor: "#7F1D1D22",
  },
  closeButtonText: {
    color: "#EF4444",
    fontSize: 12,
    fontWeight: "700",
  },
  lightText: { color: "#111827" },
  darkText: { color: "#FFFFFF" },
  lightSubText: { color: "#6B7280" },
  darkSubText: { color: "#9CA3AF" },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  errorText: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 13,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  retryButton: {
    backgroundColor: "#006837",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  retryText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
});
