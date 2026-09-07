import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  useColorScheme,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ThemedInput } from "../../../components/ThemedInput";
import {
  useChatThreads,
  useUnreadMessageCount,
  useSignalRMessages,
  ChatThreadDto,
} from "@/api/hooks/useMessage";

export default function MessagesScreen() {
  const isDark = useColorScheme() === "dark";
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch real data from API
  const {
    data: chats = [],
    isLoading,
    refetch,
    isRefetching,
  } = useChatThreads();
  const { data: unreadData } = useUnreadMessageCount();

  // Initialize global SignalR connection to handle incoming messages & update counts in real-time
  useSignalRMessages();

  const filteredChats = chats.filter((chat) =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const renderChatItem = ({ item }: { item: ChatThreadDto }) => (
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

      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#006837" />
        </View>
      ) : (
        <FlatList
          data={filteredChats}
          keyExtractor={(item) => item.id}
          renderItem={renderChatItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              tintColor="#006837"
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="chatbubbles-outline" size={48} color="#9CA3AF" />
              <Text
                style={[
                  styles.emptyText,
                  isDark ? styles.darkText : styles.lightText,
                ]}
              >
                No messages found.
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  lightBg: { backgroundColor: "#FFFFFF" },
  darkBg: { backgroundColor: "#111827" },
  searchContainer: { marginTop: 16, marginBottom: 14 },
  listContent: { paddingBottom: 24, flexGrow: 1 },
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
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    marginTop: 40,
  },
  emptyText: { fontSize: 14, fontWeight: "600" },
  lightText: { color: "#111827" },
  darkText: { color: "#FFFFFF" },
});
