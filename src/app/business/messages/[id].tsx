import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  useColorScheme,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

export interface ChatMessageDto {
  id: string;
  senderId: "me" | "other";
  text: string;
  timestamp: string;
}

const INITIAL_MESSAGES: ChatMessageDto[] = [
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
    timestamp: "10:02 AM",
  },
  {
    id: "4",
    senderId: "other",
    text: "Great! I saw your project on GitHub. Very impressive!",
    timestamp: "10:04 AM",
  },
  {
    id: "5",
    senderId: "me",
    text: "Thank you so much! 🙏",
    timestamp: "10:05 AM",
  },
  {
    id: "6",
    senderId: "other",
    text: "Would you be interested in collaborating on a project?",
    timestamp: "10:06 AM",
  },
  {
    id: "7",
    senderId: "me",
    text: "Definitely! I'd love to.",
    timestamp: "10:08 AM",
  },
];

export default function DirectMessageScreen() {
  const isDark = useColorScheme() === "dark";
  const { name } = useLocalSearchParams<{ id: string; name?: string }>();

  const [messages, setMessages] = useState<ChatMessageDto[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessage: ChatMessageDto = {
      id: Date.now().toString(),
      senderId: "me",
      text: input.trim(),
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");
  };

  const renderBubble = ({ item }: { item: ChatMessageDto }) => {
    const isMe = item.senderId === "me";

    return (
      <View
        style={[
          styles.bubbleWrapper,
          isMe ? styles.myWrapper : styles.otherWrapper,
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
        </View>
        <Text style={styles.timestamp}>{item.timestamp}</Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, isDark ? styles.darkBg : styles.lightBg]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={90}
    >
      {/* Header Name Banner */}
      <View
        style={[
          styles.headerBanner,
          isDark ? styles.darkCard : styles.lightCard,
        ]}
      >
        <View style={styles.onlineDot} />
        <Text
          style={[
            styles.recipientName,
            isDark ? styles.darkText : styles.lightText,
          ]}
        >
          {name || "Direct Message"}
        </Text>
      </View>

      {/* Messages List */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderBubble}
        contentContainerStyle={styles.messagesContainer}
        showsVerticalScrollIndicator={false}
      />

      {/* Bottom Input Area */}
      <View
        style={[
          styles.inputContainer,
          isDark ? styles.darkInputContainer : styles.lightInputContainer,
        ]}
      >
        <TextInput
          style={[
            styles.textInput,
            isDark ? styles.darkText : styles.lightText,
          ]}
          placeholder="Type a message..."
          placeholderTextColor="#9CA3AF"
          value={input}
          onChangeText={setInput}
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
  headerBanner: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderWidth: 1,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    gap: 8,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#10B981",
  },
  recipientName: { fontSize: 15, fontWeight: "700" },
  messagesContainer: { paddingHorizontal: 16, paddingVertical: 12 },
  bubbleWrapper: { marginBottom: 12, maxWidth: "80%" },
  myWrapper: { alignSelf: "flex-end" },
  otherWrapper: { alignSelf: "flex-start" },
  bubble: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 16 },
  myBubble: { backgroundColor: "#006837", borderBottomRightRadius: 2 },
  lightOtherBubble: { backgroundColor: "#F3F4F6", borderBottomLeftRadius: 2 },
  darkOtherBubble: { backgroundColor: "#374151", borderBottomLeftRadius: 2 },
  messageText: { fontSize: 14, lineHeight: 20 },
  myMessageText: { color: "#FFFFFF" },
  timestamp: {
    fontSize: 10,
    color: "#9CA3AF",
    marginTop: 4,
    alignSelf: "flex-end",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    gap: 10,
  },
  lightInputContainer: {
    backgroundColor: "#FFFFFF",
    borderTopColor: "#E5E7EB",
  },
  darkInputContainer: { backgroundColor: "#111827", borderTopColor: "#374151" },
  textInput: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    paddingHorizontal: 16,
    backgroundColor: "#F3F4F6",
    fontSize: 14,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#006837",
    justifyContent: "center",
    alignItems: "center",
  },
  lightCard: { backgroundColor: "#F9FAFB", borderColor: "#E5E7EB" },
  darkCard: { backgroundColor: "#1F2937", borderColor: "#374151" },
  lightText: { color: "#111827" },
  darkText: { color: "#FFFFFF" },
});
