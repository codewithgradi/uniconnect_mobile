import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function BusinessDashboardScreen() {
  const isDark = useColorScheme() === "dark";
  const router = useRouter();

  return (
    <ScrollView
      style={[styles.container, isDark ? styles.darkBg : styles.lightBg]}
      showsVerticalScrollIndicator={false}
    >
      {/* Company Header Banner */}
      <View
        style={[styles.headerCard, isDark ? styles.darkCard : styles.lightCard]}
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
          >
            TechCorp Solutions
          </Text>
          <Text style={styles.companySub}>Business Account</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
      </View>

      {/* Metrics Grid (2x2) */}
      <View style={styles.statsGrid}>
        <View
          style={[styles.statBox, isDark ? styles.darkCard : styles.lightCard]}
        >
          <Text
            style={[
              styles.statValue,
              isDark ? styles.darkText : styles.lightText,
            ]}
          >
            24
          </Text>
          <Text style={styles.statLabel}>Active Opportunities</Text>
        </View>

        <View
          style={[styles.statBox, isDark ? styles.darkCard : styles.lightCard]}
        >
          <Text
            style={[
              styles.statValue,
              isDark ? styles.darkText : styles.lightText,
            ]}
          >
            156
          </Text>
          <Text style={styles.statLabel}>Total Applicants</Text>
        </View>

        <View
          style={[styles.statBox, isDark ? styles.darkCard : styles.lightCard]}
        >
          <Text
            style={[
              styles.statValue,
              isDark ? styles.darkText : styles.lightText,
            ]}
          >
            12
          </Text>
          <Text style={styles.statLabel}>Interviews</Text>
        </View>

        <View
          style={[styles.statBox, isDark ? styles.darkCard : styles.lightCard]}
        >
          <Text
            style={[
              styles.statValue,
              isDark ? styles.darkText : styles.lightText,
            ]}
          >
            8
          </Text>
          <Text style={styles.statLabel}>Hired</Text>
        </View>
      </View>

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
            <Ionicons name="add-circle-outline" size={20} color="#006837" />
            <Text
              style={[
                styles.rowText,
                isDark ? styles.darkText : styles.lightText,
              ]}
            >
              Post Opportunity
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity
          style={styles.actionRow}
          onPress={() => router.push("/business/applicants")}
        >
          <View style={styles.rowLeft}>
            <Ionicons name="people-outline" size={20} color="#006837" />
            <Text
              style={[
                styles.rowText,
                isDark ? styles.darkText : styles.lightText,
              ]}
            >
              View Applicants
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20 },
  lightBg: { backgroundColor: "#FFFFFF" },
  darkBg: { backgroundColor: "#111827" },
  headerCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 16,
    marginBottom: 20,
  },
  companyBadge: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: "#E6F0EB",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  headerInfo: { flex: 1 },
  companyTitle: { fontSize: 16, fontWeight: "700" },
  companySub: { fontSize: 12, color: "#6B7280" },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 24,
  },
  statBox: {
    width: "48%",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
  },
  statValue: { fontSize: 24, fontWeight: "800", marginBottom: 4 },
  statLabel: { fontSize: 12, color: "#6B7280" },
  sectionHeader: {
    fontSize: 13,
    fontWeight: "700",
    color: "#9CA3AF",
    textTransform: "uppercase",
    marginBottom: 10,
  },
  actionListCard: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
  },
  rowLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  rowText: { fontSize: 15, fontWeight: "500" },
  divider: { height: 1, backgroundColor: "#E5E7EB33" },
  lightCard: { backgroundColor: "#F9FAFB", borderColor: "#E5E7EB" },
  darkCard: { backgroundColor: "#1F2937", borderColor: "#374151" },
  lightText: { color: "#111827" },
  darkText: { color: "#FFFFFF" },
});
