import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  ActivityIndicator,
} from "react-native";
import { Href, useRouter } from "expo-router";
import { ThemedInput } from "../../../components/ThemedInput";
import { useActiveOpportunities } from "@/api/hooks/useOpportunity";

export default function OpportunitiesScreen() {
  const isDark = useColorScheme() === "dark";
  const router = useRouter();
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filters = ["All", "BSc IT", "Computer Science", "Information Systems"];

  const {
    data: opportunities = [],
    isLoading,
    error,
  } = useActiveOpportunities(filter === "All" ? undefined : filter);

  const handleCardPress = (id: string) => {
    router.push(`student/opportunities/${id}` as Href);
  };

  const filteredOpportunities = opportunities.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <ScrollView
      style={[styles.container, isDark ? styles.darkBg : styles.lightBg]}
      contentContainerStyle={{ paddingBottom: 30 }}
    >
      {/* Search Input */}
      <View style={{ marginTop: 16 }}>
        <ThemedInput
          placeholder="Search opportunities..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Filter Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
      >
        {filters.map((item) => (
          <TouchableOpacity
            key={item}
            style={[
              styles.filterChip,
              filter === item
                ? styles.activeFilter
                : isDark
                  ? styles.darkChip
                  : styles.lightChip,
            ]}
            onPress={() => setFilter(item)}
          >
            <Text
              style={[
                styles.filterText,
                filter === item
                  ? styles.activeFilterText
                  : isDark
                    ? styles.darkText
                    : styles.lightText,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Loading State */}
      {isLoading && (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#006837" />
          <Text style={[styles.mutedText, { marginTop: 12 }]}>
            Loading opportunities...
          </Text>
        </View>
      )}

      {/* Error State */}
      {error && (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>Failed to load opportunities.</Text>
        </View>
      )}

      {/* Empty State */}
      {!isLoading && !error && filteredOpportunities.length === 0 && (
        <View style={styles.centerContainer}>
          <Text
            style={[
              styles.mutedText,
              isDark ? styles.darkText : styles.lightText,
            ]}
          >
            No opportunities available.
          </Text>
        </View>
      )}

      {/* Opportunity Cards */}
      {!isLoading &&
        !error &&
        filteredOpportunities.map((item) => (
          <TouchableOpacity
            key={item.id}
            activeOpacity={0.7}
            onPress={() => handleCardPress(item.id)}
            style={[styles.card, isDark ? styles.darkCard : styles.lightCard]}
          >
            <Text
              style={[
                styles.title,
                isDark ? styles.darkText : styles.lightText,
              ]}
            >
              {item.title}
            </Text>
            <Text style={styles.company} numberOfLines={2}>
              {item.description}
            </Text>

            <View style={styles.cardFooter}>
              <Text style={styles.badge}>
                {item.targetProgramme || "General"}
              </Text>
              <Text style={styles.posted}>
                {new Date(item.createdAtUtc).toLocaleDateString()}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20 },
  lightBg: { backgroundColor: "#FFFFFF" },
  darkBg: { backgroundColor: "#111827" },
  centerContainer: { paddingVertical: 40, alignItems: "center" },
  filterRow: {
    flexDirection: "row",
    gap: 8,
    marginVertical: 16,
    paddingRight: 20,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    alignSelf: "flex-start",
  },
  lightChip: { backgroundColor: "#F3F4F6", borderColor: "#E5E7EB" },
  darkChip: { backgroundColor: "#1F2937", borderColor: "#374151" },
  activeFilter: { backgroundColor: "#006837", borderColor: "#006837" },
  filterText: { fontSize: 13, fontWeight: "500" },
  activeFilterText: { color: "#FFFFFF" },
  card: { padding: 16, borderRadius: 12, borderWidth: 1, marginBottom: 12 },
  lightCard: { backgroundColor: "#F9FAFB", borderColor: "#E5E7EB" },
  darkCard: { backgroundColor: "#1F2937", borderColor: "#374151" },
  title: { fontSize: 16, fontWeight: "700" },
  company: { color: "#4B5563", fontSize: 13, marginTop: 4 },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },
  badge: {
    color: "#006837",
    backgroundColor: "#E6F0EB",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    fontSize: 12,
    fontWeight: "600",
  },
  posted: { color: "#9CA3AF", fontSize: 11 },
  lightText: { color: "#111827" },
  darkText: { color: "#FFFFFF" },
  mutedText: { color: "#9CA3AF", fontSize: 14 },
  errorText: { color: "#EF4444", fontSize: 14 },
});
