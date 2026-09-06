import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  useColorScheme,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ThemedInput } from "../../components/ThemedInput";
import { ThemedButtonPrimary } from "@/components/ThemedButton";
import { UserRole } from "./role";

// Changed to default export
export default function RegisterScreen() {
  const isDark = useColorScheme() === "dark";
  const router = useRouter();
  const params = useLocalSearchParams<{ role?: UserRole }>();
  const userType = params.role || "Student";

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    programme: "",
    companyName: "",
    studentNumber: "",
  });

  const isAcademicRole = userType === "Student" || userType === "Alumni";
  const isBusinessRole = userType === "Business";

  const handleRegister = () => {
    if (userType === "Student") {
      router.push({
        pathname: "/(auth)/verification",
        params: { email: formData.email },
      });
    }
  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        isDark ? styles.darkBg : styles.lightBg,
      ]}
    >
      <View style={styles.header}>
        <Text
          style={[styles.title, isDark ? styles.darkText : styles.lightText]}
        >
          Create {userType} Account
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
          title="Register"
          onPress={handleRegister}
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
