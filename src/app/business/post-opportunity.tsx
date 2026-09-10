import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { ThemedInput } from "../../components/ThemedInput";
import { useCreateOpportunity } from "@/api/hooks/useOpportunity"; // Update path if needed

interface PostOpportunityScreenProps {
  businessId: string;
}

export default function PostOpportunityScreen({
  businessId,
}: PostOpportunityScreenProps) {
  const isDark = useColorScheme() === "dark";
  const router = useRouter();

  const [title, setTitle] = useState("Flutter Developer Intern");
  const [description, setDescription] = useState(
    "We're looking for a passionate Flutter developer intern to join our mobile team...",
  );
  const [targetProgramme, setTargetProgramme] = useState(
    "Software Engineering Bootcamp",
  );

  const { mutate: createOpportunity, isPending } = useCreateOpportunity();

  const handlePublish = () => {
    if (!title || !description || !targetProgramme) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }

    createOpportunity(
      {
        businessProfileId: businessId,
        Title: title,
        Description: description,
        TargetProgramme: targetProgramme,
      } as any,
      {
        onSuccess: () => {
          Alert.alert("Success", "Opportunity published successfully!");
          router.back();
        },
        onError: (error: any) => {
          Alert.alert(
            "Error",
            error?.message ||
              "Failed to publish opportunity. Please try again.",
          );
        },
      },
    );
  };

  return (
    <ScrollView
      style={[styles.container, isDark ? styles.darkBg : styles.lightBg]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.label}>Job Title</Text>
      <ThemedInput
        value={title}
        onChangeText={setTitle}
        placeholder="e.g. .NET Developer"
      />

      <Text style={styles.label}>Description</Text>
      <ThemedInput
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
        style={styles.textArea}
        placeholder="Enter long description..."
      />

      <Text style={styles.label}>Target Program</Text>
      <ThemedInput
        value={targetProgramme}
        onChangeText={setTargetProgramme}
        placeholder="e.g. Software Engineering Bootcamp"
      />

      <TouchableOpacity
        style={[styles.publishBtn, isPending && styles.disabledBtn]}
        onPress={handlePublish}
        disabled={isPending}
      >
        {isPending ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.publishBtnText}>Publish</Text>
        )}
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
  disabledBtn: {
    opacity: 0.7,
  },
  publishBtnText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
});
