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

export interface ApplicantDto {
  id: string;
  name: string;
  field: string;
  timeAgo: string;
  initials: string;
}

const MOCK_APPLICANTS: ApplicantDto[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    field: "Computer Science Student",
    timeAgo: "2h ago",
    initials: "SJ",
  },
  {
    id: "2",
    name: "Sipho Dlamini",
    field: "Software Engineering Student",
    timeAgo: "5h ago",
    initials: "SD",
  },
  {
    id: "3",
    name: "Amanda van Wyk",
    field: "Information Systems Student",
    timeAgo: "1d ago",
    initials: "AV",
  },
  {
    id: "4",
    name: "Thabo Nkosi",
    field: "Computer Science Student",
    timeAgo: "1d ago",
    initials: "TN",
  },
];

export default function ApplicantsScreen() {
  const isDark = useColorScheme() === "dark";
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    "All" | "New" | "Reviewed" | "Shortlisted"
  >("All");

  const renderApplicant = ({ item }: { item: ApplicantDto }) => (
    <TouchableOpacity
      style={[styles.card, isDark ? styles.darkCard : styles.lightCard]}
      onPress={() =>
        router.push({
          pathname: "/business/applicant/[id]",
          params: { id: item.id },
        })
      }
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{item.initials}</Text>
      </View>
      <View style={styles.info}>
        <Text
          style={[styles.name, isDark ? styles.darkText : styles.lightText]}
        >
          {item.name}
        </Text>
        <Text style={styles.field}>{item.field}</Text>
      </View>
      <Text style={styles.time}>{item.timeAgo}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, isDark ? styles.darkBg : styles.lightBg]}>
      {/* Category Tabs */}
      <View style={styles.tabBar}>
        {(["All", "New", "Reviewed", "Shortlisted"] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab
                  ? styles.activeTabText
                  : styles.inactiveTabText,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={MOCK_APPLICANTS}
        keyExtractor={(item) => item.id}
        renderItem={renderApplicant}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20 },
  lightBg: { backgroundColor: "#FFFFFF" },
  darkBg: { backgroundColor: "#111827" },
  tabBar: { flexDirection: "row", marginVertical: 16, gap: 8 },
  tab: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "#E5E7EB",
  },
  activeTab: { backgroundColor: "#006837" },
  tabText: { fontSize: 13, fontWeight: "600" },
  activeTabText: { color: "#FFFFFF" },
  inactiveTabText: { color: "#374151" },
  listContent: { paddingBottom: 24 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#006837",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: { color: "#FFFFFF", fontWeight: "700", fontSize: 15 },
  info: { flex: 1 },
  name: { fontSize: 15, fontWeight: "700" },
  field: { fontSize: 12, color: "#6B7280", marginTop: 2 },
  time: { fontSize: 11, color: "#9CA3AF" },
  lightCard: { backgroundColor: "#F9FAFB", borderColor: "#E5E7EB" },
  darkCard: { backgroundColor: "#1F2937", borderColor: "#374151" },
  lightText: { color: "#111827" },
  darkText: { color: "#FFFFFF" },
});
