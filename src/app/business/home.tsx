import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useMyProfile } from "@/api/hooks/useProfile"; // Adjust path if needed

export default function BusinessDashboardScreen() {
  const isDark = useColorScheme() === "dark";
  const router = useRouter();

  // Fetching business/user profile data using useMyProfile hook
  const { data: profile, isLoading, error } = useMyProfile();

  if (isLoading) {
    return (
      <View
        style={[
          styles.centerContainer,
          isDark ? styles.darkBg : styles.lightBg,
        ]}
      >
        <ActivityIndicator size="large" color="#006837" />
      </View>
    );
  }

  const companyName =
    profile?.firstName || profile?.headline || "Your Business";

  return (
    <ScrollView
      style={[styles.container, isDark ? styles.darkBg : styles.lightBg]}
      showsVerticalScrollIndicator={false}
    >
      {/* Welcoming Hero Greeting Banner */}
      <View style={styles.welcomeContainer}>
        <Text
          style={[
            styles.welcomeSubTitle,
            isDark ? styles.darkSubText : styles.lightSubText,
          ]}
        >
          Welcome back,
        </Text>
        <Text
          style={[
            styles.welcomeTitle,
            isDark ? styles.darkText : styles.lightText,
          ]}
        >
          {companyName} 👋
        </Text>
        <Text style={styles.welcomeDescription}>
          Manage your job listings and discover top tech talent ready to join
          your team.
        </Text>
      </View>

      {/* Company Header Card */}
      <TouchableOpacity
        style={[styles.headerCard, isDark ? styles.darkCard : styles.lightCard]}
        activeOpacity={0.7}
      >
        <View style={styles.companyBadge}>
          <Ionicons name="business" size={24} color="#006837" />
        </View>
        <View style={styles.headerInfo}>
          <Text
            style={[
              styles.companyTitle,
              isDark ? styles.darkText : styles.lightText,
            ]}
            numberOfLines={1}
          >
            {companyName}
          </Text>
        </View>
        <View style={styles.statusBadge}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>Active</Text>
        </View>
      </TouchableOpacity>

      {/* Quick Actions List */}
      <Text style={styles.sectionHeader}>Quick Actions</Text>
      <View
        style={[
          styles.actionListCard,
          isDark ? styles.darkCard : styles.lightCard,
        ]}
      >
        <TouchableOpacity
          style={styles.actionRow}
          onPress={() => router.push("/business/post-opportunity")}
        >
          <View style={styles.rowLeft}>
            <View style={styles.actionIconContainer}>
              <Ionicons name="add" size={18} color="#006837" />
            </View>
            <View>
              <Text
                style={[
                  styles.rowText,
                  isDark ? styles.darkText : styles.lightText,
                ]}
              >
                Post New Opportunity
              </Text>
              <Text style={styles.rowSubText}>
                Create a new internship or job listing
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
        </TouchableOpacity>

        <View
          style={[
            styles.divider,
            isDark ? styles.darkDivider : styles.lightDivider,
          ]}
        />

        <TouchableOpacity
          style={styles.actionRow}
          onPress={() => router.push("/business/applicants")}
        >
          <View style={styles.rowLeft}>
            <View style={styles.actionIconContainer}>
              <Ionicons name="people" size={18} color="#006837" />
            </View>
            <View>
              <Text
                style={[
                  styles.rowText,
                  isDark ? styles.darkText : styles.lightText,
                ]}
              >
                View Applicants
              </Text>
              <Text style={styles.rowSubText}>
                Review and shortlist candidates
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
        </TouchableOpacity>
      </View>

      {/* Platform Highlight Banner */}
      <View
        style={[
          styles.highlightCard,
          isDark ? styles.darkHighlightCard : styles.lightHighlightCard,
        ]}
      >
        <Ionicons
          name="sparkles"
          size={22}
          color="#006837"
          style={{ marginBottom: 8 }}
        />
        <Text
          style={[
            styles.highlightTitle,
            isDark ? styles.darkText : styles.lightText,
          ]}
        >
          Find Specialized Tech Talent
        </Text>
        <Text style={styles.highlightDesc}>
          Connect directly with verified students and professionals skilled in
          .NET, React, Flutter, and Modern Cloud Architecture.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20 },
  centerContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  lightBg: { backgroundColor: "#FFFFFF" },
  darkBg: { backgroundColor: "#111827" },
  welcomeContainer: {
    marginTop: 24,
    marginBottom: 20,
  },
  welcomeSubTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6B7280",
  },
  lightSubText: { color: "#6B7280" },
  darkSubText: { color: "#9CA3AF" },
  welcomeTitle: {
    fontSize: 26,
    fontWeight: "800",
    marginTop: 2,
    letterSpacing: -0.5,
  },
  welcomeDescription: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 6,
    lineHeight: 20,
  },
  headerCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 24,
  },
  companyBadge: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: "#E6F0EB",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  headerInfo: { flex: 1 },
  companyTitle: { fontSize: 17, fontWeight: "700" },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E6F0EB",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#006837",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#006837",
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: "700",
    color: "#9CA3AF",
    textTransform: "uppercase",
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  actionListCard: {
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
  },
  rowLeft: { flexDirection: "row", alignItems: "center", gap: 14, flex: 1 },
  actionIconContainer: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: "#E6F0EB",
    justifyContent: "center",
    alignItems: "center",
  },
  rowText: { fontSize: 15, fontWeight: "600" },
  rowSubText: { fontSize: 12, color: "#6B7280", marginTop: 1 },
  divider: { height: 1 },
  lightDivider: { backgroundColor: "#F3F4F6" },
  darkDivider: { backgroundColor: "#374151" },
  highlightCard: {
    padding: 20,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 40,
  },
  lightHighlightCard: { backgroundColor: "#F9FAFB", borderColor: "#E5E7EB" },
  darkHighlightCard: { backgroundColor: "#1F2937", borderColor: "#374151" },
  highlightTitle: { fontSize: 16, fontWeight: "700", marginBottom: 6 },
  highlightDesc: { fontSize: 13, color: "#6B7280", lineHeight: 18 },
  lightCard: { backgroundColor: "#F9FAFB", borderColor: "#E5E7EB" },
  darkCard: { backgroundColor: "#1F2937", borderColor: "#374151" },
  lightText: { color: "#111827" },
  darkText: { color: "#FFFFFF" },
});
