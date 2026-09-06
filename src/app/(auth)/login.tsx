import { ThemedButtonPrimary } from "@/components/ThemedButton";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { ThemedInput } from "../../components/ThemedInput";

// Changed to default export
export default function LoginScreen() {
  const isDark = useColorScheme() === "dark";
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View style={[styles.container, isDark ? styles.darkBg : styles.lightBg]}>
      <View style={styles.header}>
        <Text
          style={[styles.title, isDark ? styles.darkText : styles.lightText]}
        >
          Welcome Back
        </Text>
        <Text style={styles.subtitle}>
          Sign in to access your Richfield portal
        </Text>
      </View>

      <View style={styles.form}>
        <ThemedInput
          placeholder="Email Address"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <ThemedInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.forgotBtn}>
          <Text style={styles.forgotText}>Forgot Password?</Text>
        </TouchableOpacity>

        <ThemedButtonPrimary
          title="Sign In"
          onPress={() => {}}
          style={{ marginTop: 24 }}
        />
      </View>

      <TouchableOpacity
        style={styles.footerLink}
        onPress={() => router.push("/(auth)/role")}
      >
        <Text style={styles.footerText}>
          Don't have an account? <Text style={styles.linkText}>Register</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "space-between",
    paddingVertical: 48,
  },
  lightBg: { backgroundColor: "#FFFFFF" },
  darkBg: { backgroundColor: "#111827" },
  header: { marginTop: 24 },
  title: { fontSize: 28, fontWeight: "700" },
  subtitle: { fontSize: 15, color: "#6B7280", marginTop: 8 },
  lightText: { color: "#111827" },
  darkText: { color: "#FFFFFF" },
  form: { flex: 1, justifyContent: "center" },
  forgotBtn: { alignSelf: "flex-end", marginTop: 8 },
  forgotText: { color: "#006837", fontSize: 14, fontWeight: "500" },
  footerLink: { alignItems: "center" },
  footerText: { color: "#6B7280", fontSize: 14 },
  linkText: { color: "#006837", fontWeight: "600" },
});
