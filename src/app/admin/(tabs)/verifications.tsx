import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

export interface OpportunityVerificationDto {
  id: string;
  title: string;
  companyName: string;
  jobType: string;
  location: string;
  createdAt: string;
}

const MOCK_PENDING_OPPORTUNITIES: OpportunityVerificationDto[] = [
  {
    id: "1",
    title: "Flutter Developer Intern",
    companyName: "TechCorp Solutions",
    jobType: "Internship",
    location: "Cape Town, South Africa",
    createdAt: "2 hours ago",
  },
  {
    id: "2",
    title: "Junior Frontend Developer",
    companyName: "CreativeTech",
    jobType: "Full-time",
    location: "Johannesburg, South Africa",
    createdAt: "5 hours ago",
  },
  {
    id: "3",
    title: "Data Science Intern",
    companyName: "DataNova",
    jobType: "Internship",
    location: "Pretoria, South Africa",
    createdAt: "1 day ago",
  },
];

export default function VerificationsScreen() {
  const isDark = useColorScheme() === "dark";
  const router = useRouter();
  const [pendingItems, setPendingItems] = useState<
    OpportunityVerificationDto[]
  >(MOCK_PENDING_OPPORTUNITIES);

  const handleApprove = (id: string) => {
    setPendingItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleReject = (id: string) => {
    setPendingItems((prev) => prev.filter((item) => item.id !== id));
  };

 const handleCardPress = (id: string) => {
   router.push({
     pathname: "/admin/verifications/[id]",
     params: { id },
   });
 };

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
          Pending Opportunities ({pendingItems.length})
        </Text>
        <Text style={styles.headerSub}>
          Review and verify business job postings before publishing.
        </Text>
      </View>

      {/* Verification Queue List */}
      <FlatList
        data={pendingItems}
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
                <Text style={styles.companyName}>{item.companyName}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
            </View>

            <View style={styles.detailsRow}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{item.jobType}</Text>
              </View>
              <View style={styles.metaInfo}>
                <Ionicons name="location-outline" size={12} color="#6B7280" />
                <Text style={styles.metaText}>{item.location}</Text>
              </View>
            </View>

            <View style={styles.footerRow}>
              <Text style={styles.timeText}>Submitted {item.createdAt}</Text>
              <View style={styles.actionGroup}>
                <TouchableOpacity
                  style={styles.rejectBtn}
                  onPress={(e) => {
                    e.stopPropagation();
                    handleReject(item.id);
                  }}
                >
                  <Text style={styles.rejectBtnText}>Reject</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.approveBtn}
                  onPress={(e) => {
                    e.stopPropagation();
                    handleApprove(item.id);
                  }}
                >
                  <Text style={styles.approveBtnText}>Approve</Text>
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
  lightBg: { backgroundColor: "#FFFFFF" },
  darkBg: { backgroundColor: "#111827" },
  headerBox: { marginBottom: 16 },
  headerTitle: { fontSize: 18, fontWeight: "800" },
  headerSub: { fontSize: 12, color: "#6B7280", marginTop: 2 },
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
