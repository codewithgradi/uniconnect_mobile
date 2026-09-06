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

export interface OpportunityDetailVerificationDto {
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
    registrationNumber: string;
    industry: string;
    website: string;
    email: string;
    verificationStatus: "Verified" | "Pending" | "Unverified";
  };
}

const MOCK_OPPORTUNITY_DETAILS: Record<
  string,
  OpportunityDetailVerificationDto
> = {
  "1": {
    id: "1",
    title: "Flutter Developer Intern",
    jobType: "Internship",
    location: "Cape Town, South Africa",
    salaryRange: "R8,000 - R12,000 / month",
    description:
      "Looking for a passionate Flutter Developer Intern to build cross-platform mobile apps.",
    requirements: [
      "Basic Dart & Flutter SDK",
      "RESTful API integration",
      "Team player",
    ],
    createdAt: "2 hours ago",
    business: {
      id: "b1",
      companyName: "TechCorp Solutions",
      registrationNumber: "2021/847291/07",
      industry: "Software Development",
      website: "https://techcorp.co.za",
      email: "careers@techcorp.co.za",
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
      "Join our team to build scalable React and Next.js applications.",
    requirements: [
      "HTML, CSS, TypeScript",
      "React / Next.js experience",
      "Git workflows",
    ],
    createdAt: "5 hours ago",
    business: {
      id: "b2",
      companyName: "CreativeTech",
      registrationNumber: "2019/332110/07",
      industry: "Digital Agency",
      website: "https://creativetech.dev",
      email: "hr@creativetech.dev",
      verificationStatus: "Pending",
    },
  },
  "3": {
    id: "3",
    title: "Data Science Intern",
    jobType: "Internship",
    location: "Pretoria, South Africa",
    salaryRange: "R10,000 - R15,000 / month",
    description:
      "Analyze dataset trends and train machine learning models for client solutions.",
    requirements: [
      "Python & Pandas/PyTorch",
      "SQL database querying",
      "Statistics background",
    ],
    createdAt: "1 day ago",
    business: {
      id: "b3",
      companyName: "DataNova",
      registrationNumber: "2022/990123/07",
      industry: "Analytics & AI",
      website: "https://datanova.ai",
      email: "jobs@datanova.ai",
      verificationStatus: "Verified",
    },
  },
};

export default function OpportunityVerificationDetailScreen() {
  const isDark = useColorScheme() === "dark";
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const details =
    id && MOCK_OPPORTUNITY_DETAILS[id]
      ? MOCK_OPPORTUNITY_DETAILS[id]
      : MOCK_OPPORTUNITY_DETAILS["1"];

  const handleApprove = () => {
    Alert.alert(
      "Opportunity Approved",
      `${details.title} is now published live.`,
      [{ text: "OK", onPress: () => router.back() }],
    );
  };

  const handleReject = () => {
    Alert.alert("Opportunity Rejected", `${details.title} request rejected.`, [
      { text: "OK", onPress: () => router.back() },
    ]);
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

        <View
          style={[styles.card, isDark ? styles.darkCard : styles.lightCard]}
        >
          <View style={styles.businessHeader}>
            <Text style={styles.sectionBadge}>BUSINESS PROFILE</Text>
            <View
              style={[
                styles.statusChip,
                {
                  backgroundColor:
                    details.business.verificationStatus === "Verified"
                      ? "#D1FAE5"
                      : "#FEF3C7",
                },
              ]}
            >
              <Text
                style={[
                  styles.statusChipText,
                  {
                    color:
                      details.business.verificationStatus === "Verified"
                        ? "#065F46"
                        : "#92400E",
                  },
                ]}
              >
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
              <Ionicons name="card-outline" size={16} color="#6B7280" />
              <Text style={styles.infoLabel}>
                Reg No: {details.business.registrationNumber}
              </Text>
            </View>

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

      {/* Floating Action Bar with Dynamic Safe Area Padding */}
      <View
        style={[
          styles.actionBar,
          isDark ? styles.darkBar : styles.lightBar,
          { paddingBottom: Math.max(insets.bottom, 16) },
        ]}
      >
        <TouchableOpacity style={styles.rejectBtn} onPress={handleReject}>
          <Text style={styles.rejectBtnText}>Reject Request</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.approveBtn} onPress={handleApprove}>
          <Text style={styles.approveBtnText}>Approve & Publish</Text>
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
  statusChip: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  statusChipText: { fontSize: 10, fontWeight: "800" },
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
  rejectBtn: {
    flex: 1,
    backgroundColor: "#FEE2E2",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  rejectBtnText: { color: "#DC2626", fontWeight: "700", fontSize: 13 },
  approveBtn: {
    flex: 1,
    backgroundColor: "#006837",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  approveBtnText: { color: "#FFFFFF", fontWeight: "700", fontSize: 13 },
  lightCard: { backgroundColor: "#F9FAFB", borderColor: "#E5E7EB" },
  darkCard: { backgroundColor: "#1F2937", borderColor: "#374151" },
  lightText: { color: "#111827" },
  darkText: { color: "#FFFFFF" },
});
