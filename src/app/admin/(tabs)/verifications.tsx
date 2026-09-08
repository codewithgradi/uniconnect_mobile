import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  useColorScheme,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  useRejectOpportunity,
  usePendingOpportunities,
  useApproveOpportunity,
} from "@/api/hooks/useOpportunity";

export default function VerificationsScreen() {
  const isDark = useColorScheme() === "dark";
  const router = useRouter();

  const {
    data: pendingOpportunities = [],
    isLoading,
    isError,
  } = usePendingOpportunities();
  const approveOpportunity = useApproveOpportunity();
  const rejectOpportunity = useRejectOpportunity();

  const handleCardPress = (id: string) => {
    router.push({
      pathname: "/admin/verifications/[id]",
      params: { id },
    });
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
          Loading verification queue...
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, isDark ? styles.darkBg : styles.lightBg]}>
      {/* Header Info */}
      <View style={styles.headerBox}>
        <Text
          style={[
            styles.headerTitle,
            isDark ? styles.darkText : styles.lightText,
          ]}
        >
          Pending Opportunities ({pendingOpportunities.length})
        </Text>
        <Text style={styles.headerSub}>
          Review and verify business job postings before publishing.
        </Text>
      </View>

      {/* Verification Queue List */}
      <FlatList
        data={pendingOpportunities}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.card, isDark ? styles.darkCard : styles.lightCard]}
            onPress={() => handleCardPress(item.id)}
          >
            <View style={styles.cardHeader}>
              <View style={styles.companyIcon}>
                <Ionicons name="briefcase-outline" size={18} color="#006837" />
              </View>
              <View style={styles.titleArea}>
                <Text
                  style={[
                    styles.jobTitle,
                    isDark ? styles.darkText : styles.lightText,
                  ]}
                >
                  {item.title}
                </Text>
                <Text style={styles.companyName}>{item.status}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
            </View>

            <View style={styles.detailsRow}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{item.targetProgramme}</Text>
              </View>
              <View style={styles.metaInfo}>
                <Ionicons name="location-outline" size={12} color="#6B7280" />
                <Text style={styles.metaText}>{item.description}</Text>
              </View>
            </View>

            <View style={styles.footerRow}>
              <Text style={styles.timeText}>Submitted {item.createdAtUtc}</Text>
              <View style={styles.actionGroup}>
                <TouchableOpacity
                  style={styles.rejectBtn}
                  onPress={(e) => {
                    e.stopPropagation();
                    rejectOpportunity.mutate(item.id);
                  }}
                  disabled={rejectOpportunity.isPending}
                >
                  <Text style={styles.rejectBtnText}>
                    {rejectOpportunity.isPending ? "Rejecting..." : "Reject"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.approveBtn}
                  onPress={(e) => {
                    e.stopPropagation();
                    approveOpportunity.mutate(item.id);
                  }}
                  disabled={approveOpportunity.isPending}
                >
                  <Text style={styles.approveBtnText}>
                    {approveOpportunity.isPending ? "Approving..." : "Approve"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons
              name="checkmark-done-circle-outline"
              size={48}
              color="#006837"
            />
            <Text
              style={[
                styles.emptyTitle,
                isDark ? styles.darkText : styles.lightText,
              ]}
            >
              All Caught Up!
            </Text>
            <Text style={styles.emptySub}>
              There are no pending business opportunity submissions to review.
            </Text>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 16 },
  centered: { justifyContent: "center", alignItems: "center" },
  lightBg: { backgroundColor: "#FFFFFF" },
  darkBg: { backgroundColor: "#111827" },
  headerBox: { marginBottom: 16 },
  headerTitle: { fontSize: 18, fontWeight: "800" },
  headerSub: { fontSize: 12, color: "#6B7280", marginTop: 2 },
  loadingText: { marginTop: 12, fontSize: 13, fontWeight: "600" },
  card: { padding: 14, borderRadius: 12, borderWidth: 1, marginBottom: 12 },
  cardHeader: { flexDirection: "row", alignItems: "center", gap: 12 },
  companyIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#E6F0EB",
    justifyContent: "center",
    alignItems: "center",
  },
  titleArea: { flex: 1 },
  jobTitle: { fontSize: 15, fontWeight: "700" },
  companyName: { fontSize: 12, color: "#6B7280", marginTop: 1 },
  detailsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 12,
  },
  badge: {
    backgroundColor: "#E0F2FE",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeText: { fontSize: 11, fontWeight: "700", color: "#0284C7" },
  metaInfo: { flexDirection: "row", alignItems: "center", gap: 4 },
  metaText: { fontSize: 11, color: "#6B7280" },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 14,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  timeText: { fontSize: 11, color: "#9CA3AF" },
  actionGroup: { flexDirection: "row", gap: 8 },
  approveBtn: {
    backgroundColor: "#006837",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
  },
  approveBtnText: { color: "#FFFFFF", fontSize: 12, fontWeight: "700" },
  rejectBtn: {
    backgroundColor: "#FEE2E2",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
  },
  rejectBtnText: { color: "#DC2626", fontSize: 12, fontWeight: "700" },
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
