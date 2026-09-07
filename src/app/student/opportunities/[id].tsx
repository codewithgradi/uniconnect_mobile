import { opportunitiesApi, opportunityKeys } from "@/api/opportunity.api"; // Adjust path to your api file if needed
import Ionicons from "@expo/vector-icons/Ionicons";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function StudentOpportunityDetailScreen() {
  const isDark = useColorScheme() === "dark";
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const {
    data: opportunity,
    isLoading,
    isError,
  } = useQuery({
    queryKey: opportunityKeys.detail(id || ""),
    queryFn: () => opportunitiesApi.getById(id!),
    enabled: !!id,
  });

  const handleApply = () => {
    if (!opportunity) return;
    Alert.alert(
      "Application Sent",
      `Your profile and CV have been submitted for ${opportunity.title}.`,
      [{ text: "OK", onPress: () => router.back() }],
    );
  };

  const handleCancel = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <View
        style={[
          styles.container,
          isDark ? styles.darkBg : styles.lightBg,
          styles.centered,
        ]}
      >
        <ActivityIndicator size="large" color="#006837" />
      </View>
    );
  }

  if (isError || !opportunity) {
    return (
      <View
        style={[
          styles.container,
          isDark ? styles.darkBg : styles.lightBg,
          styles.centered,
        ]}
      >
        <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
        <Text
          style={[
            styles.errorText,
            isDark ? styles.darkText : styles.lightText,
          ]}
        >
          Failed to load opportunity details.
        </Text>
        <TouchableOpacity style={styles.applyBtn} onPress={() => router.back()}>
          <Text style={styles.applyBtnText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

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
          >
            {opportunity.title}
          </Text>

          <View style={styles.metaRow}>
            {opportunity.targetProgramme ? (
              <View style={styles.typeBadge}>
                <Text style={styles.typeBadgeText}>
                  {opportunity.targetProgramme}
                </Text>
              </View>
            ) : null}
            <Text style={styles.metaText}>
              Posted {new Date(opportunity.createdAtUtc).toLocaleDateString()}
            </Text>
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

        {/* Status / Metadata Card */}
        <View
          style={[styles.card, isDark ? styles.darkCard : styles.lightCard]}
        >
          <View style={styles.businessHeader}>
            <Text style={styles.sectionBadge}>STATUS INFO</Text>
            <View style={styles.statusChip}>
              <Text style={styles.statusChipText}>{opportunity.status}</Text>
            </View>
          </View>
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Ionicons name="business-outline" size={16} color="#6B7280" />
              <Text style={styles.infoLabel}>
                Business Profile ID: {opportunity.businessProfileId}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Floating Student Action Bar */}
      <View
        style={[
          styles.actionBar,
          isDark ? styles.darkBar : styles.lightBar,
          { paddingBottom: Math.max(insets.bottom, 16) },
        ]}
      >
        <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
          <Text style={styles.cancelBtnText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.applyBtn} onPress={handleApply}>
          <Text style={styles.applyBtnText}>Apply Now</Text>
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
  card: { padding: 16, borderRadius: 12, borderWidth: 1, marginBottom: 16 },
  sectionBadge: {
    fontSize: 10,
    fontWeight: "800",
    color: "#006837",
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  title: { fontSize: 20, fontWeight: "800" },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 6 },
  typeBadge: {
    backgroundColor: "#E0F2FE",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  typeBadgeText: { color: "#0284C7", fontSize: 11, fontWeight: "700" },
  metaText: { fontSize: 12, color: "#6B7280" },
  subHeading: {
    fontSize: 14,
    fontWeight: "700",
    marginTop: 16,
    marginBottom: 6,
  },
  bodyText: { fontSize: 13, color: "#6B7280", lineHeight: 18 },
  businessHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusChip: {
    backgroundColor: "#D1FAE5",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  statusChipText: { fontSize: 10, fontWeight: "800", color: "#065F46" },
  infoGrid: { gap: 10, marginTop: 8 },
  infoItem: { flexDirection: "row", alignItems: "center", gap: 8 },
  infoLabel: { fontSize: 12, color: "#6B7280" },
  errorText: {
    fontSize: 14,
    fontWeight: "600",
    marginVertical: 12,
    textAlign: "center",
  },
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
  cancelBtn: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelBtnText: { color: "#374151", fontWeight: "700", fontSize: 13 },
  applyBtn: {
    flex: 1,
    backgroundColor: "#006837",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  applyBtnText: { color: "#FFFFFF", fontWeight: "700", fontSize: 13 },
  lightCard: { backgroundColor: "#F9FAFB", borderColor: "#E5E7EB" },
  darkCard: { backgroundColor: "#1F2937", borderColor: "#374151" },
  lightText: { color: "#111827" },
  darkText: { color: "#FFFFFF" },
});
