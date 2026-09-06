import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";

export interface StudentOpportunityDetailDto {
  id: string;
  title: string;
  jobType: string;
  location: string;
  salaryRange: string;
  description: string;
  requirements: string[];
  createdAt: string;
  business: {
    id: string;
    companyName: string;
    industry: string;
    website: string;
    email: string;
    verificationStatus: "Verified" | "Pending" | "Unverified";
  };
}

const MOCK_OPPORTUNITIES: Record<string, StudentOpportunityDetailDto> = {
  "1": {
    id: "1",
    title: "Mobile App Developer Intern",
    jobType: "Internship",
    location: "Cape Town, South Africa",
    salaryRange: "R8,000 - R12,000 / month",
    description:
      "Looking for a passionate Flutter & React Native Developer Intern to build cross-platform mobile applications.",
    requirements: [
      "Basic TypeScript or Dart experience",
      "RESTful API integration",
      "Git version control",
      "Team player with learning mindset",
    ],
    createdAt: "Posted 1h ago",
    business: {
      id: "b1",
      companyName: "CodeLabs",
      industry: "Software Development",
      website: "https://codelabs.co.za",
      email: "careers@codelabs.co.za",
      verificationStatus: "Verified",
    },
  },
  "2": {
    id: "2",
    title: "Junior Frontend Developer",
    jobType: "Full-time",
    location: "Johannesburg, South Africa",
    salaryRange: "R20,000 - R28,000 / month",
    description:
      "Join our product team to build responsive interfaces in Next.js, React Native, and Tailwind CSS.",
    requirements: [
      "HTML, CSS, TypeScript",
      "React / Next.js framework fundamentals",
      "RESTful endpoint integration",
    ],
    createdAt: "Posted 3h ago",
    business: {
      id: "b2",
      companyName: "CreativeTech",
      industry: "Digital Agency",
      website: "https://creativetech.dev",
      email: "hr@creativetech.dev",
      verificationStatus: "Verified",
    },
  },
  "3": {
    id: "3",
    title: "Data Science Intern",
    jobType: "Internship",
    location: "Pretoria, South Africa",
    salaryRange: "R10,000 - R15,000 / month",
    description:
      "Analyze dataset trends, build predictive models, and generate analytical dashboards.",
    requirements: [
      "Python & Pandas/PyTorch",
      "SQL database querying",
      "Basic statistics background",
    ],
    createdAt: "Posted 5h ago",
    business: {
      id: "b3",
      companyName: "DataNova",
      industry: "Analytics & AI",
      website: "https://datanova.ai",
      email: "jobs@datanova.ai",
      verificationStatus: "Verified",
    },
  },
};

export default function StudentOpportunityDetailScreen() {
  const isDark = useColorScheme() === "dark";
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const details =
    id && MOCK_OPPORTUNITIES[id]
      ? MOCK_OPPORTUNITIES[id]
      : MOCK_OPPORTUNITIES["1"];

  const handleApply = () => {
    Alert.alert(
      "Application Sent",
      `Your profile and CV have been submitted for ${details.title}.`,
      [{ text: "OK", onPress: () => router.back() }],
    );
  };

  const handleCancel = () => {
    router.back();
  };

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
            {details.title}
          </Text>

          <View style={styles.metaRow}>
            <View style={styles.typeBadge}>
              <Text style={styles.typeBadgeText}>{details.jobType}</Text>
            </View>
            <Text style={styles.metaText}>{details.location}</Text>
          </View>

          <Text style={styles.salaryText}>{details.salaryRange}</Text>

          <Text
            style={[
              styles.subHeading,
              isDark ? styles.darkText : styles.lightText,
            ]}
          >
            Description
          </Text>
          <Text style={styles.bodyText}>{details.description}</Text>

          <Text
            style={[
              styles.subHeading,
              isDark ? styles.darkText : styles.lightText,
            ]}
          >
            Requirements
          </Text>
          {details.requirements.map((req, idx) => (
            <View key={idx} style={styles.bulletRow}>
              <Text style={styles.bulletPoint}>•</Text>
              <Text style={styles.bodyText}>{req}</Text>
            </View>
          ))}
        </View>

        {/* Business Info Card */}
        <View
          style={[styles.card, isDark ? styles.darkCard : styles.lightCard]}
        >
          <View style={styles.businessHeader}>
            <Text style={styles.sectionBadge}>COMPANY INFO</Text>
            <View style={styles.statusChip}>
              <Text style={styles.statusChipText}>
                {details.business.verificationStatus}
              </Text>
            </View>
          </View>

          <Text
            style={[
              styles.companyName,
              isDark ? styles.darkText : styles.lightText,
            ]}
          >
            {details.business.companyName}
          </Text>

          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Ionicons name="briefcase-outline" size={16} color="#6B7280" />
              <Text style={styles.infoLabel}>{details.business.industry}</Text>
            </View>

            <View style={styles.infoItem}>
              <Ionicons name="mail-outline" size={16} color="#6B7280" />
              <Text style={styles.infoLabel}>{details.business.email}</Text>
            </View>

            <View style={styles.infoItem}>
              <Ionicons name="globe-outline" size={16} color="#6B7280" />
              <Text style={styles.infoLabel}>{details.business.website}</Text>
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
  salaryText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#006837",
    marginTop: 10,
  },
  subHeading: {
    fontSize: 14,
    fontWeight: "700",
    marginTop: 16,
    marginBottom: 6,
  },
  bodyText: { fontSize: 13, color: "#6B7280", lineHeight: 18, flex: 1 },
  bulletRow: { flexDirection: "row", gap: 6, marginBottom: 4 },
  bulletPoint: { color: "#006837", fontSize: 14 },
  businessHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  companyName: { fontSize: 18, fontWeight: "700", marginBottom: 12 },
  statusChip: {
    backgroundColor: "#D1FAE5",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  statusChipText: { fontSize: 10, fontWeight: "800", color: "#065F46" },
  infoGrid: { gap: 10 },
  infoItem: { flexDirection: "row", alignItems: "center", gap: 8 },
  infoLabel: { fontSize: 12, color: "#6B7280" },
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
