import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  useColorScheme,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ThemedInput } from "../../../components/ThemedInput";
import { useConversation, useSendMessage, MessageDto } from "@/api/hooks/useMessage";
import { useSignalRMessages } from "@/api/hooks/useMessage";

export default function ChatDetailScreen() {
  const isDark = useColorScheme() === "dark";
  const params = useLocalSearchParams<{ id: string; name?: string }>();
  const recipientId = params.id;
  const recipientName = params.name || "Chat";

  const [messageText, setMessageText] = useState("");
  const flatListRef = useRef<FlatList>(null);

  // Fetch real conversation history via API
  const { data: messages = [], isLoading } = useConversation(recipientId);
  const { mutate: sendMessage, isPending: isSending } = useSendMessage();

  // Attach SignalR real-time messaging pipeline for live pushes in this thread
  useSignalRMessages(recipientId);

  const handleSend = () => {
    if (!messageText.trim() || !recipientId || isSending) return;

    sendMessage(
      {
        receiverId: recipientId,
        content: messageText.trim(),
      },
      {
        onSuccess: () => {
          setMessageText("");
        },
      },
    );
  };

  const renderBubble = ({ item }: { item: MessageDto }) => {
    // If the message senderId matches the recipientId, it's from them ("other"). Otherwise, it's "me".
    const isMe = item.senderId !== recipientId;
    const formattedTime = new Date(item.sentAt).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

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
          <Text
            style={[
              styles.timestamp,
              isMe ? styles.myTimestamp : styles.otherTimestamp,
            ]}
          >
            {formattedTime}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={90}
      style={[styles.container, isDark ? styles.darkBg : styles.lightBg]}
    >
      {/* Sub-Header Banner */}
      <View
        style={[
          styles.recipientHeader,
          isDark ? styles.darkCard : styles.lightCard,
        ]}
      >
        <Text
          style={[
            styles.recipientName,
            isDark ? styles.darkText : styles.lightText,
          ]}
        >
          {recipientName}
        </Text>
        <Text style={styles.onlineStatus}>Online</Text>
      </View>

      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#006837" />
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderBubble}
          contentContainerStyle={styles.chatContent}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
        />
      )}

      {/* Input Bar */}
      <View style={styles.inputBar}>
        <ThemedInput
          placeholder="Type a message..."
          value={messageText}
          onChangeText={setMessageText}
          style={styles.chatInput}
          onSubmitEditing={handleSend}
          returnKeyType="send"
        />
        <TouchableOpacity
          style={[styles.sendBtn, isSending && styles.disabledBtn]}
          onPress={handleSend}
          disabled={isSending}
        >
          <Ionicons name="send" size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  lightBg: { backgroundColor: "#FFFFFF" },
  darkBg: { backgroundColor: "#111827" },
  recipientHeader: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: "center",
    borderBottomWidth: 1,
  },
  recipientName: { fontSize: 16, fontWeight: "700" },
  onlineStatus: { fontSize: 12, color: "#10B981" },
  chatContent: { paddingHorizontal: 16, paddingVertical: 12 },
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
  myTimestamp: { color: "#A7F3D0" },
  otherTimestamp: { color: "#9CA3AF" },
  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB33",
  },
  chatInput: { flex: 1, marginVertical: 0 },
  sendBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#006837",
    justifyContent: "center",
    alignItems: "center",
  },
  disabledBtn: { opacity: 0.6 },
  lightCard: { backgroundColor: "#F9FAFB", borderColor: "#E5E7EB" },
  darkCard: { backgroundColor: "#1F2937", borderColor: "#374151" },
  lightText: { color: "#111827" },
  darkText: { color: "#FFFFFF" },
});
