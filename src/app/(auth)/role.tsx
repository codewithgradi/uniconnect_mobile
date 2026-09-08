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

export type UserRole = "Student" | "Alumni" | "Business";

// Changed to default export
export default function RoleSelectionScreen() {
  const isDark = useColorScheme() === "dark";
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<UserRole>("Student");

  const roles: UserRole[] = ["Student", "Alumni", "Business"];

  const handleNext = () => {
    router.push({
      pathname: "/(auth)/register",
      params: { role: selectedRole },
    });
  };

  return (
    <View style={[styles.container, isDark ? styles.darkBg : styles.lightBg]}>
      <View style={styles.header}>
        <Text
          style={[styles.title, isDark ? styles.darkText : styles.lightText]}
        >
          Select Your Role
        </Text>
        <Text style={styles.subtitle}>
          Choose how you will be using the platform
        </Text>
      </View>

      <View style={styles.roleContainer}>
        {roles.map((role) => {
          const isSelected = selectedRole === role;
          return (
            <TouchableOpacity
              key={role}
              activeOpacity={0.7}
              style={[
                styles.roleCard,
                isDark ? styles.darkCard : styles.lightCard,
                isSelected && styles.selectedCard,
              ]}
              onPress={() => setSelectedRole(role)}
            >
              <Text
                style={[
                  styles.roleText,
                  isSelected
                    ? styles.selectedRoleText
                    : isDark
                      ? styles.darkRoleText
                      : styles.lightRoleText,
                ]}
              >
                {role}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ThemedButtonPrimary title="Continue" onPress={handleNext} />
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
  roleContainer: { flex: 1, justifyContent: "center" },
  roleCard: {
    height: 56,
    borderRadius: 10,
    borderWidth: 1.5,
    justifyContent: "center",
    paddingHorizontal: 20,
    marginVertical: 8,
  },
  lightCard: { backgroundColor: "#F9FAFB", borderColor: "#E5E7EB" },
  darkCard: { backgroundColor: "#1F2937", borderColor: "#374151" },
  selectedCard: { borderColor: "#006837", backgroundColor: "#F0FDF4" },
  roleText: { fontSize: 16, fontWeight: "600" },
  lightRoleText: { color: "#374151" },
  darkRoleText: { color: "#E5E7EB" },
  selectedRoleText: { color: "#006837" },
});
