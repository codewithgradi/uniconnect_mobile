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
import { ThemedInput } from "../../../components/ThemedInput";

export interface ChatThread {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  avatarText: string;
  isOnline: boolean;
}

const MOCK_CHATS: ChatThread[] = [
  {
    id: "1",
    name: "Lerato Dlamini",
    lastMessage: "Hey! Are we still meeting for the study group?",
    timestamp: "2m ago",
    unreadCount: 2,
    avatarText: "LD",
    isOnline: true,
  },
  {
    id: "2",
    name: "James Mwangi",
    lastMessage: "Thanks for the feedback on my repo!",
    timestamp: "15m ago",
    unreadCount: 0,
    avatarText: "JM",
    isOnline: false,
  },
  {
    id: "3",
    name: "Tech Community Group",
    lastMessage: "Sarah: Check out this upcoming hackathon!",
    timestamp: "2h ago",
    unreadCount: 5,
    avatarText: "TC",
    isOnline: true,
  },
];

export default function MessagesScreen() {
  const isDark = useColorScheme() === "dark";
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"Chats" | "Groups">("Chats");
  const [searchQuery, setSearchQuery] = useState("");

  const renderChatItem = ({ item }: { item: ChatThread }) => (
    <TouchableOpacity
      style={[styles.chatCard, isDark ? styles.darkCard : styles.lightCard]}
      onPress={() =>
        router.push({
          pathname: "/student/messages/[id]",
          params: { id: item.id, name: item.name },
        })
      }
    >
      <View style={styles.avatarWrapper}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{item.avatarText}</Text>
        </View>
        {item.isOnline && <View style={styles.onlineBadge} />}
      </View>

      <View style={styles.chatInfo}>
        <View style={styles.chatHeader}>
          <Text
            style={[styles.name, isDark ? styles.darkText : styles.lightText]}
          >
            {item.name}
          </Text>
          <Text style={styles.time}>{item.timestamp}</Text>
        </View>
        <Text style={styles.lastMessage} numberOfLines={1}>
          {item.lastMessage}
        </Text>
      </View>

      {item.unreadCount > 0 && (
        <View style={styles.unreadBadge}>
          <Text style={styles.unreadText}>{item.unreadCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, isDark ? styles.darkBg : styles.lightBg]}>
      <View style={styles.searchContainer}>
        <ThemedInput
          placeholder="Search messages..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Segmented Filter */}
      <View style={styles.segmentContainer}>
        {(["Chats", "Groups"] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.segmentBtn,
              activeTab === tab && styles.activeSegmentBtn,
            ]}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[
                styles.segmentText,
                activeTab === tab
                  ? styles.activeSegmentText
                  : styles.inactiveSegmentText,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={MOCK_CHATS}
        keyExtractor={(item) => item.id}
        renderItem={renderChatItem}
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
  searchContainer: { marginTop: 16 },
  segmentContainer: {
    flexDirection: "row",
    backgroundColor: "#E5E7EB",
    borderRadius: 8,
    padding: 3,
    marginVertical: 14,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 6,
  },
  activeSegmentBtn: { backgroundColor: "#006837" },
  segmentText: { fontSize: 13, fontWeight: "600" },
  activeSegmentText: { color: "#FFFFFF" },
  inactiveSegmentText: { color: "#4B5563" },
  listContent: { paddingBottom: 24 },
  chatCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
  },
  lightCard: { backgroundColor: "#F9FAFB", borderColor: "#E5E7EB" },
  darkCard: { backgroundColor: "#1F2937", borderColor: "#374151" },
  avatarWrapper: { position: "relative", marginRight: 12 },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#006837",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: { color: "#FFFFFF", fontWeight: "700", fontSize: 16 },
  onlineBadge: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#10B981",
    position: "absolute",
    bottom: 0,
    right: 0,
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  chatInfo: { flex: 1 },
  chatHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  name: { fontSize: 15, fontWeight: "700" },
  time: { color: "#9CA3AF", fontSize: 12 },
  lastMessage: { color: "#6B7280", fontSize: 13 },
  unreadBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#006837",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  unreadText: { color: "#FFFFFF", fontSize: 11, fontWeight: "700" },
  lightText: { color: "#111827" },
  darkText: { color: "#FFFFFF" },
});
