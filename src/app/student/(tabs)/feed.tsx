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
  Image,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Video, ResizeMode } from "expo-av";
import * as ImagePicker from "expo-image-picker";
import { usePosts } from "@/api/hooks/usePosts";

export default function FeedScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  // State to control whether the quick tutorial modal is showing
  const [showTutorial, setShowTutorial] = useState(true);

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
  const [selectedMedia, setSelectedMedia] =
    useState<ImagePicker.ImagePickerAsset | null>(null);
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(
    null,
  );
  const [commentText, setCommentText] = useState("");

  const handlePickMedia = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: Platform.OS !== "web",
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setSelectedMedia(result.assets[0]);
    }
  };

  const handleCreatePost = async () => {
    if (!postContent.trim() && !selectedMedia) return;
    if (isCreatingPost) return;

    try {
      await createPost({
        content: postContent.trim(),
        media: selectedMedia,
      } as any);
      setPostContent("");
      setSelectedMedia(null);
    } catch (error) {
      console.error("Failed to create post", error);
    }
  };

  const handleLikePost = async (postId: string, isCurrentlyLiked: boolean) => {
    if (isCurrentlyLiked) return;
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
    bg: isDark ? "#0B0F17" : "#F3F4F6",
    cardBg: isDark ? "#161E2E" : "#FFFFFF",
    text: isDark ? "#F9FAFB" : "#111827",
    subText: isDark ? "#9CA3AF" : "#6B7280",
    border: isDark ? "#2D3748" : "#E5E7EB",
    inputBg: isDark ? "#222D40" : "#F9FAFB",
    commentBg: isDark ? "#1E293B" : "#F8FAFC",
  };

  if (isLoading) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: theme.bg }]}>
        <ActivityIndicator size="large" color="#006837" />
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
          style={[styles.retryButton, { backgroundColor: "#006837" }]}
          onPress={() => refetch()}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
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
      {/* QUICK TUTORIAL MODAL */}
      <Modal visible={showTutorial} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>👋 Welcome to UniConnect!</Text>
            <Text style={styles.modalText}>
              • Share posts or drop media using the box at the top.{"\n\n"}• Tap
              the heart icon to like posts.{"\n\n"}• Pull down anytime to
              refresh your feed.
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setShowTutorial(false)}
            >
              <Text style={styles.modalButtonText}>Got it, let's go!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <FlatList
        data={posts}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        contentContainerStyle={styles.listContainer}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) fetchNextPage();
        }}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor="#006837"
          />
        }
        ListHeaderComponent={
          <View
            style={[
              styles.composerContainer,
              { backgroundColor: theme.cardBg, borderColor: theme.border },
            ]}
          >
            <TextInput
              style={[styles.composerInput, { color: theme.text }]}
              placeholder="What's on your mind?"
              placeholderTextColor={isDark ? "#6B7280" : "#9CA3AF"}
              multiline
              value={postContent}
              onChangeText={setPostContent}
            />

            {selectedMedia && (
              <View style={styles.previewContainer}>
                {Platform.OS === "web" ? (
                  selectedMedia.type === "video" ||
                  selectedMedia.uri.match(/\.(mp4|mov|webm)$/i) ? (
                    // @ts-ignore
                    <video
                      src={selectedMedia.uri}
                      style={{
                        width: "100%",
                        height: 200,
                        objectFit: "cover",
                        borderRadius: 8,
                      }}
                      controls
                    />
                  ) : (
                    // @ts-ignore
                    <img
                      src={selectedMedia.uri}
                      style={{
                        width: "100%",
                        height: 200,
                        objectFit: "cover",
                        borderRadius: 8,
                      }}
                    />
                  )
                ) : selectedMedia.type === "video" ? (
                  <Video
                    source={{ uri: selectedMedia.uri }}
                    style={styles.previewMedia}
                    resizeMode={ResizeMode.COVER}
                    shouldPlay={false}
                  />
                ) : (
                  <Image
                    source={{ uri: selectedMedia.uri }}
                    style={styles.previewMedia}
                  />
                )}
                <TouchableOpacity
                  style={styles.removeMediaButton}
                  onPress={() => setSelectedMedia(null)}
                >
                  <Ionicons name="close-circle" size={24} color="#FFF" />
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.composerActions}>
              <TouchableOpacity
                style={styles.attachButton}
                onPress={handlePickMedia}
              >
                <Ionicons name="image-outline" size={22} color="#006837" />
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.postButton,
                  { backgroundColor: "#006837" },
                  ((!postContent.trim() && !selectedMedia) || isCreatingPost) &&
                    styles.postButtonDisabled,
                ]}
                onPress={handleCreatePost}
                disabled={
                  (!postContent.trim() && !selectedMedia) || isCreatingPost
                }
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
          const fullName =
            `${post.firstname || ""} ${post.lastname || ""}`.trim();
          const displayName =
            fullName.length > 0 ? fullName : post.userEmail || "Unknown User";
          const avatarLetter = displayName.charAt(0).toUpperCase();

          const mediaType = post.mediaType;
          const isVideo =
            mediaType === "video" ||
            mediaType === "Video" ||
            (post.mediaUrl && post.mediaUrl.match(/\.(mp4|mov|webm)$/i));

          return (
            <View
              style={[
                styles.postCard,
                { backgroundColor: theme.cardBg, borderColor: theme.border },
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
                    {post.createdAt}
                  </Text>
                </View>
              </View>

              {/* Post Content */}
              {post.content ? (
                <Text style={[styles.postContent, { color: theme.text }]}>
                  {post.content}
                </Text>
              ) : null}

              {/* Media Attachment */}
              {post.mediaUrl ? (
                <View style={styles.mediaContainer}>
                  {Platform.OS === "web" ? (
                    isVideo ? (
                      // @ts-ignore
                      <video
                        src={post.mediaUrl}
                        style={{
                          width: "100%",
                          height: 220,
                          objectFit: "contain",
                          backgroundColor: "#000",
                        }}
                        controls
                      />
                    ) : (
                      // @ts-ignore
                      <img
                        src={post.mediaUrl}
                        style={{
                          width: "100%",
                          height: 240,
                          objectFit: "cover",
                        }}
                      />
                    )
                  ) : isVideo ? (
                    <Video
                      source={{ uri: post.mediaUrl }}
                      style={styles.postVideo}
                      useNativeControls
                      resizeMode={ResizeMode.CONTAIN}
                      isLooping={false}
                    />
                  ) : (
                    <Image
                      source={{ uri: post.mediaUrl }}
                      style={styles.postImage}
                      resizeMode="cover"
                    />
                  )}
                </View>
              ) : null}

              {/* Post Footer Actions */}
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

              {/* Comments Section */}
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
                            { color: isDark ? "#D1D5DB" : "#4B5563" },
                          ]}
                        >
                          {comment.content}
                        </Text>
                      </Text>
                    </View>
                  ))}
                </View>
              )}

              {/* Comment Drawer Input */}
              {activeCommentPostId === post.id && (
                <View style={styles.commentComposer}>
                  <TextInput
                    style={[
                      styles.commentInput,
                      {
                        backgroundColor: theme.inputBg,
                        color: theme.text,
                        borderColor: theme.border,
                      },
                    ]}
                    placeholder="Write a comment..."
                    placeholderTextColor={isDark ? "#6B7280" : "#9CA3AF"}
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
                    <Ionicons name="send" size={15} color="#FFF" />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          );
        }}
        ListFooterComponent={
          isFetchingNextPage ? (
            <View style={styles.footerLoader}>
              <ActivityIndicator size="small" color="#006837" />
            </View>
          ) : null
        }
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: { fontSize: 14, marginBottom: 12, textAlign: "center" },
  retryButton: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
  retryButtonText: { color: "#FFF", fontWeight: "600" },
  listContainer: { paddingVertical: 8, paddingHorizontal: 12 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalCard: {
    backgroundColor: "#161E2E",
    padding: 24,
    borderRadius: 16,
    width: "100%",
    maxWidth: 340,
    borderWidth: 1,
    borderColor: "#2D3748",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 12,
    textAlign: "center",
  },
  modalText: {
    fontSize: 14,
    color: "#9CA3AF",
    lineHeight: 22,
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: "#006837",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  modalButtonText: { color: "#FFF", fontWeight: "600", fontSize: 15 },
  composerContainer: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  composerInput: { fontSize: 15, minHeight: 60, textAlignVertical: "top" },
  composerActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.04)",
    paddingTop: 8,
  },
  attachButton: { padding: 4 },
  postButton: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 75,
    alignItems: "center",
  },
  postButtonDisabled: { opacity: 0.5 },
  postButtonText: { color: "#FFF", fontWeight: "600", fontSize: 13 },
  previewContainer: {
    marginTop: 10,
    position: "relative",
    borderRadius: 8,
    overflow: "hidden",
  },
  previewMedia: {
    width: "100%",
    height: 200,
    borderRadius: 8,
  },
  removeMediaButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 12,
    zIndex: 10,
  },
  postCard: {
    padding: 14,
    marginBottom: 10,
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  postHeader: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  avatarPlaceholder: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  avatarText: { color: "#FFF", fontWeight: "bold", fontSize: 15 },
  authorMeta: { flex: 1 },
  authorName: { fontSize: 14, fontWeight: "600" },
  authorHandle: { fontSize: 11, marginTop: 1 },
  postContent: { fontSize: 14, lineHeight: 20, marginBottom: 10 },
  mediaContainer: {
    width: "100%",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 12,
    backgroundColor: "#000",
  },
  postImage: { width: "100%", height: 240 },
  postVideo: { width: "100%", height: 220 },
  postFooter: {
    flexDirection: "row",
    borderTopWidth: 1,
    paddingTop: 10,
    marginTop: 4,
  },
  actionButton: { flexDirection: "row", alignItems: "center", marginRight: 24 },
  actionText: { marginLeft: 6, fontSize: 13, fontWeight: "500" },
  activeActionText: { color: "#E0245E" },
  commentsContainer: { marginTop: 10, padding: 10, borderRadius: 8 },
  commentItem: { marginBottom: 6 },
  commentAuthor: { fontSize: 12, fontWeight: "600" },
  commentContent: { fontWeight: "normal" },
  commentComposer: {
    flexDirection: "row",
    marginTop: 10,
    alignItems: "center",
  },
  commentInput: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    fontSize: 13,
    maxHeight: 80,
  },
  commentSendButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  footerLoader: { paddingVertical: 16, alignItems: "center" },
});
