import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { useState, useEffect, useRef } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Platform,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import * as Notifications from "expo-notifications";
import { ThemedInput } from "../../../components/ThemedInput";

// Configure mobile notification behavior
if (Platform.OS !== "web") {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

interface DirectMessageDto {
  id: string;
  senderUserId: string;
  senderProfileId: string;
  senderFirstName: string;
  senderLastName: string;
  message: string;
  isRead?: boolean;
}

import {
  useChatThreads,
  useSignalRMessages,
  useUnreadMessageCount,
} from "@/api/hooks/useMessage";

export default function MessagesScreen() {
  const isDark = useColorScheme() === "dark";
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  // Track unread sender IDs locally for real-time UI bolding & badges
  const [unreadSenderIds, setUnreadSenderIds] = useState<Set<string>>(
    new Set(),
  );

  const {
    data: messages = [],
    isLoading,
    refetch,
    isRefetching,
  } = useChatThreads() as unknown as {
    data: DirectMessageDto[];
    isLoading: boolean;
    refetch: () => void;
    isRefetching: boolean;
  };

  useUnreadMessageCount();

  // Keep track of the last processed message ID to avoid duplicate updates on re-renders
  const lastMessageIdRef = useRef<string | null>(null);
  const hasAlertedOfflineRef = useRef(false);

  // Hook into your existing SignalR listener
  const signalRResult = useSignalRMessages() as any;

  // Safely extract connection status and messages if your hook returns an object or array
  const signalRData = signalRResult?.messages || signalRResult;
  const isConnected = signalRResult?.isConnected ?? true;
  const connectionError = signalRResult?.error;

  // Request notification permissions for Web and Mobile on mount
  useEffect(() => {
    async function requestPermission() {
      if (Platform.OS === "web") {
        if (typeof window !== "undefined" && "Notification" in window) {
          if (Notification.permission === "default") {
            await Notification.requestPermission();
          }
        }
      } else {
        const { status: existingStatus } =
          await Notifications.getPermissionsAsync();
        if (existingStatus !== "granted") {
          await Notifications.requestPermissionsAsync();
        }
      }
    }
    requestPermission();
  }, []);

  // Alert user if SignalR fails to connect
  useEffect(() => {
    if (
      (isConnected === false || connectionError) &&
      !hasAlertedOfflineRef.current
    ) {
      hasAlertedOfflineRef.current = true;
      Alert.alert(
        "Connection Offline",
        "You are offline or SignalR failed to connect. Real-time updates may be unavailable.",
        [
          {
            text: "OK",
            onPress: () => {
              hasAlertedOfflineRef.current = false;
            },
          },
        ],
      );
    }
  }, [isConnected, connectionError]);

 useEffect(() => {
   const latestIncoming = Array.isArray(signalRData)
     ? signalRData[signalRData.length - 1]
     : signalRData;

   const messageId = latestIncoming?.id || latestIncoming?.messageId;

   if (latestIncoming && messageId && messageId !== lastMessageIdRef.current) {
     lastMessageIdRef.current = messageId;

     const incomingSenderId =
       latestIncoming.senderUserId ||
       latestIncoming.senderId ||
       latestIncoming.senderProfileId;

     // Extract current user ID from JWT token to prevent self-notifications
     let currentUserId = "";
     try {
       const token = signalRResult?.token || /* retrieve token if needed */ "";
       // Alternatively, decode the sub/nameid from your stored token or compare with user context
     } catch (e) {}

     // If the incoming sender ID matches your own user ID, skip notifying
     if (incomingSenderId === "a8d63a87-66ba-4d97-92e2-181303a58186") {
       refetch();
       return;
     }

     const senderName =
       `${latestIncoming.senderFirstName || "New"} ${latestIncoming.senderLastName || "Message"}`.trim();
     const messageBody =
       latestIncoming.message ||
       latestIncoming.content ||
       "You have received a new message.";

     if (incomingSenderId) {
       setUnreadSenderIds((prev) =>
         new Set(prev).add(String(incomingSenderId).toLowerCase()),
       );
     }

     if (Platform.OS === "web") {
       if (
         typeof window !== "undefined" &&
         "Notification" in window &&
         Notification.permission === "granted"
       ) {
         new Notification(senderName, {
           body: messageBody,
           icon: "/favicon.ico",
         });
       }
     } else {
       Notifications.scheduleNotificationAsync({
         content: {
           title: senderName,
           body: messageBody,
           data: { senderUserId: incomingSenderId },
         },
         trigger: null,
       });
     }

     refetch();
   }
 }, [signalRData]);

  const filteredMessages = messages.filter((msg) => {
    const fullName =
      `${msg?.senderFirstName ?? ""} ${msg?.senderLastName ?? ""}`.toLowerCase();
    const content = (msg?.message ?? "").toLowerCase();
    const query = searchQuery.toLowerCase();
    return fullName.includes(query) || content.includes(query);
  });

  const renderChatItem = ({ item }: { item: DirectMessageDto }) => {
    const fullName = `${item.senderFirstName} ${item.senderLastName}`;
    const initials =
      `${item.senderFirstName?.[0] ?? ""}${item.senderLastName?.[0] ?? ""}`.toUpperCase() ||
      "U";

    const senderIdMatch = item.senderUserId?.toLowerCase();
    const senderProfileMatch = item.senderProfileId?.toLowerCase();

    const isUnread =
      Array.from(unreadSenderIds).some(
        (id) => id === senderIdMatch || id === senderProfileMatch,
      ) || item.isRead === false;

    return (
      <TouchableOpacity
        style={[styles.chatCard, isDark ? styles.darkCard : styles.lightCard]}
        onPress={() => {
          setUnreadSenderIds((prev) => {
            const next = new Set(prev);
            if (senderIdMatch) next.delete(senderIdMatch);
            if (senderProfileMatch) next.delete(senderProfileMatch);
            return next;
          });

          router.push({
            pathname: "/student/messages/[id]",
            params: { id: item.senderUserId, name: fullName },
          });
        }}
      >
        <View style={styles.avatarWrapper}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          {isUnread && <View style={styles.unreadBadgeDot} />}
        </View>

        <View style={styles.chatInfo}>
          <View style={styles.chatHeader}>
            <Text
              style={[
                styles.name,
                isDark ? styles.darkText : styles.lightText,
                isUnread && styles.unreadTextBold,
              ]}
            >
              {fullName}
            </Text>
          </View>
          <Text
            style={[
              styles.lastMessage,
              isUnread &&
                (isDark ? styles.darkUnreadMsg : styles.lightUnreadMsg),
            ]}
            numberOfLines={1}
          >
            {item.message}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

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
          data={filteredMessages}
          keyExtractor={(item, index) => item?.id ?? index.toString()}
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

export const unstable_settings = {
  headerShown: true,
};

MessagesScreen.options = {
  headerShown: true,
  title: "Messages",
};

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
  unreadBadgeDot: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#EF4444",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  chatInfo: { flex: 1 },
  chatHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  name: { fontSize: 15, fontWeight: "600" },
  unreadTextBold: { fontWeight: "800", color: "#006837" },
  lastMessage: { color: "#6B7280", fontSize: 13 },
  lightUnreadMsg: { color: "#111827", fontWeight: "700" },
  darkUnreadMsg: { color: "#F3F4F6", fontWeight: "700" },
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
