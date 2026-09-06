import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ThemedInput } from "../../components/ThemedInput";

// Matching your C# EventDto
export interface EventDto {
  Id: string; // Guid
  Title: string;
  Description: string;
  EventDate: string; // DateTime ISO string
}

// Sample Data matching EventDto structure
const MOCK_EVENTS: EventDto[] = [
  {
    Id: "e1a3b4c5-6d7e-8f90-1a2b-3c4d5e6f7a8b",
    Title: "Tech Talk: The Future of AI in Higher Ed",
    Description:
      "Join industry experts as they discuss how Artificial Intelligence is reshaping modern learning and industry applications.",
    EventDate: new Date(Date.now() + 86400000 * 2).toISOString(), // 2 days from now
  },
  {
    Id: "f2b4c6d8-0e1f-2a3b-4c5d-6e7f8a9b0c1d",
    Title: "Alumni Networking Evening 2026",
    Description:
      "Connect with Richfield graduates working across top tech and business firms in South Africa.",
    EventDate: new Date(Date.now() + 86400000 * 5).toISOString(), // 5 days from now
  },
  {
    Id: "a3c5e7g9-1h2i-3j4k-5l6m-7n8o9p0q1r2s",
    Title: "CV & Career Readiness Workshop",
    Description:
      "Get real-time feedback on your resume, cover letter, and LinkedIn profile from career advisors.",
    EventDate: new Date().toISOString(), // Today
  },
  {
    Id: "b4d6f8h0-2i3j-4k5l-6m7n-8o9p0q1r2s3t",
    Title: "Richfield Innovation Hackathon",
    Description:
      "Annual coding challenge focused on solving real-world campus and community challenges.",
    EventDate: new Date(Date.now() - 86400000 * 7).toISOString(), // 7 days ago
  },
];

export default function EventsScreen() {
  const isDark = useColorScheme() === "dark";
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"Upcoming" | "Today" | "Past">(
    "Upcoming",
  );

  // Date Formatting Helper
  const formatEventDate = (isoString: string) => {
    const date = new Date(isoString);
    const day = date.toLocaleDateString("en-ZA", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    const time = date.toLocaleTimeString("en-ZA", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return { day, time };
  };

  // Filter Logic
  const filteredEvents = MOCK_EVENTS.filter((event) => {
    const eventDate = new Date(event.EventDate);
    const now = new Date();
    const matchesSearch =
      event.Title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.Description.toLowerCase().includes(searchQuery.toLowerCase());

    const isToday = eventDate.toDateString() === now.toDateString();
    const isUpcoming = eventDate > now && !isToday;
    const isPast = eventDate < now && !isToday;

    if (!matchesSearch) return false;
    if (activeTab === "Today") return isToday;
    if (activeTab === "Upcoming") return isUpcoming || isToday;
    if (activeTab === "Past") return isPast;
    return true;
  });

  const renderEventCard = ({ item }: { item: EventDto }) => {
    const { day, time } = formatEventDate(item.EventDate);

    return (
      <View style={[styles.card, isDark ? styles.darkCard : styles.lightCard]}>
        <View style={styles.cardHeader}>
          <View style={styles.dateBadge}>
            <Ionicons name="calendar-outline" size={14} color="#006837" />
            <Text style={styles.dateBadgeText}>{day}</Text>
          </View>
          <View style={styles.timeBadge}>
            <Ionicons name="time-outline" size={14} color="#6B7280" />
            <Text style={styles.timeBadgeText}>{time}</Text>
          </View>
        </View>

        <Text
          style={[styles.title, isDark ? styles.darkText : styles.lightText]}
        >
          {item.Title}
        </Text>
        <Text style={styles.description} numberOfLines={3}>
          {item.Description}
        </Text>

        <View style={styles.cardFooter}>
          <TouchableOpacity style={styles.actionBtn}>
            <Text style={styles.actionBtnText}>View Details</Text>
            <Ionicons name="chevron-forward" size={16} color="#006837" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, isDark ? styles.darkBg : styles.lightBg]}>
      {/* Search Input */}
      <View style={styles.searchContainer}>
        <ThemedInput
          placeholder="Search events..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Filter Tabs */}
      <View style={styles.tabRow}>
        {(["Upcoming", "Today", "Past"] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tabChip,
              activeTab === tab
                ? styles.activeTabChip
                : isDark
                  ? styles.darkTabChip
                  : styles.lightTabChip,
            ]}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab
                  ? styles.activeTabText
                  : isDark
                    ? styles.darkText
                    : styles.lightText,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Events List */}
      <FlatList
        data={filteredEvents}
        keyExtractor={(item) => item.Id}
        renderItem={renderEventCard}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="calendar-sharp" size={48} color="#9CA3AF" />
            <Text style={styles.emptyText}>No events found</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20 },
  lightBg: { backgroundColor: "#FFFFFF" },
  darkBg: { backgroundColor: "#111827" },
  searchContainer: { marginTop: 16 },
  tabRow: { flexDirection: "row", gap: 10, marginVertical: 16 },
  tabChip: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  lightTabChip: { backgroundColor: "#F3F4F6", borderColor: "#E5E7EB" },
  darkTabChip: { backgroundColor: "#1F2937", borderColor: "#374151" },
  activeTabChip: { backgroundColor: "#006837", borderColor: "#006837" },
  tabText: { fontSize: 13, fontWeight: "600" },
  activeTabText: { color: "#FFFFFF" },
  listContent: { paddingBottom: 24 },
  card: { padding: 16, borderRadius: 12, borderWidth: 1, marginBottom: 14 },
  lightCard: { backgroundColor: "#F9FAFB", borderColor: "#E5E7EB" },
  darkCard: { backgroundColor: "#1F2937", borderColor: "#374151" },
  cardHeader: { flexDirection: "row", gap: 12, marginBottom: 10 },
  dateBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#E6F0EB",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  dateBadgeText: { color: "#006837", fontSize: 12, fontWeight: "700" },
  timeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 4,
  },
  timeBadgeText: { color: "#6B7280", fontSize: 12, fontWeight: "500" },
  title: { fontSize: 16, fontWeight: "700", marginBottom: 6 },
  description: { color: "#6B7280", fontSize: 14, lineHeight: 20 },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 14,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB33",
  },
  actionBtn: { flexDirection: "row", alignItems: "center", gap: 4 },
  actionBtnText: { color: "#006837", fontSize: 13, fontWeight: "600" },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 60,
  },
  emptyText: { color: "#9CA3AF", fontSize: 15, marginTop: 10 },
  lightText: { color: "#111827" },
  darkText: { color: "#FFFFFF" },
});
