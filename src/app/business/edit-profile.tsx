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
import { useCreateBusinessProfile } from "@/api/hooks/useBusiness"; // Update path to where your hooks are located

export default function EditCompanyProfileScreen() {
  const isDark = useColorScheme() === "dark";
  const router = useRouter();

  // Form states matching CreateBusinessDto
  const [companyName, setCompanyName] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [industry, setIndustry] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");

  const { mutate: createProfile, isPending: isSubmitting } =
    useCreateBusinessProfile();

  const handleSave = () => {
    if (!companyName.trim() || !industry.trim() || !registrationNumber.trim()) {
      Alert.alert(
        "Validation Error",
        "Company Name, Registration Number, and Industry are required.",
      );
      return;
    }

    createProfile(
      {
        companyName: companyName.trim(),
        registrationNumber: registrationNumber.trim(),
        industry: industry.trim(),
        websiteUrl: websiteUrl.trim(),
      },
      {
        onSuccess: () => {
          Alert.alert(
            "Profile Created",
            "Company details saved successfully.",
            [{ text: "OK", onPress: () => router.back() }],
          );
        },
        onError: (error) => {
          Alert.alert(
            "Error",
            error.message || "Failed to create business profile.",
          );
        },
      },
    );
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
          <Text style={styles.label}>Registration Number *</Text>
          <TextInput
            style={[
              styles.input,
              isDark ? styles.darkInput : styles.lightInput,
              isDark ? styles.darkText : styles.lightText,
            ]}
            value={registrationNumber}
            onChangeText={setRegistrationNumber}
            placeholder="e.g. 2023/123456/07"
            placeholderTextColor="#9CA3AF"
            autoCapitalize="none"
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
