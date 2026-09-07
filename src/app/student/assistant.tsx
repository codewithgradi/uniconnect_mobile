import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ThemedInput } from "../../components/ThemedInput";
import { useChat } from "@/api/hooks/useChat"; // Adjust path to where you placed the generated hook

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
}

export default function AIAssistantScreen() {
  const isDark = useColorScheme() === "dark";
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "ai",
      text: "Here are some tips to improve your resume:\n\n1. Add a strong summary\n2. Highlight your projects\n3. Use action verbs\n4. Quantify your impact\n\nWould you like me to review your resume?",
    },
  ]);

  const scrollViewRef = useRef<ScrollView>(null);
  const { sendMessage, isSendingMessage } = useChat();

  const handleSend = async () => {
    if (!inputText.trim() || isSendingMessage) return;

    const userMsgText = inputText.trim();
    setInputText("");

    // Append user message
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: userMsgText,
    };

    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await sendMessage(userMsgText);

      if (response.success && response.reply) {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          sender: "ai",
          text: response.reply,
        };
        setMessages((prev) => [...prev, aiMessage]);
      } else {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          sender: "ai",
          text:
            response.error ||
            "Sorry, I encountered an error processing your request.",
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch (err) {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: "Network error. Please check your connection and try again.",
      };
      setMessages((prev) => [...prev, errorMsg]);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, isDark ? styles.darkBg : styles.lightBg]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        onContentSizeChange={() =>
          scrollViewRef.current?.scrollToEnd({ animated: true })
        }
      >
        {/* Intro */}
        <View style={styles.aiIntro}>
          <View style={styles.aiAvatar}>
            <Ionicons name="sparkles" size={24} color="#FFFFFF" />
          </View>
          <Text
            style={[
              styles.aiTitle,
              isDark ? styles.darkText : styles.lightText,
            ]}
          >
            Hello there! 👋
          </Text>
          <Text style={styles.aiSub}>
            I'm your AI career assistant. How can I help you today?
          </Text>
        </View>

        {/* Dynamic Message List */}
        {messages.map((msg) => {
          if (msg.sender === "user") {
            return (
              <View key={msg.id} style={styles.userBubble}>
                <Text style={styles.userBubbleText}>{msg.text}</Text>
              </View>
            );
          } else {
            return (
              <View
                key={msg.id}
                style={[
                  styles.aiBubble,
                  isDark ? styles.darkCard : styles.lightCard,
                ]}
              >
                <Text
                  style={[
                    styles.aiBubbleText,
                    isDark ? styles.darkText : styles.lightText,
                  ]}
                >
                  {msg.text}
                </Text>
              </View>
            );
          }
        })}

        {/* Typing Indicator */}
        {isSendingMessage && (
          <View
            style={[
              styles.aiBubble,
              styles.typingBubble,
              isDark ? styles.darkCard : styles.lightCard,
            ]}
          >
            <View style={styles.typingIndicator}>
              <View
                style={[styles.dot, isDark ? styles.darkDot : styles.lightDot]}
              />
              <View
                style={[
                  styles.dot,
                  styles.dotMiddle,
                  isDark ? styles.darkDot : styles.lightDot,
                ]}
              />
              <View
                style={[styles.dot, isDark ? styles.darkDot : styles.lightDot]}
              />
            </View>
          </View>
        )}
      </ScrollView>

      {/* Floating Input Area */}
      <View style={styles.inputBar}>
        <ThemedInput
          placeholder="Type a message..."
          value={inputText}
          onChangeText={setInputText}
          style={styles.chatInput}
          onSubmitEditing={handleSend}
          returnKeyType="send"
        />
        <TouchableOpacity
          style={[styles.sendButton, isSendingMessage && styles.disabledButton]}
          onPress={handleSend}
          disabled={isSendingMessage}
        >
          <Ionicons name="arrow-up" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16 },
  lightBg: { backgroundColor: "#FFFFFF" },
  darkBg: { backgroundColor: "#111827" },
  messagesContainer: { flex: 1 },
  messagesContent: { paddingBottom: 24 },
  aiIntro: { alignItems: "center", marginVertical: 24 },
  aiAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#006837",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  aiTitle: { fontSize: 18, fontWeight: "700" },
  aiSub: { color: "#6B7280", fontSize: 13, marginTop: 4, textAlign: "center" },
  userBubble: {
    alignSelf: "flex-end",
    backgroundColor: "#006837",
    padding: 14,
    borderRadius: 16,
    borderBottomRightRadius: 2,
    maxWidth: "80%",
    marginVertical: 8,
  },
  userBubbleText: { color: "#FFFFFF", fontSize: 14 },
  aiBubble: {
    alignSelf: "flex-start",
    padding: 14,
    borderRadius: 16,
    borderBottomLeftRadius: 2,
    maxWidth: "85%",
    marginVertical: 8,
    borderWidth: 1,
  },
  typingBubble: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  typingIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    height: 16,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#6B7280",
    opacity: 0.4,
  },
  dotMiddle: {
    opacity: 0.7,
  },
  lightDot: { backgroundColor: "#4B5563" },
  darkDot: { backgroundColor: "#9CA3AF" },
  lightCard: { backgroundColor: "#F9FAFB", borderColor: "#E5E7EB" },
  darkCard: { backgroundColor: "#1F2937", borderColor: "#374151" },
  aiBubbleText: { fontSize: 14, lineHeight: 20 },
  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    gap: 8,
  },
  chatInput: { flex: 1, marginVertical: 0 },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#006837",
    justifyContent: "center",
    alignItems: "center",
  },
  disabledButton: {
    opacity: 0.6,
  },
  lightText: { color: "#111827" },
  darkText: { color: "#FFFFFF" },
});
