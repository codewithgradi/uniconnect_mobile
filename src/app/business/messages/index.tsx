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

export interface ChatThreadDto {
  id: string; // Recipient/Thread ID
  name: string;
  role: "Student" | "Alumni";
  lastMessage: string;
  timeAgo: string;
  unreadCount: number;
  initials: string;
}

const MOCK_THREADS: ChatThreadDto[] = [
  {
    id: "student-001",
    name: "Lerato Dlamini",
    role: "Student",
    lastMessage: "Hey! Are we still meeting...",
    timeAgo: "2m",
    unreadCount: 1,
    initials: "LD",
  },
  {
    id: "alumni-002",
    name: "James Mwangi",
    role: "Alumni",
    lastMessage: "Thanks for the advice!",
    timeAgo: "15m",
    unreadCount: 0,
    initials: "JM",
  },
  {
    id: "student-003",
    name: "Sarah Johnson",
    role: "Student",
    lastMessage: "Interested in the position...",
    timeAgo: "2h",
    unreadCount: 0,
    initials: "SJ",
  },
  {
    id: "student-004",
    name: "Sipho Dlamini",
    role: "Student",
    lastMessage: "Thank you!",
    timeAgo: "15m",
    unreadCount: 0,
    initials: "SD",
  },
  {
    id: "student-005",
    name: "Amanda van Wyk",
    role: "Student",
    lastMessage: "Sent you a connection request",
    timeAgo: "1h",
    unreadCount: 0,
    initials: "AV",
  },
];

export default function MessagesScreen() {
  const isDark = useColorScheme() === "dark";
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"All" | "Students" | "Alumni">(
    "All",
  );

  const filteredThreads = MOCK_THREADS.filter((thread) => {
    if (activeTab === "Students") return thread.role === "Student";
    if (activeTab === "Alumni") return thread.role === "Alumni";
    return true;
  });

  const renderThread = ({ item }: { item: ChatThreadDto }) => (
    <TouchableOpacity
      style={[styles.threadCard, isDark ? styles.darkCard : styles.lightCard]}
      onPress={() =>
        router.push({
          pathname: "/business/messages/[id]",
          params: { id: item.id, name: item.name },
        })
      }
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{item.initials}</Text>
      </View>

      <View style={styles.threadInfo}>
        <View style={styles.topRow}>
          <Text
            style={[styles.name, isDark ? styles.darkText : styles.lightText]}
          >
            {item.name}
          </Text>
          <Text style={styles.time}>{item.timeAgo}</Text>
        </View>
        <Text style={styles.lastMessage} numberOfLines={1}>
          {item.lastMessage}
        </Text>
      </View>

      {item.unreadCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{item.unreadCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, isDark ? styles.darkBg : styles.lightBg]}>
      {/* Category Tabs */}
      <View style={styles.tabBar}>
        {(["All", "Students", "Alumni"] as const).map((tab) => (
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
        data={filteredThreads}
        keyExtractor={(item) => item.id}
        renderItem={renderThread}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
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
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "#E5E7EB",
  },
  activeTab: { backgroundColor: "#006837" },
  tabText: { fontSize: 13, fontWeight: "600" },
  activeTabText: { color: "#FFFFFF" },
  inactiveTabText: { color: "#374151" },
  listContent: { paddingBottom: 24 },
  threadCard: {
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
  threadInfo: { flex: 1 },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 2,
  },
  name: { fontSize: 15, fontWeight: "700" },
  time: { fontSize: 11, color: "#9CA3AF" },
  lastMessage: { fontSize: 13, color: "#6B7280" },
  badge: {
    backgroundColor: "#006837",
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  badgeText: { color: "#FFFFFF", fontSize: 11, fontWeight: "700" },
  lightCard: { backgroundColor: "#F9FAFB", borderColor: "#E5E7EB" },
  darkCard: { backgroundColor: "#1F2937", borderColor: "#374151" },
  lightText: { color: "#111827" },
  darkText: { color: "#FFFFFF" },
});
