import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  useColorScheme,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ThemedInput } from "../../components/ThemedInput";
import {
  InstitutionalEventDto,
  useInstitutionalEvents,
} from "@/api/hooks/useEvent";

export default function EventsScreen() {
  const isDark = useColorScheme() === "dark";
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"Upcoming" | "Today" | "Past">(
    "Upcoming",
  );
  const [visibleCount, setVisibleCount] = useState(10);

  const { events, isLoading, isError, refetch, isRefetching } =
    useInstitutionalEvents();

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

  // Filter Logic and Sorting from Latest to Oldest
  const filteredEvents = events
    .filter((event) => {
      const eventDate = new Date(event.dateUtc);
      const now = new Date();
      const matchesSearch =
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase());

      const isToday = eventDate.toDateString() === now.toDateString();
      const isUpcoming = eventDate > now && !isToday;
      const isPast = eventDate < now && !isToday;

      if (!matchesSearch) return false;
      if (activeTab === "Today") return isToday;
      if (activeTab === "Upcoming") return isUpcoming || isToday;
      if (activeTab === "Past") return isPast;
      return true;
    })
    .sort(
      (a, b) => new Date(b.dateUtc).getTime() - new Date(a.dateUtc).getTime(),
    );

  // Paginated subset based on scroll visibility
  const paginatedEvents = filteredEvents.slice(0, visibleCount);

  const handleLoadMore = () => {
    if (visibleCount < filteredEvents.length) {
      setVisibleCount((prev) => prev + 10);
    }
  };

  const renderEventCard = ({ item }: { item: InstitutionalEventDto }) => {
    const eventDateStr = item.dateUtc || new Date().toISOString();
    const { day, time } = formatEventDate(eventDateStr);

    const title = item.title || "Untitled Event";
    const description = item.description || "";

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
          {title}
        </Text>
        <Text style={styles.description} numberOfLines={3}>
          {description}
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

  if (isLoading) {
    return (
      <View
        style={[
          styles.centerContainer,
          isDark ? styles.darkBg : styles.lightBg,
        ]}
      >
        <ActivityIndicator size="large" color="#006837" />
      </View>
    );
  }

  if (isError) {
    return (
      <View
        style={[
          styles.centerContainer,
          isDark ? styles.darkBg : styles.lightBg,
        ]}
      >
        <Ionicons name="alert-circle-outline" size={48} color="#9CA3AF" />
        <Text
          style={[
            styles.emptyText,
            isDark ? styles.darkText : styles.lightText,
          ]}
        >
          Failed to load campus events
        </Text>
        <TouchableOpacity style={styles.retryBtn} onPress={() => refetch()}>
          <Text style={styles.retryBtnText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, isDark ? styles.darkBg : styles.lightBg]}>
      {/* Search Input */}
      <View style={styles.searchContainer}>
        <ThemedInput
          placeholder="Search events..."
          value={searchQuery}
          onChangeText={(text) => {
            setSearchQuery(text);
            setVisibleCount(10);
          }}
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
            onPress={() => {
              setActiveTab(tab);
              setVisibleCount(10);
            }}
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

      {/* Events List with Lazy Loading */}
      <FlatList
        data={paginatedEvents}
        keyExtractor={(item) => item.id}
        renderItem={renderEventCard}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor="#006837"
          />
        }
        ListFooterComponent={
          visibleCount < filteredEvents.length ? (
            <View style={styles.footerLoader}>
              <ActivityIndicator size="small" color="#006837" />
            </View>
          ) : null
        }
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
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
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
  footerLoader: {
    paddingVertical: 16,
    alignItems: "center",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 60,
  },
  emptyText: { color: "#9CA3AF", fontSize: 15, marginTop: 10 },
  retryBtn: {
    marginTop: 16,
    backgroundColor: "#006837",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryBtnText: { color: "#FFFFFF", fontWeight: "600" },
  lightText: { color: "#111827" },
  darkText: { color: "#FFFFFF" },
});
