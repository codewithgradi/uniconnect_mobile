import { useMyBusinessProfile } from "@/api/hooks/useBusiness"; // Update path to where you saved your TanStack query file
import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Alert,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

export default function BusinessProfileScreen() {
  const isDark = useColorScheme() === "dark";
  const { data: profile, isLoading, error, refetch } = useMyBusinessProfile();

  const handleOpenWebsite = () => {
    if (profile?.websiteUrl) {
      Linking.openURL(profile.websiteUrl);
    }
  };
const handleLogout = async () => {
  const performLogout = async () => {
    try {
      console.log("Starting logout process...");
      await AsyncStorage.removeItem("token");
      console.log("Token removed, redirecting...");
      router.replace("/(auth)/login");
    } catch (error) {
      console.error("Logout execution error:", error);
      Alert.alert("Error", "Failed to log out properly.");
    }
  };

  if (Platform.OS === "web") {
    const confirmed = window.confirm("Are you sure you want to log out?");
    if (confirmed) {
      await performLogout();
    }
  } else {
    Alert.alert("Log Out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log Out",
        style: "destructive",
        onPress: () => {
          performLogout();
        },
      },
    ]);
  }
};

  if (isLoading) {
    return (
      <View
        style={[
          styles.centerContainer,
          isDark ? styles.darkBg : styles.lightBg,
        ]}
      >
        <ActivityIndicator size="large" color="#006837" />
        <Text
          style={[
            styles.loadingText,
            isDark ? styles.darkText : styles.lightText,
          ]}
        >
          Loading profile...
        </Text>
      </View>
    );
  }

  if (error || !profile) {
    return (
      <View
        style={[
          styles.centerContainer,
          isDark ? styles.darkBg : styles.lightBg,
        ]}
      >
        <Ionicons name="alert-circle-outline" size={48} color="#DC2626" />
        <Text
          style={[
            styles.errorTitle,
            isDark ? styles.darkText : styles.lightText,
          ]}
        >
          Could not load business profile
        </Text>
        <Text style={styles.errorSubText}>
          {error
            ? error.message
            : "No business profile found for this account."}
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, isDark ? styles.darkBg : styles.lightBg]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header Profile Card */}
      <View style={styles.header}>
        <View style={styles.companyBadge}>
          <Ionicons name="business" size={32} color="#006837" />
        </View>
        <Text
          style={[
            styles.companyName,
            isDark ? styles.darkText : styles.lightText,
          ]}
        >
          {profile.companyName}
        </Text>
        <Text style={styles.industryText}>{profile.industry}</Text>
      </View>

      {/* Account Info Details */}
      <Text style={styles.sectionTitle}>Company Information</Text>
      <View
        style={[styles.infoCard, isDark ? styles.darkCard : styles.lightCard]}
      >
        <View style={styles.infoRow}>
          <View style={styles.rowLeft}>
            <Ionicons name="briefcase-outline" size={18} color="#006837" />
            <Text style={styles.infoLabel}>Industry</Text>
          </View>
          <Text
            style={[
              styles.infoVal,
              isDark ? styles.darkText : styles.lightText,
            ]}
          >
            {profile.industry}
          </Text>
        </View>

        <View style={styles.divider} />

        <TouchableOpacity style={styles.infoRow} onPress={handleOpenWebsite}>
          <View style={styles.rowLeft}>
            <Ionicons name="globe-outline" size={18} color="#006837" />
            <Text style={styles.infoLabel}>Website</Text>
          </View>
          <Text style={styles.linkText}>
            {profile.websiteUrl
              ? profile.websiteUrl
                  .replace("https://", "")
                  .replace("http://", "")
              : "N/A"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Account Options */}
      <Text style={styles.sectionTitle}>Account Actions</Text>
      <View
        style={[styles.infoCard, isDark ? styles.darkCard : styles.lightCard]}
      >
        <TouchableOpacity
          style={styles.actionRow}
          onPress={() => router.push("/business/edit-profile")}
        >
          <Text
            style={[
              styles.actionText,
              isDark ? styles.darkText : styles.lightText,
            ]}
          >
            Edit Company Profile
          </Text>
          <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity style={styles.actionRow} onPress={handleLogout}>
          <Text style={{ color: "#DC2626", fontSize: 15, fontWeight: "600" }}>
            Log Out
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20 },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  lightBg: { backgroundColor: "#FFFFFF" },
  darkBg: { backgroundColor: "#111827" },
  header: { alignItems: "center", marginVertical: 24 },
  companyBadge: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: "#E6F0EB",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  companyName: { fontSize: 20, fontWeight: "800" },
  industryText: { fontSize: 13, color: "#6B7280", marginTop: 4 },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#9CA3AF",
    textTransform: "uppercase",
    marginTop: 16,
    marginBottom: 10,
  },
  infoCard: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
  },
  rowLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  infoLabel: { fontSize: 14, color: "#6B7280", fontWeight: "500" },
  infoVal: { fontSize: 14, fontWeight: "600" },
  linkText: { fontSize: 14, color: "#006837", fontWeight: "600" },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
  },
  actionText: { fontSize: 15, fontWeight: "500" },
  divider: { height: 1, backgroundColor: "#E5E7EB33" },
  lightCard: { backgroundColor: "#F9FAFB", borderColor: "#E5E7EB" },
  darkCard: { backgroundColor: "#1F2937", borderColor: "#374151" },
  lightText: { color: "#111827" },
  darkText: { color: "#FFFFFF" },
  loadingText: { marginTop: 12, fontSize: 14 },
  errorTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 12,
    textAlign: "center",
  },
  errorSubText: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 6,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#006837",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: { color: "#FFFFFF", fontWeight: "600" },
});
