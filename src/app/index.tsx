import React from "react";
import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ThemedButtonPrimary } from "@/components/ThemedButton";

export default function WelcomeScreen() {
  const isDark = useColorScheme() === "dark";
  const router = useRouter();

  return (
    <View style={[styles.container, isDark ? styles.darkBg : styles.lightBg]}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="school-outline" size={48} color="#006837" />
        </View>
        <Text style={styles.brand}>UNICONNECT</Text>
        <Text
          style={[styles.subtitle, isDark ? styles.darkSub : styles.lightSub]}
        >
          Where talent meets opportunity
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
          activeOpacity={0.7}
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
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "space-between",
    paddingVertical: 56,
  },
  lightBg: { backgroundColor: "#FFFFFF" },
  darkBg: { backgroundColor: "#0f172a" },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    width: 88,
    height: 88,
    borderRadius: 24,
    backgroundColor: "rgba(0, 104, 55, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(0, 104, 55, 0.2)",
  },
  brand: {
    fontSize: 32,
    fontWeight: "800",
    letterSpacing: 2,
    color: "#006837",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    marginTop: 8,
    textAlign: "center",
    fontWeight: "400",
  },
  lightSub: { color: "#4B5563" },
  darkSub: { color: "#94a3b8" },
  footer: {
    width: "100%",
    alignItems: "center",
    paddingBottom: 12,
  },
  linkWrapper: {
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  linkText: {
    fontSize: 15,
    fontWeight: "600",
  },
  lightText: { color: "#006837" },
  darkText: { color: "#34d399" },
});
