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
import { useLocalSearchParams, useRouter } from "expo-router";
import { ThemedInput } from "../../components/ThemedInput";
import { ThemedButtonPrimary } from "@/components/ThemedButton";
import { UserRole } from "./role";
import { useRegister, useSendOtp } from "@/api/hooks/useAuth";
import { UserType } from "@/api/auth";

export default function RegisterScreen() {
  const isDark = useColorScheme() === "dark";
  const router = useRouter();
  const params = useLocalSearchParams<{ role?: UserRole }>();
  const rawRole = params.role || "Student";
  const userType = rawRole.toLowerCase() as UserType;

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    programme: "",
    companyName: "",
    studentNumber: "",
  });

  const { mutate: register, isPending: isRegistering } = useRegister();
  const { mutate: sendOtp, isPending: isSendingOtp } = useSendOtp();

  const isAcademicRole = userType === "student" || userType === "alumni";
  const isBusinessRole = userType === "business";
  const isLoading = isRegistering || isSendingOtp;

  const showNotification = (title: string, message: string) => {
    if (Platform.OS === "web") {
      window.alert(`${title}: ${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

  const handleRegister = () => {
    console.log("👉 1. Register Button Pressed");
    console.log("Payload:", { ...formData, userType });

    if (!formData.email || !formData.password) {
      console.warn("❌ Validation Failed: Missing Email or Password");
      showNotification("Validation Error", "Email and password are required.");
      return;
    }

    const payload = {
      email: formData.email,
      password: formData.password,
      userType,
      firstName: isAcademicRole ? formData.firstName : undefined,
      lastName: isAcademicRole ? formData.lastName : undefined,
      programme: isAcademicRole ? formData.programme : undefined,
      studentNumber: isAcademicRole ? formData.studentNumber : undefined,
      companyName: isBusinessRole ? formData.companyName : undefined,
    };

    console.log("👉 2. Dispatching register mutation...");

    register(payload, {
      onSuccess: (data) => {
        console.log("✅ 3. Registration Successful Response:", data);

        sendOtp(
          { email: formData.email },
          {
            onSuccess: () => {
              console.log("✅ 4. OTP Sent successfully. Navigating...");
              router.push({
                pathname: "/(auth)/verification",
                params: { email: formData.email },
              });
            },
            onError: (err: any) => {
              console.error("❌ 4. OTP Dispatch Failed:", err);
              showNotification(
                "Account Created",
                "Account created, but failed to send verification code. Proceeding to verification page.",
              );
              router.push({
                pathname: "/(auth)/verification",
                params: { email: formData.email },
              });
            },
          },
        );
      },
      onError: (err: any) => {
        console.error("❌ 3. Registration Request Failed:", err);
        const message =
          err?.response?.data?.detail ||
          err?.response?.data?.message ||
          err?.message ||
          "Registration failed. Check connection or inputs.";
        showNotification("Registration Failed", message);
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
          Create {rawRole} Account
        </Text>
        <Text style={styles.subtitle}>
          Enter your details below to register
        </Text>
      </View>

      <View style={styles.form}>
        <ThemedInput
          placeholder="Email Address"
          value={formData.email}
          onChangeText={(v) => setFormData({ ...formData, email: v })}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <ThemedInput
          placeholder="Password"
          value={formData.password}
          onChangeText={(v) => setFormData({ ...formData, password: v })}
          secureTextEntry
        />

        {isAcademicRole && (
          <>
            <ThemedInput
              placeholder="First Name"
              value={formData.firstName}
              onChangeText={(v) => setFormData({ ...formData, firstName: v })}
            />
            <ThemedInput
              placeholder="Last Name"
              value={formData.lastName}
              onChangeText={(v) => setFormData({ ...formData, lastName: v })}
            />
            <ThemedInput
              placeholder="Student Number"
              value={formData.studentNumber}
              onChangeText={(v) =>
                setFormData({ ...formData, studentNumber: v })
              }
            />
            <ThemedInput
              placeholder="Programme (e.g., BSc IT)"
              value={formData.programme}
              onChangeText={(v) => setFormData({ ...formData, programme: v })}
            />
          </>
        )}

        {isBusinessRole && (
          <ThemedInput
            placeholder="Company Name"
            value={formData.companyName}
            onChangeText={(v) => setFormData({ ...formData, companyName: v })}
          />
        )}

        <ThemedButtonPrimary
          title={isLoading ? "Creating Account..." : "Register"}
          onPress={handleRegister}
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
