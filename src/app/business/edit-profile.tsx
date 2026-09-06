import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  useColorScheme,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

export interface BusinessProfileDto {
  Id: string;
  CompanyName: string;
  Industry: string;
  WebsiteUrl: string;
  Description?: string;
  Location?: string;
}

const INITIAL_PROFILE: BusinessProfileDto = {
  Id: "e8a719d3-3891-4e42-b054-61b6c0e81f18",
  CompanyName: "TechCorp Solutions",
  Industry: "Information Technology & Software",
  WebsiteUrl: "https://techcorp.example.com",
  Description:
    "Building innovative enterprise software solutions and connecting talent across tech ecosystems.",
  Location: "Johannesburg, South Africa",
};

export default function EditCompanyProfileScreen() {
  const isDark = useColorScheme() === "dark";
  const router = useRouter();

  const [companyName, setCompanyName] = useState(INITIAL_PROFILE.CompanyName);
  const [industry, setIndustry] = useState(INITIAL_PROFILE.Industry);
  const [websiteUrl, setWebsiteUrl] = useState(INITIAL_PROFILE.WebsiteUrl);
  const [description, setDescription] = useState(
    INITIAL_PROFILE.Description || "",
  );
  const [location, setLocation] = useState(INITIAL_PROFILE.Location || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = () => {
    if (!companyName.trim() || !industry.trim()) {
      Alert.alert(
        "Validation Error",
        "Company Name and Industry are required.",
      );
      return;
    }

    setIsSubmitting(true);

    const updatedProfile: BusinessProfileDto = {
      Id: INITIAL_PROFILE.Id,
      CompanyName: companyName.trim(),
      Industry: industry.trim(),
      WebsiteUrl: websiteUrl.trim(),
      Description: description.trim(),
      Location: location.trim(),
    };

    // Simulate API request delay
    setTimeout(() => {
      setIsSubmitting(false);
      Alert.alert("Profile Updated", "Company details updated successfully.", [
        { text: "OK", onPress: () => router.back() },
      ]);
    }, 600);
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, isDark ? styles.darkBg : styles.lightBg]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Company Logo Badge Header */}
        <View style={styles.avatarHeader}>
          <View style={styles.companyBadge}>
            <Ionicons name="business" size={36} color="#006837" />
          </View>
        </View>

        {/* Form Inputs */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Company Name *</Text>
          <TextInput
            style={[
              styles.input,
              isDark ? styles.darkInput : styles.lightInput,
              isDark ? styles.darkText : styles.lightText,
            ]}
            value={companyName}
            onChangeText={setCompanyName}
            placeholder="e.g. TechCorp Solutions"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Industry *</Text>
          <TextInput
            style={[
              styles.input,
              isDark ? styles.darkInput : styles.lightInput,
              isDark ? styles.darkText : styles.lightText,
            ]}
            value={industry}
            onChangeText={setIndustry}
            placeholder="e.g. Software & IT Services"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Website URL</Text>
          <TextInput
            style={[
              styles.input,
              isDark ? styles.darkInput : styles.lightInput,
              isDark ? styles.darkText : styles.lightText,
            ]}
            value={websiteUrl}
            onChangeText={setWebsiteUrl}
            placeholder="https://company.com"
            placeholderTextColor="#9CA3AF"
            keyboardType="url"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Location</Text>
          <TextInput
            style={[
              styles.input,
              isDark ? styles.darkInput : styles.lightInput,
              isDark ? styles.darkText : styles.lightText,
            ]}
            value={location}
            onChangeText={setLocation}
            placeholder="e.g. Durban, South Africa"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>About Company</Text>
          <TextInput
            style={[
              styles.textArea,
              isDark ? styles.darkInput : styles.lightInput,
              isDark ? styles.darkText : styles.lightText,
            ]}
            value={description}
            onChangeText={setDescription}
            placeholder="Brief overview of your company..."
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Action Buttons */}
        <TouchableOpacity
          style={[styles.saveBtn, isSubmitting && styles.disabledBtn]}
          onPress={handleSave}
          disabled={isSubmitting}
        >
          <Text style={styles.saveBtnText}>
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelBtn}
          onPress={() => router.back()}
        >
          <Text style={styles.cancelBtnText}>Cancel</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  lightBg: { backgroundColor: "#FFFFFF" },
  darkBg: { backgroundColor: "#111827" },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    paddingBottom: 40,
  },
  avatarHeader: { alignItems: "center", marginBottom: 24 },
  companyBadge: {
    width: 72,
    height: 72,
    borderRadius: 16,
    backgroundColor: "#E6F0EB",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  changeBadgeBtn: { flexDirection: "row", alignItems: "center", gap: 4 },
  changeBadgeText: { fontSize: 13, color: "#006837", fontWeight: "600" },
  formGroup: { marginBottom: 16 },
  label: {
    fontSize: 13,
    fontWeight: "700",
    color: "#6B7280",
    marginBottom: 6,
    textTransform: "uppercase",
  },
  input: {
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 14,
    fontSize: 14,
  },
  textArea: {
    height: 100,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingTop: 12,
    fontSize: 14,
  },
  lightInput: { backgroundColor: "#F9FAFB", borderColor: "#E5E7EB" },
  darkInput: { backgroundColor: "#1F2937", borderColor: "#374151" },
  lightText: { color: "#111827" },
  darkText: { color: "#FFFFFF" },
  saveBtn: {
    height: 50,
    borderRadius: 10,
    backgroundColor: "#006837",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
  },
  disabledBtn: { opacity: 0.6 },
  saveBtnText: { color: "#FFFFFF", fontSize: 15, fontWeight: "700" },
  cancelBtn: {
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  cancelBtnText: { color: "#6B7280", fontSize: 14, fontWeight: "600" },
});
