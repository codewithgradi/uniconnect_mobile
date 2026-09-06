import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { useRouter } from "expo-router";
import { ThemedInput } from "../../components/ThemedInput";

export default function PostOpportunityScreen() {
  const isDark = useColorScheme() === "dark";
  const router = useRouter();

  const [jobTitle, setJobTitle] = useState("Flutter Developer Intern");
  const [jobType, setJobType] = useState("Internship");
  const [location, setLocation] = useState("Cape Town, South Africa");
  const [description, setDescription] = useState(
    "We're looking for a passionate Flutter developer intern to join our mobile team...",
  );
  const [requirements, setRequirements] = useState(
    "• Basic knowledge of Flutter\n• Dart programming\n• Strong problem solving skills",
  );

  const handlePublish = () => {
    // Submit job logic
    router.back();
  };

  return (
    <ScrollView
      style={[styles.container, isDark ? styles.darkBg : styles.lightBg]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.label}>Job Title</Text>
      <ThemedInput
        value={jobTitle}
        onChangeText={setJobTitle}
        placeholder="e.g. .NET Developer"
      />

      <Text style={styles.label}>Job Type</Text>
      <ThemedInput
        value={jobType}
        onChangeText={setJobType}
        placeholder="e.g. Internship, Full-time"
      />

      <Text style={styles.label}>Location</Text>
      <ThemedInput
        value={location}
        onChangeText={setLocation}
        placeholder="e.g. Cape Town, Remote"
      />

      <Text style={styles.label}>Description</Text>
      <ThemedInput
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
        style={styles.textArea}
      />

      <Text style={styles.label}>Requirements</Text>
      <ThemedInput
        value={requirements}
        onChangeText={setRequirements}
        multiline
        numberOfLines={4}
        style={styles.textArea}
      />

      <TouchableOpacity style={styles.publishBtn} onPress={handlePublish}>
        <Text style={styles.publishBtnText}>Publish</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 16 },
  lightBg: { backgroundColor: "#FFFFFF" },
  darkBg: { backgroundColor: "#111827" },
  label: {
    fontSize: 13,
    fontWeight: "700",
    color: "#6B7280",
    marginTop: 12,
    marginBottom: 4,
  },
  textArea: { height: 90, textAlignVertical: "top" },
  publishBtn: {
    backgroundColor: "#006837",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 24,
    marginBottom: 40,
  },
  publishBtnText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
});
