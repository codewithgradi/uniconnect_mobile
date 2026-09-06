import { ThemedButtonPrimary } from "@/components/ThemedButton";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { ThemedButtonSecondary } from "../../components/ThemedButtonSecondary";
import { ThemedInput } from "../../components/ThemedInput";

// Changed to default export
export default function EmailVerificationScreen() {
  const isDark = useColorScheme() === "dark";
  const params = useLocalSearchParams<{ email?: string }>();
  const email = params.email || "student@richfield.ac.za";
  const [code, setCode] = useState("");

  return (
    <View style={[styles.container, isDark ? styles.darkBg : styles.lightBg]}>
      <View style={styles.header}>
        <Text
          style={[styles.title, isDark ? styles.darkText : styles.lightText]}
        >
          Verify Email
        </Text>
        <Text style={styles.subtitle}>
          We sent a verification code to{" "}
          <Text style={styles.emailHighlight}>{email}</Text>
        </Text>
      </View>

      <View style={styles.form}>
        <ThemedInput
          placeholder="6-Digit Verification Code"
          value={code}
          onChangeText={setCode}
          keyboardType="number-pad"
          maxLength={6}
          style={{ textAlign: "center", letterSpacing: 8, fontSize: 20 }}
        />

        <ThemedButtonPrimary
          title="Verify Code"
          onPress={() => {}}
          style={{ marginTop: 20 }}
        />
        <ThemedButtonSecondary title="Resend Email" onPress={() => {}} />
      </View>

      <TouchableOpacity style={styles.helpText}>
        <Text style={styles.subtleText}>
          Need help with student verification?
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
  subtitle: { fontSize: 15, color: "#6B7280", marginTop: 8, lineHeight: 22 },
  emailHighlight: { color: "#006837", fontWeight: "600" },
  lightText: { color: "#111827" },
  darkText: { color: "#FFFFFF" },
  form: { flex: 1, justifyContent: "center" },
  helpText: { alignItems: "center" },
  subtleText: { color: "#9CA3AF", fontSize: 13 },
});
