import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  useColorScheme,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { usePosts } from "@/api/hooks/usePosts";

export default function FeedScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const {
    posts,
    isLoading,
    isError,
    refetch,
    isRefetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    createPost,
    isCreatingPost,
    toggleLike,
    addComment,
  } = usePosts();

  const [postContent, setPostContent] = useState("");
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(
    null,
  );
  const [commentText, setCommentText] = useState("");

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const handleCreatePost = async () => {
    if (!postContent.trim() || isCreatingPost) return;
    try {
      await createPost({ content: postContent.trim() });
      setPostContent("");
    } catch (error) {
      console.error("Failed to create post", error);
    }
  };

  const handleLikePost = async (postId: string, isCurrentlyLiked: boolean) => {
    if (isCurrentlyLiked) return; // Do not like again or make API request if already liked
    try {
      await toggleLike(postId);
    } catch (error) {
      console.error("Failed to like post", error);
    }
  };

  const handleAddComment = async (postId: string) => {
    if (!commentText.trim()) return;
    try {
      await addComment({ postId, content: commentText.trim() });
      setCommentText("");
      setActiveCommentPostId(null);
    } catch (error) {
      console.error("Failed to add comment", error);
    }
  };

  const theme = {
    bg: isDark ? "#111827" : "#006837",
    cardBg: isDark ? "#1F2937" : "#FFF",
    text: isDark ? "#FFFFFF" : "#111827",
    subText: isDark ? "#9CA3AF" : "#666",
    border: isDark ? "#374151" : "#EAEAEA",
    inputBg: isDark ? "#374151" : "#F1F3F4",
    commentBg: isDark ? "#374151" : "#F9F9F9",
  };

  if (isLoading) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: theme.bg }]}>
        <ActivityIndicator size="large" color="#FFF" />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: theme.bg }]}>
        <Text style={[styles.errorText, { color: theme.subText }]}>
          Failed to load feed. Pull down to retry.
        </Text>
        <TouchableOpacity
          style={[styles.retryButton, { backgroundColor: "#FFF" }]}
          onPress={() => refetch()}
        >
          <Text style={[styles.retryButtonText, { color: theme.bg }]}>
            Retry
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={[styles.container, { backgroundColor: theme.bg }]}
      keyboardVerticalOffset={90}
    >
      <FlatList
        data={posts}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        contentContainerStyle={styles.listContainer}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor="#FFF"
          />
        }
        ListHeaderComponent={
          <View
            style={[
              styles.composerContainer,
              {
                backgroundColor: theme.cardBg,
                borderBottomColor: theme.border,
              },
            ]}
          >
            <TextInput
              style={[styles.composerInput, { color: theme.text }]}
              placeholder="What's on your mind?"
              placeholderTextColor={isDark ? "#9CA3AF" : "#888"}
              multiline
              value={postContent}
              onChangeText={setPostContent}
            />
            <View style={styles.composerActions}>
              <TouchableOpacity
                style={[
                  styles.postButton,
                  { backgroundColor: "#006837" },
                  (!postContent.trim() || isCreatingPost) &&
                    styles.postButtonDisabled,
                ]}
                onPress={handleCreatePost}
                disabled={!postContent.trim() || isCreatingPost}
              >
                {isCreatingPost ? (
                  <ActivityIndicator size="small" color="#FFF" />
                ) : (
                  <Text style={styles.postButtonText}>Post</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        }
        renderItem={({ item: post }) => {
          const fullName = `${post.firstname} ${post.lastname}`.trim();
          const displayName =
            fullName.length > 0 ? fullName : post.userEmail || "Unknown User";
          const avatarLetter = displayName.charAt(0).toUpperCase();

          return (
            <View
              style={[
                styles.postCard,
                {
                  backgroundColor: theme.cardBg,
                  borderBottomColor: theme.border,
                },
              ]}
            >
              {/* Author Info */}
              <View style={styles.postHeader}>
                <View
                  style={[
                    styles.avatarPlaceholder,
                    { backgroundColor: "#006837" },
                  ]}
                >
                  <Text style={styles.avatarText}>{avatarLetter}</Text>
                </View>
                <View style={styles.authorMeta}>
                  <Text style={[styles.authorName, { color: theme.text }]}>
                    {displayName}
                  </Text>
                  <Text style={[styles.authorHandle, { color: theme.subText }]}>
                    {post.userEmail} • {post.createdAt}
                  </Text>
                </View>
              </View>

              {/* Post Content */}
              <Text style={[styles.postContent, { color: theme.text }]}>
                {post.content}
              </Text>

              {/* Post Actions (Like Count / Comment Count from DTO) */}
              <View
                style={[styles.postFooter, { borderTopColor: theme.border }]}
              >
                <TouchableOpacity
                  style={styles.actionButton}
                  activeOpacity={0.7}
                  onPress={() => handleLikePost(post.id, post.isLiked)}
                >
                  <Ionicons
                    name={post.isLiked ? "heart" : "heart-outline"}
                    size={20}
                    color={post.isLiked ? "#E0245E" : theme.subText}
                  />
                  <Text
                    style={[
                      styles.actionText,
                      { color: theme.subText },
                      post.isLiked && styles.activeActionText,
                    ]}
                  >
                    {post.likeCount}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.actionButton}
                  activeOpacity={0.7}
                  onPress={() =>
                    setActiveCommentPostId(
                      activeCommentPostId === post.id ? null : post.id,
                    )
                  }
                >
                  <Ionicons
                    name="chatbubble-outline"
                    size={18}
                    color={theme.subText}
                  />
                  <Text style={[styles.actionText, { color: theme.subText }]}>
                    {post.commentCount}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Comments Section (Rendered if populated via separate state/DTO expansion if available) */}
              {post.comments && post.comments.length > 0 && (
                <View
                  style={[
                    styles.commentsContainer,
                    { backgroundColor: theme.commentBg },
                  ]}
                >
                  {post.comments.map((comment: any) => (
                    <View key={comment.id} style={styles.commentItem}>
                      <Text
                        style={[styles.commentAuthor, { color: theme.text }]}
                      >
                        {comment.author}{" "}
                        <Text
                          style={[
                            styles.commentContent,
                            { color: isDark ? "#D1D5DB" : "#444" },
                          ]}
                        >
                          {comment.content}
                        </Text>
                      </Text>
                    </View>
                  ))}
                </View>
              )}

              {/* Comment Input Drawer */}
              {activeCommentPostId === post.id && (
                <View style={styles.commentComposer}>
                  <TextInput
                    style={[
                      styles.commentInput,
                      {
                        backgroundColor: theme.inputBg,
                        color: theme.text,
                      },
                    ]}
                    placeholder="Write a comment..."
                    placeholderTextColor={isDark ? "#9CA3AF" : "#888"}
                    value={commentText}
                    onChangeText={setCommentText}
                  />
                  <TouchableOpacity
                    style={[
                      styles.commentSendButton,
                      { backgroundColor: "#006837" },
                    ]}
                    activeOpacity={0.7}
                    onPress={() => handleAddComment(post.id)}
                  >
                    <Ionicons name="send" size={16} color="#FFF" />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          );
        }}
        ListFooterComponent={
          isFetchingNextPage ? (
            <View style={styles.footerLoader}>
              <ActivityIndicator size="small" color="#FFF" />
            </View>
          ) : null
        }
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 14,
    marginBottom: 12,
    textAlign: "center",
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    fontWeight: "600",
  },
  listContainer: {
    paddingBottom: 24,
  },
  composerContainer: {
    padding: 16,
    borderBottomWidth: 1,
    marginBottom: 8,
  },
  composerInput: {
    fontSize: 15,
    minHeight: 60,
    textAlignVertical: "top",
  },
  composerActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 8,
  },
  postButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 70,
    alignItems: "center",
  },
  postButtonDisabled: {
    opacity: 0.6,
  },
  postButtonText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 14,
  },
  postCard: {
    padding: 16,
    marginBottom: 8,
    borderBottomWidth: 1,
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  avatarPlaceholder: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  avatarText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  authorMeta: {
    flex: 1,
  },
  authorName: {
    fontSize: 14,
    fontWeight: "600",
  },
  authorHandle: {
    fontSize: 12,
    marginTop: 1,
  },
  postContent: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  postFooter: {
    flexDirection: "row",
    borderTopWidth: 1,
    paddingTop: 10,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 24,
  },
  actionText: {
    marginLeft: 6,
    fontSize: 13,
    fontWeight: "500",
  },
  activeActionText: {
    color: "#E0245E",
  },
  commentsContainer: {
    marginTop: 10,
    padding: 10,
    borderRadius: 8,
  },
  commentItem: {
    marginBottom: 6,
  },
  commentAuthor: {
    fontSize: 13,
    fontWeight: "600",
  },
  commentContent: {
    fontWeight: "normal",
  },
  commentComposer: {
    flexDirection: "row",
    marginTop: 10,
    alignItems: "center",
  },
  commentInput: {
    flex: 1,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    fontSize: 13,
    maxHeight: 80,
  },
  commentSendButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: "center",
  },
});
