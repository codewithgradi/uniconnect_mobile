import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  Linking,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";

export interface BusinessProfileDto {
  Id: string;
  CompanyName: string;
  Industry: string;
  WebsiteUrl: string;
}

const MOCK_PROFILE: BusinessProfileDto = {
  Id: "e8a719d3-3891-4e42-b054-61b6c0e81f18",
  CompanyName: "TechCorp Solutions",
  Industry: "Information Technology & Software",
  WebsiteUrl: "https://techcorp.example.com",
};

export default function BusinessProfileScreen() {
  const isDark = useColorScheme() === "dark";
  const profile = MOCK_PROFILE;

  const handleOpenWebsite = () => {
    if (profile.WebsiteUrl) {
      Linking.openURL(profile.WebsiteUrl);
    }
  };

  return (
    <ScrollView
      style={[styles.container, isDark ? styles.darkBg : styles.lightBg]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header Profile Card */}
      <View style={styles.header}>
        <View style={styles.companyBadge}>
          <Ionicons name="business" size={32} color="#006837" />
        </View>
        <Text
          style={[
            styles.companyName,
            isDark ? styles.darkText : styles.lightText,
          ]}
        >
          {profile.CompanyName}
        </Text>
        <Text style={styles.industryText}>{profile.Industry}</Text>
      </View>

      {/* Account Info Details */}
      <Text style={styles.sectionTitle}>Company Information</Text>
      <View
        style={[styles.infoCard, isDark ? styles.darkCard : styles.lightCard]}
      >
        <View style={styles.infoRow}>
          <View style={styles.rowLeft}>
            <Ionicons name="briefcase-outline" size={18} color="#006837" />
            <Text style={styles.infoLabel}>Industry</Text>
          </View>
          <Text
            style={[
              styles.infoVal,
              isDark ? styles.darkText : styles.lightText,
            ]}
          >
            {profile.Industry}
          </Text>
        </View>

        <View style={styles.divider} />

        <TouchableOpacity style={styles.infoRow} onPress={handleOpenWebsite}>
          <View style={styles.rowLeft}>
            <Ionicons name="globe-outline" size={18} color="#006837" />
            <Text style={styles.infoLabel}>Website</Text>
          </View>
          <Text style={styles.linkText}>
            {profile.WebsiteUrl.replace("https://", "")}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Account Options */}
      <Text style={styles.sectionTitle}>Account Actions</Text>
      <View
        style={[styles.infoCard, isDark ? styles.darkCard : styles.lightCard]}
      >
        <TouchableOpacity
          style={styles.actionRow}
          onPress={() => router.push("/business/edit-profile")}
        >
          <Text
            style={[
              styles.actionText,
              isDark ? styles.darkText : styles.lightText,
            ]}
          >
            Edit Company Profile
          </Text>
          <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity style={styles.actionRow}>
          <Text style={{ color: "#DC2626", fontSize: 15, fontWeight: "600" }}>
            Log Out
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20 },
  lightBg: { backgroundColor: "#FFFFFF" },
  darkBg: { backgroundColor: "#111827" },
  header: { alignItems: "center", marginVertical: 24 },
  companyBadge: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: "#E6F0EB",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  companyName: { fontSize: 20, fontWeight: "800" },
  industryText: { fontSize: 13, color: "#6B7280", marginTop: 4 },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#9CA3AF",
    textTransform: "uppercase",
    marginTop: 16,
    marginBottom: 10,
  },
  infoCard: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
  },
  rowLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  infoLabel: { fontSize: 14, color: "#6B7280", fontWeight: "500" },
  infoVal: { fontSize: 14, fontWeight: "600" },
  linkText: { fontSize: 14, color: "#006837", fontWeight: "600" },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
  },
  actionText: { fontSize: 15, fontWeight: "500" },
  divider: { height: 1, backgroundColor: "#E5E7EB33" },
  lightCard: { backgroundColor: "#F9FAFB", borderColor: "#E5E7EB" },
  darkCard: { backgroundColor: "#1F2937", borderColor: "#374151" },
  lightText: { color: "#111827" },
  darkText: { color: "#FFFFFF" },
});
