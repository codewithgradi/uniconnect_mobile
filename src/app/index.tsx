import React from "react";
import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  TouchableOpacity,
  Pressable,

} from "react-native";
import { Link, useRouter } from "expo-router";
import { ThemedButtonPrimary } from "@/components/ThemedButton";

// Changed to default export
export default function WelcomeScreen() {
  const isDark = useColorScheme() === "dark";
  const router = useRouter();

  return (
    <View style={[styles.container, isDark ? styles.darkBg : styles.lightBg]}>
      <View style={styles.content}>
        <Text style={[styles.brand, { color: "#006837" }]}>RICHFIELD</Text>
        <Text
          style={[styles.subtitle, isDark ? styles.darkSub : styles.lightSub]}
        >
          Graduate Institute of Technology
        </Text>
      </View>

      <View style={styles.footer}>
        <ThemedButtonPrimary
          title="Get Started"
          onPress={() => router.push("/(auth)/role")}
        />

        <TouchableOpacity
          style={styles.linkWrapper}
          onPress={() => router.push("/(auth)/login")}
        >
          <Text
            style={[
              styles.linkText,
              isDark ? styles.darkText : styles.lightText,
            ]}
          >
            I already have an account
          </Text>
        </TouchableOpacity>
        {/* Temporary Dev Button */}
        <Link href="/student/home" asChild>
          <Pressable
            style={{ padding: 12, backgroundColor: "#007AFF", borderRadius: 8 }}
          >
            <Text style={{ color: "white", fontWeight: "bold" }}>
              DEV: Go to /students
            </Text>
          </Pressable>
        </Link>
        <Link href="/admin/dashboard" asChild>
          <Pressable
            style={{ padding: 12, backgroundColor: "#007AFF", borderRadius: 8 }}
          >
            <Text style={{ color: "white", fontWeight: "bold" }}>
              DEV: Go to /admin
            </Text>
          </Pressable>
        </Link>
        <Link href="/business/home" asChild>
          <Pressable
            style={{ padding: 12, backgroundColor: "#007AFF", borderRadius: 8 }}
          >
            <Text style={{ color: "white", fontWeight: "bold" }}>
              DEV: Go to /business
            </Text>
          </Pressable>
        </Link>
      </View>
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
  content: { flex: 1, justifyContent: "center", alignItems: "center" },
  brand: { fontSize: 36, fontWeight: "800", letterSpacing: 2 },
  subtitle: { fontSize: 16, marginTop: 8, textAlign: "center" },
  lightSub: { color: "#4B5563" },
  darkSub: { color: "#9CA3AF" },
  footer: { width: "100%", alignItems: "center" },
  linkWrapper: { marginTop: 16, paddingVertical: 8 },
  linkText: { fontSize: 15, fontWeight: "500" },
  lightText: { color: "#006837" },
  darkText: { color: "#008748" },
});
