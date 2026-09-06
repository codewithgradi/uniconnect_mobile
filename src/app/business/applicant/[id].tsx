import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function ApplicantDetailsScreen() {
  const isDark = useColorScheme() === "dark";

  return (
    <ScrollView
      style={[styles.container, isDark ? styles.darkBg : styles.lightBg]}
      showsVerticalScrollIndicator={false}
    >
      {/* Profile Summary Header */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>SJ</Text>
        </View>
        <Text
          style={[styles.name, isDark ? styles.darkText : styles.lightText]}
        >
          Sarah Johnson
        </Text>
        <Text style={styles.subText}>sarah.johnson@uct.ac.za</Text>
        <Text style={styles.subText}>Cape Town, South Africa</Text>
      </View>

      {/* Skills Section */}
      <Text style={styles.sectionHeader}>Skills</Text>
      <View style={styles.skillsRow}>
        {["Flutter", "Dart", "Firebase", "UI/UX"].map((skill) => (
          <View key={skill} style={styles.skillChip}>
            <Text style={styles.skillText}>{skill}</Text>
          </View>
        ))}
      </View>

      {/* Projects Section */}
      <Text style={styles.sectionHeader}>Projects</Text>
      <View
        style={[
          styles.projectCard,
          isDark ? styles.darkCard : styles.lightCard,
        ]}
      >
        <Text
          style={[
            styles.projectTitle,
            isDark ? styles.darkText : styles.lightText,
          ]}
        >
          EduLink Mobile App
        </Text>
        <Text style={styles.projectDesc}>
          A campus app built with Flutter and Firebase.
        </Text>
      </View>

      <View
        style={[
          styles.projectCard,
          isDark ? styles.darkCard : styles.lightCard,
        ]}
      >
        <Text
          style={[
            styles.projectTitle,
            isDark ? styles.darkText : styles.lightText,
          ]}
        >
          Task Manager App
        </Text>
        <Text style={styles.projectDesc}>A productivity app for students.</Text>
      </View>

      {/* Action Footer Buttons */}
      <View style={styles.footerRow}>
        <TouchableOpacity style={styles.shortlistBtn}>
          <Text style={styles.shortlistBtnText}>Shortlist</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.messageBtn}>
          <Ionicons name="chatbubble-outline" size={18} color="#006837" />
          <Text style={styles.messageBtnText}>Message</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20 },
  lightBg: { backgroundColor: "#FFFFFF" },
  darkBg: { backgroundColor: "#111827" },
  header: { alignItems: "center", marginVertical: 20 },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#006837",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  avatarText: { color: "#FFFFFF", fontSize: 24, fontWeight: "700" },
  name: { fontSize: 20, fontWeight: "700" },
  subText: { fontSize: 13, color: "#6B7280", marginTop: 2 },
  sectionHeader: {
    fontSize: 13,
    fontWeight: "700",
    color: "#9CA3AF",
    textTransform: "uppercase",
    marginTop: 18,
    marginBottom: 8,
  },
  skillsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  skillChip: {
    backgroundColor: "#E6F0EB",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  skillText: { color: "#006837", fontSize: 12, fontWeight: "600" },
  projectCard: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
  },
  projectTitle: { fontSize: 15, fontWeight: "700" },
  projectDesc: { fontSize: 13, color: "#6B7280", marginTop: 4 },
  footerRow: { flexDirection: "row", gap: 12, marginTop: 24, marginBottom: 40 },
  shortlistBtn: {
    flex: 1,
    backgroundColor: "#006837",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  shortlistBtnText: { color: "#FFFFFF", fontSize: 15, fontWeight: "700" },
  messageBtn: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: "#006837",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
  },
  messageBtnText: { color: "#006837", fontSize: 15, fontWeight: "700" },
  lightCard: { backgroundColor: "#F9FAFB", borderColor: "#E5E7EB" },
  darkCard: { backgroundColor: "#1F2937", borderColor: "#374151" },
  lightText: { color: "#111827" },
  darkText: { color: "#FFFFFF" },
});
