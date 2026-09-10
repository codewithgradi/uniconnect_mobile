import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  useApproveOpportunity,
  useRejectOpportunity,
  useOpportunityById,
} from "@/api/hooks/useOpportunity";

export default function OpportunityVerificationDetailScreen() {
  const isDark = useColorScheme() === "dark";
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { data: opportunity, isLoading, isError } = useOpportunityById(id);
  const approveMutation = useApproveOpportunity();
  const rejectMutation = useRejectOpportunity();

  const handleApprove = () => {
    if (!id) return;
    approveMutation.mutate(id, {
      onSuccess: () => {
        Alert.alert(
          "Opportunity Approved",
          `${opportunity?.title || "Opportunity"} is now published live.`,
          [{ text: "OK", onPress: () => router.back() }],
        );
      },
      onError: (error: any) => {
        Alert.alert(
          "Error",
          error?.message || "Failed to approve opportunity.",
        );
      },
    });
  };

  const handleReject = () => {
    if (!id) return;
    rejectMutation.mutate(id, {
      onSuccess: () => {
        Alert.alert(
          "Opportunity Rejected",
          `${opportunity?.title || "Opportunity"} request rejected.`,
          [{ text: "OK", onPress: () => router.back() }],
        );
      },
      onError: (error: any) => {
        Alert.alert("Error", error?.message || "Failed to reject opportunity.");
      },
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
          Loading opportunity details...
        </Text>
      </View>
    );
  }

  if (isError || !opportunity) {
    return (
      <View
        style={[
          styles.container,
          styles.centered,
          isDark ? styles.darkBg : styles.lightBg,
        ]}
      >
        <Ionicons name="alert-circle-outline" size={48} color="#DC2626" />
        <Text
          style={[
            styles.errorTitle,
            isDark ? styles.darkText : styles.lightText,
          ]}
        >
          Failed to load details
        </Text>
        <Text style={styles.errorSub}>
          Could not fetch the requested opportunity information.
        </Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const isMutating = approveMutation.isPending || rejectMutation.isPending;

  return (
    <View style={[styles.container, isDark ? styles.darkBg : styles.lightBg]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: 120 + insets.bottom },
        ]}
      >
        {/* Opportunity Card */}
        <View
          style={[styles.card, isDark ? styles.darkCard : styles.lightCard]}
        >
          <Text style={styles.sectionBadge}>OPPORTUNITY DETAILS</Text>
          <Text
            style={[styles.title, isDark ? styles.darkText : styles.lightText]}
            numberOfLines={2}
          >
            {opportunity.title}
          </Text>

          <View style={styles.metaRow}>
            {opportunity.targetProgramme && (
              <View style={styles.typeBadge}>
                <Text style={styles.typeBadgeText} numberOfLines={1}>
                  {opportunity.targetProgramme}
                </Text>
              </View>
            )}
            <View style={styles.metaInfo}>
              <Ionicons name="time-outline" size={12} color="#6B7280" />
              <Text style={styles.metaText} numberOfLines={1}>
                Submitted {opportunity.createdAtUtc}
              </Text>
            </View>
          </View>

          <Text
            style={[
              styles.subHeading,
              isDark ? styles.darkText : styles.lightText,
            ]}
          >
            Description
          </Text>
          <Text style={styles.bodyText}>{opportunity.description}</Text>
        </View>

        {/* Status Card */}
        <View
          style={[styles.card, isDark ? styles.darkCard : styles.lightCard]}
        >
          <View style={styles.businessHeader}>
            <Text style={styles.sectionBadge}>STATUS & SUBMISSION</Text>
            <View
              style={[
                styles.statusChip,
                {
                  backgroundColor:
                    opportunity.status === "Published"
                      ? "#D1FAE5"
                      : opportunity.status === "PendingApproval"
                        ? "#FEF3C7"
                        : "#FEE2E2",
                },
              ]}
            >
              <Text
                style={[
                  styles.statusChipText,
                  {
                    color:
                      opportunity.status === "Published"
                        ? "#065F46"
                        : opportunity.status === "PendingApproval"
                          ? "#92400E"
                          : "#DC2626",
                  },
                ]}
                numberOfLines={1}
              >
                {opportunity.status}
              </Text>
            </View>
          </View>

          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Ionicons name="business-outline" size={16} color="#6B7280" />
              <Text style={styles.infoLabel} numberOfLines={1}>
                Business ID: {opportunity.businessProfileId}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Floating Action Bar */}
      <View
        style={[
          styles.actionBar,
          isDark ? styles.darkBar : styles.lightBar,
          { paddingBottom: Math.max(insets.bottom, 16) },
        ]}
      >
        <TouchableOpacity
          style={[styles.rejectBtn, isMutating && { opacity: 0.6 }]}
          onPress={handleReject}
          disabled={isMutating}
        >
          {rejectMutation.isPending ? (
            <ActivityIndicator size="small" color="#DC2626" />
          ) : (
            <Text style={styles.rejectBtnText} numberOfLines={1}>
              Reject Request
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.approveBtn, isMutating && { opacity: 0.6 }]}
          onPress={handleApprove}
          disabled={isMutating}
        >
          {approveMutation.isPending ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.approveBtnText} numberOfLines={1}>
              Approve Request
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { justifyContent: "center", alignItems: "center", padding: 20 },
  scrollContent: { padding: 20 },
  lightBg: { backgroundColor: "#FFFFFF" },
  darkBg: { backgroundColor: "#111827" },
  card: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
    overflow: "hidden",
  },
  sectionBadge: {
    fontSize: 10,
    fontWeight: "800",
    color: "#006837",
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  title: { fontSize: 20, fontWeight: "800" },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
    flexWrap: "wrap",
  },
  typeBadge: {
    backgroundColor: "#E0F2FE",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    flexShrink: 1,
  },
  typeBadgeText: { color: "#0284C7", fontSize: 11, fontWeight: "700" },
  metaInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    flexShrink: 1,
  },
  metaText: { fontSize: 12, color: "#6B7280" },
  subHeading: {
    fontSize: 14,
    fontWeight: "700",
    marginTop: 16,
    marginBottom: 6,
  },
  bodyText: { fontSize: 13, color: "#6B7280", lineHeight: 20 },
  businessHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusChip: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    flexShrink: 0,
  },
  statusChipText: { fontSize: 10, fontWeight: "800" },
  infoGrid: { gap: 10, marginTop: 12 },
  infoItem: { flexDirection: "row", alignItems: "center", gap: 8 },
  infoLabel: { fontSize: 12, color: "#6B7280", flex: 1 },
  actionBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  lightBar: { backgroundColor: "#FFFFFF", borderTopColor: "#E5E7EB" },
  darkBar: { backgroundColor: "#111827", borderTopColor: "#374151" },
  rejectBtn: {
    flex: 1,
    backgroundColor: "#FEE2E2",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  rejectBtnText: { color: "#DC2626", fontWeight: "700", fontSize: 13 },
  approveBtn: {
    flex: 1,
    backgroundColor: "#006837",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  approveBtnText: { color: "#FFFFFF", fontWeight: "700", fontSize: 13 },
  loadingText: { marginTop: 12, fontSize: 13, fontWeight: "600" },
  errorTitle: { fontSize: 16, fontWeight: "700", marginTop: 12 },
  errorSub: {
    fontSize: 12,
    color: "#9CA3AF",
    textAlign: "center",
    marginTop: 4,
  },
  backButton: {
    marginTop: 16,
    backgroundColor: "#006837",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  backButtonText: { color: "#FFFFFF", fontWeight: "700", fontSize: 12 },
  lightCard: { backgroundColor: "#F9FAFB", borderColor: "#E5E7EB" },
  darkCard: { backgroundColor: "#1F2937", borderColor: "#374151" },
  lightText: { color: "#111827" },
  darkText: { color: "#FFFFFF" },
});
