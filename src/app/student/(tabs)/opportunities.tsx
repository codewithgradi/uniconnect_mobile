import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { Href, useRouter } from "expo-router";
import { ThemedInput } from "../../../components/ThemedInput";

export default function OpportunitiesScreen() {
  const isDark = useColorScheme() === "dark";
  const router = useRouter();
  const [filter, setFilter] = useState("All");

  const filters = ["All", "Internships", "Jobs", "Part-time"];

  const opportunities = [
    {
      id: "1",
      title: "Mobile App Developer Intern",
      company: "CodeLabs",
      location: "Cape Town, South Africa",
      type: "Internship",
      posted: "Posted 1h ago",
    },
    {
      id: "2",
      title: "Junior Frontend Developer",
      company: "CreativeTech",
      location: "Johannesburg, South Africa",
      type: "Full-time",
      posted: "Posted 3h ago",
    },
    {
      id: "3",
      title: "Data Science Intern",
      company: "DataNova",
      location: "Pretoria, South Africa",
      type: "Internship",
      posted: "Posted 5h ago",
    },
  ];

  const handleCardPress = (id: string) => {
    router.push(`student/opportunities/${id}` as Href);
  };

  return (
    <ScrollView
      style={[styles.container, isDark ? styles.darkBg : styles.lightBg]}
    >
      {/* Search Input */}
      <View style={{ marginTop: 16 }}>
        <ThemedInput placeholder="Search opportunities..." />
      </View>

      {/* Filter Chips */}
      <View style={styles.filterRow}>
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
      </View>

      {/* Opportunity Cards */}
      {opportunities.map((item) => (
        <TouchableOpacity
          key={item.id}
          activeOpacity={0.7}
          onPress={() => handleCardPress(item.id)}
          style={[styles.card, isDark ? styles.darkCard : styles.lightCard]}
        >
          <Text
            style={[styles.title, isDark ? styles.darkText : styles.lightText]}
          >
            {item.title}
          </Text>
          <Text style={styles.company}>{item.company}</Text>
          <Text style={styles.location}>{item.location}</Text>

          <View style={styles.cardFooter}>
            <Text style={styles.badge}>{item.type}</Text>
            <Text style={styles.posted}>{item.posted}</Text>
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
  filterRow: { flexDirection: "row", gap: 8, marginVertical: 16 },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
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
  company: { color: "#4B5563", fontSize: 14, marginTop: 2 },
  location: { color: "#9CA3AF", fontSize: 12, marginTop: 2 },
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
});
