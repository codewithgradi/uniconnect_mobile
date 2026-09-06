import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function ProfileSettingsScreen() {
  const isDark = useColorScheme() === "dark";

  // Toggle States
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [darkModeToggle, setDarkModeToggle] = useState(isDark);

  return (
    <ScrollView
      style={[styles.container, isDark ? styles.darkBg : styles.lightBg]}
      showsVerticalScrollIndicator={false}
    >
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>GP</Text>
        </View>
        <Text
          style={[styles.userName, isDark ? styles.darkText : styles.lightText]}
        >
          Gradi Puata
        </Text>
        <Text style={styles.userRole}>
          BSc in Information Technology • Year 2
        </Text>
      </View>

      {/* Account Settings Section */}
      <Text style={styles.sectionHeader}>Account</Text>
      <View style={[styles.card, isDark ? styles.darkCard : styles.lightCard]}>
        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.itemLeft}>
            <Ionicons name="person-outline" size={20} color="#006837" />
            <Text
              style={[
                styles.itemText,
                isDark ? styles.darkText : styles.lightText,
              ]}
            >
              Personal Information
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.itemLeft}>
            <Ionicons name="lock-closed-outline" size={20} color="#006837" />
            <Text
              style={[
                styles.itemText,
                isDark ? styles.darkText : styles.lightText,
              ]}
            >
              Security & Password
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
        </TouchableOpacity>
      </View>

      {/* Preferences Section */}
      <Text style={styles.sectionHeader}>Preferences</Text>
      <View style={[styles.card, isDark ? styles.darkCard : styles.lightCard]}>
        <View style={styles.settingItem}>
          <View style={styles.itemLeft}>
            <Ionicons name="notifications-outline" size={20} color="#006837" />
            <Text
              style={[
                styles.itemText,
                isDark ? styles.darkText : styles.lightText,
              ]}
            >
              Push Notifications
            </Text>
          </View>
          <Switch
            value={pushNotifications}
            onValueChange={setPushNotifications}
            trackColor={{ false: "#D1D5DB", true: "#006837" }}
          />
        </View>

        <View style={styles.divider} />

        <View style={styles.settingItem}>
          <View style={styles.itemLeft}>
            <Ionicons name="mail-outline" size={20} color="#006837" />
            <Text
              style={[
                styles.itemText,
                isDark ? styles.darkText : styles.lightText,
              ]}
            >
              Email Notifications
            </Text>
          </View>
          <Switch
            value={emailAlerts}
            onValueChange={setEmailAlerts}
            trackColor={{ false: "#D1D5DB", true: "#006837" }}
          />
        </View>

        <View style={styles.divider} />

        <View style={styles.settingItem}>
          <View style={styles.itemLeft}>
            <Ionicons name="moon-outline" size={20} color="#006837" />
            <Text
              style={[
                styles.itemText,
                isDark ? styles.darkText : styles.lightText,
              ]}
            >
              Dark Theme
            </Text>
          </View>
          <Switch
            value={darkModeToggle}
            onValueChange={setDarkModeToggle}
            trackColor={{ false: "#D1D5DB", true: "#006837" }}
          />
        </View>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutBtn}>
        <Ionicons name="log-out-outline" size={20} color="#EF4444" />
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20 },
  lightBg: { backgroundColor: "#FFFFFF" },
  darkBg: { backgroundColor: "#111827" },
  profileHeader: { alignItems: "center", marginVertical: 24 },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#006837",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  avatarText: { color: "#FFFFFF", fontSize: 24, fontWeight: "700" },
  userName: { fontSize: 20, fontWeight: "700" },
  userRole: { fontSize: 13, color: "#6B7280", marginTop: 4 },
  sectionHeader: {
    fontSize: 13,
    fontWeight: "700",
    color: "#9CA3AF",
    textTransform: "uppercase",
    marginBottom: 8,
    marginLeft: 4,
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  lightCard: { backgroundColor: "#F9FAFB", borderColor: "#E5E7EB" },
  darkCard: { backgroundColor: "#1F2937", borderColor: "#374151" },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
  },
  itemLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  itemText: { fontSize: 15, fontWeight: "500" },
  divider: { height: 1, backgroundColor: "#E5E7EB33" },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#FEE2E2",
    marginBottom: 40,
  },
  logoutText: { color: "#EF4444", fontSize: 15, fontWeight: "700" },
  lightText: { color: "#111827" },
  darkText: { color: "#FFFFFF" },
});
