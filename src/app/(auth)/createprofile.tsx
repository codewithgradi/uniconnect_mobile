import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  useColorScheme,
  Alert,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { ThemedInput } from "../../components/ThemedInput";
import { ThemedButtonPrimary } from "@/components/ThemedButton";
import { useCreateBusinessProfile } from "@/api/hooks/useBusiness"; // Update path if needed

export default function CreateBusinessProfileScreen() {
  const isDark = useColorScheme() === "dark";
  const router = useRouter();

  const [formData, setFormData] = useState({
    companyName: "",
    registrationNumber: "",
    industry: "",
    websiteUrl: "",
  });

  const { mutate: createBusinessProfile, isPending: isLoading } =
    useCreateBusinessProfile();

  const showNotification = (title: string, message: string) => {
    if (Platform.OS === "web") {
      window.alert(`${title}: ${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

  const handleCreateProfile = () => {
    if (!formData.companyName || !formData.registrationNumber) {
      showNotification(
        "Validation Error",
        "Company name and registration number are required.",
      );
      return;
    }

    const payload = {
      companyName: formData.companyName,
      registrationNumber: formData.registrationNumber,
      industry: formData.industry,
      websiteUrl: formData.websiteUrl,
    };

    createBusinessProfile(payload, {
      onSuccess: () => {
        showNotification("Success", "Business profile created successfully!");
        router.replace("/business/home");
      },
      onError: (err: any) => {
        const message =
          err?.message ||
          "Failed to create business profile. Please try again.";
        showNotification("Error", message);
      },
    });
  };

  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={[
        styles.container,
        isDark ? styles.darkBg : styles.lightBg,
      ]}
    >
      <View style={styles.header}>
        <Text
          style={[styles.title, isDark ? styles.darkText : styles.lightText]}
        >
          Create Business Profile
        </Text>
        <Text style={styles.subtitle}>
          Enter your company details below to complete your setup
        </Text>
      </View>

      <View style={styles.form}>
        <ThemedInput
          placeholder="Company Name"
          value={formData.companyName}
          onChangeText={(v) => setFormData({ ...formData, companyName: v })}
        />
        <ThemedInput
          placeholder="Registration Number"
          value={formData.registrationNumber}
          onChangeText={(v) =>
            setFormData({ ...formData, registrationNumber: v })
          }
        />
        <ThemedInput
          placeholder="Industry (e.g., FinTech, Software)"
          value={formData.industry}
          onChangeText={(v) => setFormData({ ...formData, industry: v })}
        />
        <ThemedInput
          placeholder="Website URL"
          value={formData.websiteUrl}
          onChangeText={(v) => setFormData({ ...formData, websiteUrl: v })}
          autoCapitalize="none"
          keyboardType="url"
        />

        <ThemedButtonPrimary
          title={isLoading ? "Saving Profile..." : "Save Business Profile"}
          onPress={handleCreateProfile}
          loading={isLoading}
          style={{ marginTop: 24 }}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    justifyContent: "space-between",
    paddingVertical: 48,
  },
  lightBg: { backgroundColor: "#FFFFFF" },
  darkBg: { backgroundColor: "#111827" },
  header: { marginTop: 24 },
  title: { fontSize: 26, fontWeight: "700" },
  subtitle: { fontSize: 14, color: "#6B7280", marginTop: 6 },
  lightText: { color: "#111827" },
  darkText: { color: "#FFFFFF" },
  form: { marginTop: 24, width: "100%" },
});
