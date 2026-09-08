import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  useColorScheme,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { usePosts } from "@/api/hooks/usePosts";

export default function ModerationScreen() {
  const isDark = useColorScheme() === "dark";
  const {
    posts,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = usePosts();

  if (isLoading) {
    return (
      <View
        style={[
          styles.container,
          styles.centered,
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
          Loading feed moderation queue...
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, isDark ? styles.darkBg : styles.lightBg]}>
      {/* Header Summary */}
      <View style={styles.headerBox}>
        <Text
          style={[
            styles.headerTitle,
            isDark ? styles.darkText : styles.lightText,
          ]}
        >
          Feed Moderation ({posts.length})
        </Text>
        <Text style={styles.headerSub}>
          Monitor and moderate user posts published across the platform feed.
        </Text>
      </View>

      {/* Feed List */}
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.card, isDark ? styles.darkCard : styles.lightCard]}
          >
            <View style={styles.cardHeader}>
              <View style={styles.authorBadge}>
                <Ionicons name="person-outline" size={14} color="#006837" />
                <Text style={styles.authorText}>Author: {item.author}</Text>
              </View>
              <Text style={styles.dateText}>{item.createdAt}</Text>
            </View>

            <Text
              style={[
                styles.contentBody,
                isDark ? styles.darkText : styles.lightText,
              ]}
              numberOfLines={3}
            >
              {item.content}
            </Text>

            <View style={styles.footerRow}>
              <View style={styles.statsGroup}>
                <View style={styles.statItem}>
                  <Ionicons name="heart-outline" size={14} color="#DC2626" />
                  <Text style={styles.statText}>{item.likes}</Text>
                </View>
                <View style={styles.statItem}>
                  <Ionicons
                    name="chatbubble-outline"
                    size={14}
                    color="#0284C7"
                  />
                  <Text style={styles.statText}>{item.comments.length}</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isFetchingNextPage ? (
            <View style={styles.footerLoader}>
              <ActivityIndicator size="small" color="#006837" />
              <Text
                style={[
                  styles.loadingMoreText,
                  isDark ? styles.darkText : styles.lightText,
                ]}
              >
                Loading more posts...
              </Text>
            </View>
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons
              name="shield-checkmark-outline"
              size={48}
              color="#006837"
            />
            <Text
              style={[
                styles.emptyTitle,
                isDark ? styles.darkText : styles.lightText,
              ]}
            >
              Feed Clean!
            </Text>
            <Text style={styles.emptySub}>
              There are currently no active posts to review.
            </Text>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 16 },
  centered: { justifyContent: "center", alignItems: "center" },
  lightBg: { backgroundColor: "#FFFFFF" },
  darkBg: { backgroundColor: "#111827" },
  headerBox: { marginBottom: 16 },
  headerTitle: { fontSize: 18, fontWeight: "800" },
  headerSub: { fontSize: 12, color: "#6B7280", marginTop: 2 },
  loadingText: { marginTop: 12, fontSize: 13, fontWeight: "600" },
  card: { padding: 14, borderRadius: 12, borderWidth: 1, marginBottom: 12 },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  authorBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#E6F0EB",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  authorText: { fontSize: 11, fontWeight: "700", color: "#006837" },
  dateText: { fontSize: 11, color: "#9CA3AF" },
  contentBody: { fontSize: 13, lineHeight: 18, marginBottom: 12 },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  statsGroup: { flexDirection: "row", gap: 12 },
  statItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  statText: { fontSize: 12, color: "#6B7280", fontWeight: "600" },
  footerLoader: {
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  loadingMoreText: { fontSize: 12, fontWeight: "600" },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 60,
    gap: 8,
  },
  emptyTitle: { fontSize: 16, fontWeight: "700" },
  emptySub: { fontSize: 12, color: "#9CA3AF", textAlign: "center" },
  lightCard: { backgroundColor: "#F9FAFB", borderColor: "#E5E7EB" },
  darkCard: { backgroundColor: "#1F2937", borderColor: "#374151" },
  lightText: { color: "#111827" },
  darkText: { color: "#FFFFFF" },
});
