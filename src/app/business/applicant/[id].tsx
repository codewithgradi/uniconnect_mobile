import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  useColorScheme,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ThemedInput } from "@/components/ThemedInput";
import { useOpportunityWithApplications } from "@/api/hooks/useOpportunity";

export default function OpportunityDetailScreen() {
  const params = useLocalSearchParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const router = useRouter();
  const isDark = useColorScheme() === "dark";

  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: opportunity,
    isLoading,
    error,
  } = useOpportunityWithApplications(id ?? "");

  const applicants = opportunity?.applicants ?? [];

  const filteredApplicants = applicants.filter(
    (item) =>
      `${item.firstName} ${item.lastName}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      item.systemHeadline?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const renderApplicantItem = ({ item }: { item: any }) => {
    return (
      <TouchableOpacity
        style={[
          styles.applicantCard,
          isDark ? styles.darkCard : styles.lightCard,
        ]}
        activeOpacity={0.7}
        onPress={() => {
          const applicantId =
            item.userProfileId || item.profileId || item.userId || item.id;

          if (!applicantId) {
            Alert.alert("Error", "No valid ID found for this applicant.");
            return;
          }

          router.push(`/business/user/${applicantId}` as any);
        }}
      >
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {item.firstName?.[0]}
            {item.lastName?.[0]}
          </Text>
        </View>
        <View style={styles.applicantInfo}>
          <Text
            style={[
              styles.applicantName,
              isDark ? styles.darkText : styles.lightText,
            ]}
          >
            {item.firstName} {item.lastName}
          </Text>
          <Text
            style={[
              styles.headline,
              isDark ? styles.darkSubText : styles.lightSubText,
            ]}
            numberOfLines={1}
          >
            {item.systemHeadline}
          </Text>
          <Text style={styles.programmeText}>{item.aboutBio}</Text>
        </View>
        <Ionicons
          name="chevron-forward"
          size={18}
          color={isDark ? "#4B5563" : "#9CA3AF"}
        />
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          isDark ? styles.darkBg : styles.lightBg,
          styles.centerLoader,
        ]}
      >
        <ActivityIndicator size="large" color="#006837" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          isDark ? styles.darkBg : styles.lightBg,
          styles.centerLoader,
        ]}
      >
        <Text
          style={[
            styles.sectionHeader,
            isDark ? styles.darkText : styles.lightText,
          ]}
        >
          Failed to load opportunity data.
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, isDark ? styles.darkBg : styles.lightBg]}
    >
      <FlatList
        data={filteredApplicants}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderApplicantItem}
        contentContainerStyle={styles.listContainer}
        ListHeaderComponent={
          <View style={styles.headerContainer}>
            <Text style={styles.sectionTitle}>Opportunity Metadata</Text>
            <View
              style={[
                styles.oppInfoBox,
                isDark ? styles.darkCard : styles.lightCard,
              ]}
            >
              <Text
                style={[
                  styles.oppIdText,
                  isDark ? styles.darkSubText : styles.lightSubText,
                ]}
              >
                Title: {opportunity?.title}
              </Text>
              <Text
                style={[
                  styles.oppIdText,
                  isDark ? styles.darkSubText : styles.lightSubText,
                ]}
              >
                Description: {opportunity?.description}
              </Text>
              <Text
                style={[
                  styles.sectionHeader,
                  isDark ? styles.darkText : styles.lightText,
                ]}
              >
                Applicants List ({applicants.length})
              </Text>
            </View>

            <Text style={styles.sectionTitle}>Filter Candidates</Text>
            <View style={styles.searchWrapper}>
              <ThemedInput
                placeholder="Search candidates by name..."
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20 },
  lightBg: { backgroundColor: "#FFFFFF" },
  darkBg: { backgroundColor: "#111827" },
  centerLoader: { justifyContent: "center", alignItems: "center" },
  headerContainer: { marginBottom: 4 },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#9CA3AF",
    textTransform: "uppercase",
    marginTop: 20,
    marginBottom: 10,
  },
  oppInfoBox: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  oppIdText: {
    fontSize: 12,
    marginBottom: 4,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: "800",
  },
  searchWrapper: {
    marginBottom: 4,
  },
  listContainer: {
    paddingBottom: 32,
  },
  applicantCard: {
    flexDirection: "row",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    marginBottom: 10,
  },
  lightCard: { backgroundColor: "#F9FAFB", borderColor: "#E5E7EB" },
  darkCard: { backgroundColor: "#1F2937", borderColor: "#374151" },
  avatarContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#00683722",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    color: "#006837",
    fontWeight: "800",
    fontSize: 15,
  },
  applicantInfo: {
    flex: 1,
    marginRight: 8,
  },
  applicantName: {
    fontSize: 15,
    fontWeight: "800",
  },
  headline: {
    fontSize: 13,
    marginTop: 2,
  },
  programmeText: {
    fontSize: 11,
    color: "#006837",
    fontWeight: "700",
    marginTop: 4,
  },
  lightText: { color: "#111827" },
  darkText: { color: "#FFFFFF" },
  lightSubText: { color: "#6B7280" },
  darkSubText: { color: "#9CA3AF" },
  loader: { marginVertical: 16 },
});
