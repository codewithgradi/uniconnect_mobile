import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ThemedInput } from "../../components/ThemedInput";

export default function AIAssistantScreen() {
  const isDark = useColorScheme() === "dark";
  const [inputText, setInputText] = useState("");

  return (
    <View style={[styles.container, isDark ? styles.darkBg : styles.lightBg]}>
      <ScrollView style={styles.messagesContainer}>
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
            Hello Sarah! 👋
          </Text>
          <Text style={styles.aiSub}>
            I'm your AI career assistant. How can I help you today?
          </Text>
        </View>

        {/* User Bubble */}
        <View style={styles.userBubble}>
          <Text style={styles.userBubbleText}>
            Help me improve my resume for internship applications.
          </Text>
        </View>

        {/* AI Response Bubble */}
        <View
          style={[styles.aiBubble, isDark ? styles.darkCard : styles.lightCard]}
        >
          <Text
            style={[
              styles.aiBubbleText,
              isDark ? styles.darkText : styles.lightText,
            ]}
          >
            Here are some tips to improve your resume:
            {"\n\n"}1. Add a strong summary
            {"\n"}2. Highlight your projects
            {"\n"}3. Use action verbs
            {"\n"}4. Quantify your impact
            {"\n\n"}Would you like me to review your resume?
          </Text>
        </View>
      </ScrollView>

      {/* Floating Input Area */}
      <View style={styles.inputBar}>
        <ThemedInput
          placeholder="Type a message..."
          value={inputText}
          onChangeText={setInputText}
          style={styles.chatInput}
        />
        <TouchableOpacity style={styles.sendButton}>
          <Ionicons name="arrow-up" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16 },
  lightBg: { backgroundColor: "#FFFFFF" },
  darkBg: { backgroundColor: "#111827" },
  messagesContainer: { flex: 1 },
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
  lightText: { color: "#111827" },
  darkText: { color: "#FFFFFF" },
});
