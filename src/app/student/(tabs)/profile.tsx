import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { ThemedButtonSecondary } from "@/components/ThemedButtonSecondary";

export default function StudentProfileScreen() {
  const isDark = useColorScheme() === "dark";
  const skills = [
    "Flutter",
    "Dart",
    "Python",
    "Firebase",
    "UI/UX Design",
    "Machine Learning",
  ];

  return (
    <ScrollView
      style={[styles.container, isDark ? styles.darkBg : styles.lightBg]}
    >
      {/* Hero Header */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarLarge}>
          <Text style={styles.avatarLargeText}>SJ</Text>
        </View>
        <Text
          style={[styles.name, isDark ? styles.darkText : styles.lightText]}
        >
          Sarah Johnson
        </Text>
        <Text style={styles.headline}>Computer Science Student</Text>
        <Text style={styles.institution}>University of Cape Town</Text>

        <ThemedButtonSecondary
          title="Edit Profile"
          style={styles.editBtn}
          textStyle={{ fontSize: 14 }}
        />
      </View>

      {/* Stats Counter */}
      <View
        style={[styles.statsRow, isDark ? styles.darkCard : styles.lightCard]}
      >
        <View style={styles.statItem}>
          <Text
            style={[
              styles.statNumber,
              isDark ? styles.darkText : styles.lightText,
            ]}
          >
            124
          </Text>
          <Text style={styles.statLabel}>Connections</Text>
        </View>
        <View style={styles.statItem}>
          <Text
            style={[
              styles.statNumber,
              isDark ? styles.darkText : styles.lightText,
            ]}
          >
            32
          </Text>
          <Text style={styles.statLabel}>Endorsements</Text>
        </View>
        <View style={styles.statItem}>
          <Text
            style={[
              styles.statNumber,
              isDark ? styles.darkText : styles.lightText,
            ]}
          >
            18
          </Text>
          <Text style={styles.statLabel}>Posts</Text>
        </View>
      </View>

      {/* About Section */}
      <Text
        style={[
          styles.sectionTitle,
          isDark ? styles.darkText : styles.lightText,
        ]}
      >
        About
      </Text>
      <Text style={styles.bodyText}>
        Passionate Computer Science student interested in AI, mobile
        development, and building solutions that make an impact.
      </Text>

      {/* Skills Section */}
      <Text
        style={[
          styles.sectionTitle,
          isDark ? styles.darkText : styles.lightText,
        ]}
      >
        Skills
      </Text>
      <View style={styles.skillsWrapper}>
        {skills.map((skill, index) => (
          <View
            key={index}
            style={[
              styles.skillChip,
              isDark ? styles.darkChip : styles.lightChip,
            ]}
          >
            <Text
              style={[
                styles.skillText,
                isDark ? styles.darkText : styles.lightText,
              ]}
            >
              {skill}
            </Text>
          </View>
        ))}
        <TouchableOpacity style={styles.addSkillChip}>
          <Text style={styles.addSkillText}>+ Add Skill</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20 },
  lightBg: { backgroundColor: "#FFFFFF" },
  darkBg: { backgroundColor: "#111827" },
  profileHeader: { alignItems: "center", marginTop: 24 },
  avatarLarge: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: "#006837",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarLargeText: { color: "#FFFFFF", fontSize: 28, fontWeight: "700" },
  name: { fontSize: 22, fontWeight: "700", marginTop: 12 },
  headline: { color: "#4B5563", fontSize: 14, marginTop: 2 },
  institution: { color: "#9CA3AF", fontSize: 13, marginTop: 2 },
  editBtn: { width: 140, height: 38, marginTop: 14 },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginVertical: 20,
  },
  lightCard: { backgroundColor: "#F9FAFB", borderColor: "#E5E7EB" },
  darkCard: { backgroundColor: "#1F2937", borderColor: "#374151" },
  statItem: { alignItems: "center" },
  statNumber: { fontSize: 18, fontWeight: "700" },
  statLabel: { color: "#6B7280", fontSize: 12, marginTop: 2 },
  sectionTitle: { fontSize: 16, fontWeight: "700", marginBottom: 8 },
  bodyText: {
    color: "#4B5563",
    lineHeight: 20,
    fontSize: 14,
    marginBottom: 20,
  },
  skillsWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 30,
  },
  skillChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  lightChip: { backgroundColor: "#F3F4F6", borderColor: "#E5E7EB" },
  darkChip: { backgroundColor: "#374151", borderColor: "#4B5563" },
  skillText: { fontSize: 13, fontWeight: "500" },
  addSkillChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#006837",
    borderStyle: "dashed",
  },
  addSkillText: { color: "#006837", fontSize: 13, fontWeight: "600" },
  lightText: { color: "#111827" },
  darkText: { color: "#FFFFFF" },
});
