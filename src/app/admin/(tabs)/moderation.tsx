import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  useColorScheme,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

export interface PostDto {
  Id: string;
  AuthorId: string;
  Content: string;
  CreatedAt: string;
  CommentCount: number;
  LikeCount: number;
}

const MOCK_POSTS: PostDto[] = [
  {
    Id: "e2a1b3c4-1111-4a12-8b33-111111111111",
    AuthorId: "u101",
    Content:
      "Hey everyone! Check out this new software developer internship opportunity posted on the board!",
    CreatedAt: "2026-09-06T14:30:00Z",
    CommentCount: 14,
    LikeCount: 42,
  },
  {
    Id: "f3b2c4d5-2222-4b23-9c44-222222222222",
    AuthorId: "u102",
    Content:
      "Looking for a study partner for the upcoming advanced database systems assessment.",
    CreatedAt: "2026-09-06T10:15:00Z",
    CommentCount: 5,
    LikeCount: 18,
  },
  {
    Id: "a4c3d5e6-3333-4c34-0d55-333333333333",
    AuthorId: "u103",
    Content:
      "Unverified promo link: Visit http://example-spam.com for free certification keys.",
    CreatedAt: "2026-09-05T18:45:00Z",
    CommentCount: 1,
    LikeCount: 0,
  },
];

export default function ModerationScreen() {
  const isDark = useColorScheme() === "dark";
  const [posts, setPosts] = useState<PostDto[]>(MOCK_POSTS);

 

 

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
          Feed Feed Moderation ({posts.length})
        </Text>
        <Text style={styles.headerSub}>
          Monitor and moderate user posts published across the platform feed.
        </Text>
      </View>

      {/* Feed List */}
      <FlatList
        data={posts}
        keyExtractor={(item) => item.Id}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.card, isDark ? styles.darkCard : styles.lightCard]}
          >
            <View style={styles.cardHeader}>
              <View style={styles.authorBadge}>
                <Ionicons name="person-outline" size={14} color="#006837" />
                <Text style={styles.authorText}>Author: {item.AuthorId}</Text>
              </View>
              <Text style={styles.dateText}>
                {new Date(item.CreatedAt).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                })}
              </Text>
            </View>

            <Text
              style={[
                styles.contentBody,
                isDark ? styles.darkText : styles.lightText,
              ]}
              numberOfLines={3}
            >
              {item.Content}
            </Text>

            <View style={styles.footerRow}>
              <View style={styles.statsGroup}>
                <View style={styles.statItem}>
                  <Ionicons name="heart-outline" size={14} color="#DC2626" />
                  <Text style={styles.statText}>{item.LikeCount}</Text>
                </View>
                <View style={styles.statItem}>
                  <Ionicons
                    name="chatbubble-outline"
                    size={14}
                    color="#0284C7"
                  />
                  <Text style={styles.statText}>{item.CommentCount}</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
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
  lightBg: { backgroundColor: "#FFFFFF" },
  darkBg: { backgroundColor: "#111827" },
  headerBox: { marginBottom: 16 },
  headerTitle: { fontSize: 18, fontWeight: "800" },
  headerSub: { fontSize: 12, color: "#6B7280", marginTop: 2 },
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
  deleteBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#FEE2E2",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  deleteBtnText: { color: "#DC2626", fontSize: 11, fontWeight: "700" },
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
