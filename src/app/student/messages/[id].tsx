import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  useColorScheme,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ThemedInput } from "../../../components/ThemedInput";

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
}

export default function ChatDetailScreen() {
  const isDark = useColorScheme() === "dark";
  const params = useLocalSearchParams<{ id: string; name?: string }>();
  const recipientName = params.name || "Chat";

  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", senderId: "other", text: "Hi Sarah! 👋", timestamp: "10:00 AM" },
    {
      id: "2",
      senderId: "other",
      text: "How are you doing?",
      timestamp: "10:01 AM",
    },
    {
      id: "3",
      senderId: "me",
      text: "I'm good, thanks! How about you?",
      timestamp: "10:03 AM",
    },
    {
      id: "4",
      senderId: "other",
      text: "Great! I saw your project on GitHub. Very impressive!",
      timestamp: "10:05 AM",
    },
  ]);

  const handleSend = () => {
    if (!messageText.trim()) return;
    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: "me",
      text: messageText,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setMessages((prev) => [...prev, newMessage]);
    setMessageText("");
  };

  const renderBubble = ({ item }: { item: Message }) => {
    const isMe = item.senderId === "me";
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
            {item.text}
          </Text>
          <Text
            style={[
              styles.timestamp,
              isMe ? styles.myTimestamp : styles.otherTimestamp,
            ]}
          >
            {item.timestamp}
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

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderBubble}
        contentContainerStyle={styles.chatContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Input Bar */}
      <View style={styles.inputBar}>
        <ThemedInput
          placeholder="Type a message..."
          value={messageText}
          onChangeText={setMessageText}
          style={styles.chatInput}
        />
        <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
          <Ionicons name="send" size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
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
  lightCard: { backgroundColor: "#F9FAFB", borderColor: "#E5E7EB" },
  darkCard: { backgroundColor: "#1F2937", borderColor: "#374151" },
  lightText: { color: "#111827" },
  darkText: { color: "#FFFFFF" },
});
