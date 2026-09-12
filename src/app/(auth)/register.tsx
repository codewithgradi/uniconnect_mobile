import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  useColorScheme,
  Alert,
  Platform,
  KeyboardAvoidingView,
  TouchableOpacity,
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
  const [showPassword, setShowPassword] = useState(false);

  const { mutate: register, isPending: isRegistering } = useRegister();
  const { mutate: sendOtp, isPending: isSendingOtp } = useSendOtp();

  const isStudent = userType === "student";
  const isAlumni = userType === "alumni";
  const isBusinessRole = userType === "business";
  const isAcademicRole = isStudent || isAlumni;
  const isLoading = isRegistering || isSendingOtp;

  const showNotification = (title: string, message: string) => {
    if (Platform.OS === "web") {
      window.alert(`${title}: ${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

  const handleRegister = () => {
    if (isLoading) return;

    if (!formData.email || !formData.password) {
      showNotification("Validation Error", "Email and password are required.");
      return;
    }

    const formattedUserType = (userType.charAt(0).toUpperCase() +
      userType.slice(1).toLowerCase()) as UserType;

    const payload = {
      email: formData.email,
      password: formData.password,
      userType: formattedUserType,
      firstName: isAcademicRole ? formData.firstName : undefined,
      lastName: isAcademicRole ? formData.lastName : undefined,
      programme: isStudent ? formData.programme : undefined,
      studentNumber: isStudent ? formData.studentNumber : undefined,
      companyName: isBusinessRole ? formData.companyName : undefined,
    };

    register(payload, {
      onSuccess: () => {
        if (isStudent) {
          sendOtp(
            { email: formData.email },
            {
              onSuccess: () => {
                router.push({
                  pathname: "/(auth)/verification",
                  params: { email: formData.email },
                });
              },
              onError: () => {
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
        } else if (isAlumni) {
          showNotification(
            "Registration Successful",
            "Your alumni account has been created successfully. Please verify your certificate.",
          );
          router.replace({
            pathname: "/(auth)/certificate-scanner",
            params: { email: formData.email, password: formData.password },
          });
        } else {
          showNotification(
            "Registration Successful",
            "Your business account has been created successfully.",
          );
          router.replace({
            pathname: "/(auth)/login",
            params: { email: formData.email, password: formData.password },
          });
        }
      },
      onError: (err: any) => {
        let message = "Registration failed. Check connection or inputs.";
        const errorData = err?.response?.data;

        if (Array.isArray(errorData)) {
          message = errorData.map((e) => e.description).join("\n");
        } else {
          message =
            errorData?.detail || errorData?.message || err?.message || message;
        }

        setTimeout(() => {
          showNotification("Registration Failed", message);
        }, 100);
      },
    });
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, isDark ? styles.darkBg : styles.lightBg]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
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

          <View style={styles.passwordWrapper}>
            <View style={styles.passwordInputContainer}>
              <ThemedInput
                placeholder="Password"
                value={formData.password}
                onChangeText={(v) => setFormData({ ...formData, password: v })}
                secureTextEntry={!showPassword}
              />
            </View>
            <TouchableOpacity
              style={styles.eyeToggleBtn}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Text style={styles.eyeToggleText}>
                {showPassword ? "Hide" : "Show"}
              </Text>
            </TouchableOpacity>
          </View>

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
            </>
          )}

          {isStudent && (
            <>
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
            disabled={isLoading}
            style={{ marginTop: 24 }}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    justifyContent: "space-between",
    paddingTop: 60,
    paddingBottom: 48,
  },
  lightBg: { backgroundColor: "#FFFFFF" },
  darkBg: { backgroundColor: "#111827" },
  header: { marginBottom: 20 },
  title: { fontSize: 26, fontWeight: "700" },
  subtitle: { fontSize: 14, color: "#6B7280", marginTop: 6 },
  lightText: { color: "#111827" },
  darkText: { color: "#FFFFFF" },
  form: { marginTop: 12, width: "100%" },
  passwordWrapper: {
    position: "relative",
    justifyContent: "center",
    marginTop: 12,
  },
  passwordInputContainer: {
    width: "100%",
  },
  eyeToggleBtn: {
    position: "absolute",
    right: 16,
    top: 16,
    zIndex: 10,
    padding: 4,
  },
  eyeToggleText: {
    color: "#006837",
    fontSize: 14,
    fontWeight: "600",
  },
});
