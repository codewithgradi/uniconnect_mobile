import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  type: "event" | "message" | "system" | "academic";
}

const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "1",
    title: "New Event Announcement",
    message:
      "Alumni Networking Evening 2026 has been scheduled for next Friday.",
    timestamp: "10m ago",
    isRead: false,
    type: "event",
  },
  {
    id: "2",
    title: "New Message",
    message:
      "Lerato Dlamini sent you a message regarding the group assignment.",
    timestamp: "1h ago",
    isRead: false,
    type: "message",
  },
  {
    id: "3",
    title: "Grade Update",
    message: "Your grade for Web Development (Task 3) has been published.",
    timestamp: "1d ago",
    isRead: true,
    type: "academic",
  },
  {
    id: "4",
    title: "System Security Alert",
    message: "Your account was logged in from a new device.",
    timestamp: "3d ago",
    isRead: true,
    type: "system",
  },
];

export default function NotificationsScreen() {
  const isDark = useColorScheme() === "dark";
  const [notifications, setNotifications] =
    useState<NotificationItem[]>(MOCK_NOTIFICATIONS);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, isRead: true })));
  };

  const getIconName = (type: NotificationItem["type"]) => {
    switch (type) {
      case "event":
        return "calendar-outline";
      case "message":
        return "chatbubble-ellipses-outline";
      case "academic":
        return "school-outline";
      case "system":
        return "shield-checkmark-outline";
      default:
        return "notifications-outline";
    }
  };

  const renderNotificationCard = ({ item }: { item: NotificationItem }) => (
    <View
      style={[
        styles.card,
        isDark ? styles.darkCard : styles.lightCard,
        !item.isRead && styles.unreadBorder,
      ]}
    >
      <View style={styles.iconContainer}>
        <Ionicons name={getIconName(item.type)} size={22} color="#006837" />
      </View>

      <View style={styles.textContainer}>
        <View style={styles.headerRow}>
          <Text
            style={[styles.title, isDark ? styles.darkText : styles.lightText]}
          >
            {item.title}
          </Text>
          <Text style={styles.timestamp}>{item.timestamp}</Text>
        </View>
        <Text style={styles.message} numberOfLines={2}>
          {item.message}
        </Text>
      </View>

      {!item.isRead && <View style={styles.unreadDot} />}
    </View>
  );

  return (
    <View style={[styles.container, isDark ? styles.darkBg : styles.lightBg]}>
      {/* Top Action Bar */}
      <View style={styles.topBar}>
        <Text
          style={[styles.heading, isDark ? styles.darkText : styles.lightText]}
        >
          Notifications
        </Text>
        <TouchableOpacity onPress={markAllAsRead}>
          <Text style={styles.markReadText}>Mark all as read</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderNotificationCard}
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
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 16,
  },
  heading: { fontSize: 18, fontWeight: "700" },
  markReadText: { color: "#006837", fontSize: 13, fontWeight: "600" },
  listContent: { paddingBottom: 24 },
  card: {
    flexDirection: "row",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
    alignItems: "center",
    position: "relative",
  },
  lightCard: { backgroundColor: "#F9FAFB", borderColor: "#E5E7EB" },
  darkCard: { backgroundColor: "#1F2937", borderColor: "#374151" },
  unreadBorder: { borderColor: "#006837", borderWidth: 1.5 },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E6F0EB",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  textContainer: { flex: 1 },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  title: { fontSize: 14, fontWeight: "700" },
  timestamp: { fontSize: 11, color: "#9CA3AF" },
  message: { fontSize: 13, color: "#6B7280", lineHeight: 18 },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#006837",
    position: "absolute",
    top: 14,
    right: 14,
  },
  lightText: { color: "#111827" },
  darkText: { color: "#FFFFFF" },
});
