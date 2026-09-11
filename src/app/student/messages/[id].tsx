import {
  useConversation,
  useSendMessage,
  useSignalRMessages,
  MessageDto,
} from "@/api/hooks/useMessage";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedInput } from "../../../components/ThemedInput";

export default function ChatDetailScreen() {
  const isDark = useColorScheme() === "dark";
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string; name?: string }>();

  const recipientId = params.id;
  const recipientName = params.name || "Chat";

  const [messageText, setMessageText] = useState("");
  const flatListRef = useRef<FlatList>(null);

  // Fetch only the conversation history specific to this recipient ID
  const { data: messages = [], isLoading } = useConversation(recipientId);
  const { mutate: sendMessage, isPending: isSending } = useSendMessage();

  // Attach SignalR real-time messaging listener specifically for this thread
  useSignalRMessages(recipientId);

  const handleSend = () => {
    if (!messageText.trim() || !recipientId || isSending) return;

    const contentToSend = messageText.trim();
    setMessageText("");

    sendMessage({
      receiverId: recipientId,
      content: contentToSend,
    });
  };

  const renderBubble = ({ item }: { item: MessageDto }) => {
    const isMe = item.senderId !== recipientId;
    const formattedTime = item.sentAt
      ? new Date(item.sentAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "";

    return (
      <View
        style={[
          styles.bubbleWrapper,
          isMe ? styles.myBubbleWrapper : styles.otherBubbleWrapper,
        ]}
      >
        <View
          style={[
            styles.bubble,
            isMe
              ? styles.myBubble
              : isDark
                ? styles.darkOtherBubble
                : styles.lightOtherBubble,
          ]}
        >
          <Text
            style={[
              styles.messageText,
              isMe
                ? styles.myMessageText
                : isDark
                  ? styles.darkText
                  : styles.lightText,
            ]}
          >
            {item.content}
          </Text>
          {formattedTime ? (
            <Text
              style={[
                styles.timestamp,
                isMe ? styles.myTimestamp : styles.otherTimestamp,
              ]}
            >
              {formattedTime}
            </Text>
          ) : null}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, isDark ? styles.darkBg : styles.lightBg]}
      edges={["top", "left", "right"]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardContainer}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        {/* Sub-Header Banner */}
        <View
          style={[
            styles.recipientHeader,
            isDark ? styles.darkCard : styles.lightCard,
            isDark ? styles.darkHeaderBorder : styles.lightHeaderBorder,
          ]}
        >
          <TouchableOpacity
            onPress={() => {
              if (router.canGoBack()) {
                router.back();
              } else {
                router.replace("/student/messages");
              }
            }}
            style={styles.backButton}
          >
            <Ionicons
              name="arrow-back"
              size={24}
              color={isDark ? "#FFFFFF" : "#111827"}
            />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text
              style={[
                styles.recipientName,
                isDark ? styles.darkText : styles.lightText,
              ]}
              numberOfLines={1}
            >
              {recipientName}
            </Text>
          </View>
        </View>

        {isLoading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color="#006837" />
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item, index) => item?.id ?? index.toString()}
            renderItem={renderBubble}
            contentContainerStyle={styles.chatContent}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() =>
              flatListRef.current?.scrollToEnd({ animated: true })
            }
            onLayout={() =>
              flatListRef.current?.scrollToEnd({ animated: false })
            }
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons
                  name="chatbubble-ellipses-outline"
                  size={48}
                  color="#9CA3AF"
                />
                <Text
                  style={[
                    styles.emptyText,
                    isDark ? styles.darkText : styles.lightText,
                  ]}
                >
                  No messages yet. Start the conversation!
                </Text>
              </View>
            }
          />
        )}

        {/* Input Bar */}
        <View
          style={[
            styles.inputBar,
            isDark ? styles.darkInputBg : styles.lightInputBg,
            isDark ? styles.darkHeaderBorder : styles.lightHeaderBorder,
          ]}
        >
          <ThemedInput
            placeholder="Type a message..."
            value={messageText}
            onChangeText={setMessageText}
            style={styles.chatInput}
            onSubmitEditing={handleSend}
            returnKeyType="send"
          />
          <TouchableOpacity
            style={[
              styles.sendBtn,
              (!messageText.trim() || isSending) && styles.disabledBtn,
            ]}
            onPress={handleSend}
            disabled={!messageText.trim() || isSending}
          >
            <Ionicons name="send" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  keyboardContainer: { flex: 1 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  lightBg: { backgroundColor: "#FFFFFF" },
  darkBg: { backgroundColor: "#111827" },
  recipientHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  lightHeaderBorder: { borderBottomColor: "#E5E7EB" },
  darkHeaderBorder: { borderBottomColor: "#374151" },
  backButton: { marginRight: 12 },
  headerInfo: { flex: 1 },
  recipientName: { fontSize: 16, fontWeight: "700" },
  chatContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexGrow: 1,
    justifyContent: "flex-end",
  },
  bubbleWrapper: { marginVertical: 4, width: "100%", flexDirection: "row" },
  myBubbleWrapper: { justifyContent: "flex-end" },
  otherBubbleWrapper: { justifyContent: "flex-start" },
  bubble: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    maxWidth: "78%",
  },
  myBubble: { backgroundColor: "#006837", borderBottomRightRadius: 2 },
  lightOtherBubble: { backgroundColor: "#F3F4F6", borderBottomLeftRadius: 2 },
  darkOtherBubble: { backgroundColor: "#1F2937", borderBottomLeftRadius: 2 },
  messageText: { fontSize: 14, lineHeight: 20 },
  myMessageText: { color: "#FFFFFF" },
  timestamp: { fontSize: 10, marginTop: 4, alignSelf: "flex-end" },
  myTimestamp: { color: "rgba(255, 255, 255, 0.7)" },
  otherTimestamp: { color: "#9CA3AF" },
  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    gap: 8,
  },
  lightInputBg: { backgroundColor: "#FFFFFF" },
  darkInputBg: { backgroundColor: "#111827" },
  chatInput: { flex: 1, marginVertical: 0 },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#006837",
    justifyContent: "center",
    alignItems: "center",
  },
  disabledBtn: { opacity: 0.5 },
  lightCard: { backgroundColor: "#F9FAFB" },
  darkCard: { backgroundColor: "#1F2937" },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    paddingVertical: 40,
  },
  emptyText: { fontSize: 14, fontWeight: "500", textAlign: "center" },
  lightText: { color: "#111827" },
  darkText: { color: "#FFFFFF" },
});
