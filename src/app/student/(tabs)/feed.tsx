import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

interface Comment {
  id: string;
  author: string;
  handle: string;
  content: string;
  createdAt: string;
}

interface Post {
  id: string;
  author: string;
  handle: string;
  content: string;
  createdAt: string;
  likes: number;
  isLiked?: boolean;
  comments: Comment[];
  isCommentsOpen?: boolean;
}

export default function FeedScreen() {
  const isDark = useColorScheme() === "dark";
  const [postContent, setPostContent] = useState("");
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>(
    {},
  );

  const [posts, setPosts] = useState<Post[]>([
    {
      id: "1",
      author: "Gradi Puata",
      handle: "@gradipuata",
      content:
        "Just submitted my latest project! React Native and .NET Clean Architecture make a great stack. 🚀 #developer #reactnative",
      createdAt: "10m",
      likes: 12,
      comments: [
        {
          id: "c1",
          author: "FitlaHoops Dev",
          handle: "@fitlahoops",
          content: "Clean Architecture on .NET is top tier! Great work.",
          createdAt: "5m",
        },
      ],
      isCommentsOpen: false,
    },
    {
      id: "2",
      author: "FitlaHoops Dev",
      handle: "@fitlahoops",
      content:
        "Campus tournament registration closes this Friday. Make sure your team roster is updated!",
      createdAt: "2h",
      likes: 34,
      comments: [],
      isCommentsOpen: false,
    },
  ]);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleCreatePost = () => {
    if (!postContent.trim()) return;

    const newPost: Post = {
      id: Date.now().toString(),
      author: "Gradi Puata",
      handle: "@gradipuata",
      content: postContent,
      createdAt: "Just now",
      likes: 0,
      comments: [],
      isCommentsOpen: false,
    };

    setPosts([newPost, ...posts]);
    setPostContent("");
  };

  const toggleLike = (id: string) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === id
          ? {
              ...post,
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            }
          : post,
      ),
    );
  };

  const toggleComments = (id: string) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === id
          ? { ...post, isCommentsOpen: !post.isCommentsOpen }
          : post,
      ),
    );
  };

  const handleAddComment = (postId: string) => {
    const text = commentInputs[postId];
    if (!text || !text.trim()) return;

    const newComment: Comment = {
      id: Date.now().toString(),
      author: "Gradi Puata",
      handle: "@gradipuata",
      content: text.trim(),
      createdAt: "Just now",
    };

    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: [...post.comments, newComment],
            }
          : post,
      ),
    );

    setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
  };

  return (
    <View style={[styles.container, isDark ? styles.darkBg : styles.lightBg]}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View
            style={[
              styles.createPostCard,
              isDark ? styles.darkCard : styles.lightCard,
            ]}
          >
            <View style={styles.inputRow}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarText}>
                  {getInitials("Gradi Puata")}
                </Text>
              </View>

              <TextInput
                placeholder="What's happening?"
                placeholderTextColor={isDark ? "#9CA3AF" : "#6B7280"}
                multiline
                value={postContent}
                onChangeText={setPostContent}
                style={[
                  styles.input,
                  isDark ? styles.darkText : styles.lightText,
                ]}
              />
            </View>

            <View style={styles.createPostFooter}>
              <TouchableOpacity
                style={[
                  styles.postButton,
                  !postContent.trim() && styles.disabledButton,
                ]}
                onPress={handleCreatePost}
                disabled={!postContent.trim()}
              >
                <Text style={styles.postButtonText}>Post</Text>
              </TouchableOpacity>
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <View
            style={[
              styles.postCard,
              isDark ? styles.darkCard : styles.lightCard,
            ]}
          >
            <View style={styles.postMainRow}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarText}>
                  {getInitials(item.author)}
                </Text>
              </View>

              <View style={styles.postBody}>
                <View style={styles.headerRow}>
                  <Text
                    style={[
                      styles.author,
                      isDark ? styles.darkText : styles.lightText,
                    ]}
                  >
                    {item.author}
                  </Text>
                  <Text style={styles.handle}>
                    {item.handle} • {item.createdAt}
                  </Text>
                </View>

                <Text
                  style={[
                    styles.content,
                    isDark ? styles.darkText : styles.lightText,
                  ]}
                >
                  {item.content}
                </Text>

                {/* Interaction Row (Comments + Likes only) */}
                <View style={styles.interactionRow}>
                  <TouchableOpacity
                    style={styles.interactionBtn}
                    onPress={() => toggleComments(item.id)}
                  >
                    <Ionicons
                      name="chatbubble-outline"
                      size={16}
                      color={item.isCommentsOpen ? "#006837" : "#6B7280"}
                    />
                    <Text
                      style={[
                        styles.interactionText,
                        item.isCommentsOpen && { color: "#006837" },
                      ]}
                    >
                      {item.comments.length}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.interactionBtn}
                    onPress={() => toggleLike(item.id)}
                  >
                    <Ionicons
                      name={item.isLiked ? "heart" : "heart-outline"}
                      size={16}
                      color={item.isLiked ? "#E11D48" : "#6B7280"}
                    />
                    <Text
                      style={[
                        styles.interactionText,
                        item.isLiked && { color: "#E11D48" },
                      ]}
                    >
                      {item.likes}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Expandable Comment Section */}
            {item.isCommentsOpen && (
              <View
                style={[
                  styles.commentSection,
                  isDark
                    ? styles.darkCommentSection
                    : styles.lightCommentSection,
                ]}
              >
                {/* List of existing comments */}
                {item.comments.map((comment) => (
                  <View key={comment.id} style={styles.commentItem}>
                    <View style={styles.smallAvatarCircle}>
                      <Text style={styles.smallAvatarText}>
                        {getInitials(comment.author)}
                      </Text>
                    </View>
                    <View style={styles.commentBody}>
                      <View style={styles.headerRow}>
                        <Text
                          style={[
                            styles.commentAuthor,
                            isDark ? styles.darkText : styles.lightText,
                          ]}
                        >
                          {comment.author}
                        </Text>
                        <Text style={styles.handle}>{comment.createdAt}</Text>
                      </View>
                      <Text
                        style={[
                          styles.commentContent,
                          isDark ? styles.darkText : styles.lightText,
                        ]}
                      >
                        {comment.content}
                      </Text>
                    </View>
                  </View>
                ))}

                {/* Comment Input Box */}
                <View style={styles.commentInputRow}>
                  <TextInput
                    placeholder="Write a comment..."
                    placeholderTextColor={isDark ? "#9CA3AF" : "#6B7280"}
                    value={commentInputs[item.id] || ""}
                    onChangeText={(text) =>
                      setCommentInputs((prev) => ({ ...prev, [item.id]: text }))
                    }
                    style={[
                      styles.commentInput,
                      isDark ? styles.darkInput : styles.lightInput,
                      isDark ? styles.darkText : styles.lightText,
                    ]}
                  />
                  <TouchableOpacity
                    style={[
                      styles.sendBtn,
                      !commentInputs[item.id]?.trim() && styles.disabledButton,
                    ]}
                    disabled={!commentInputs[item.id]?.trim()}
                    onPress={() => handleAddComment(item.id)}
                  >
                    <Ionicons name="send" size={16} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  lightBg: { backgroundColor: "#FFFFFF" },
  darkBg: { backgroundColor: "#111827" },
  createPostCard: {
    padding: 16,
    borderBottomWidth: 1,
  },
  inputRow: { flexDirection: "row", gap: 12 },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#006837",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: { color: "#FFFFFF", fontWeight: "700", fontSize: 14 },
  input: { flex: 1, fontSize: 15, minHeight: 50, textAlignVertical: "top" },
  createPostFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  postButton: {
    backgroundColor: "#006837",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  disabledButton: { opacity: 0.5 },
  postButtonText: { color: "#FFFFFF", fontWeight: "700", fontSize: 13 },
  postCard: {
    padding: 16,
    borderBottomWidth: 1,
  },
  postMainRow: {
    flexDirection: "row",
    gap: 12,
  },
  postBody: { flex: 1 },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  author: { fontWeight: "700", fontSize: 14 },
  handle: { color: "#9CA3AF", fontSize: 12 },
  content: { fontSize: 14, lineHeight: 20, marginBottom: 12 },
  interactionRow: {
    flexDirection: "row",
    gap: 24,
  },
  interactionBtn: { flexDirection: "row", alignItems: "center", gap: 6 },
  interactionText: { fontSize: 12, color: "#6B7280" },

  /* Comments Section Styling */
  commentSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  lightCommentSection: { borderTopColor: "#F3F4F6" },
  darkCommentSection: { borderTopColor: "#374151" },
  commentItem: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 10,
  },
  smallAvatarCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#008748",
    justifyContent: "center",
    alignItems: "center",
  },
  smallAvatarText: { color: "#FFFFFF", fontWeight: "700", fontSize: 11 },
  commentBody: { flex: 1 },
  commentAuthor: { fontWeight: "600", fontSize: 13 },
  commentContent: { fontSize: 13, lineHeight: 18, marginTop: 2 },
  commentInputRow: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    marginTop: 8,
  },
  commentInput: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 18,
    fontSize: 13,
    borderWidth: 1,
  },
  lightInput: { backgroundColor: "#F9FAFB", borderColor: "#E5E7EB" },
  darkInput: { backgroundColor: "#1F2937", borderColor: "#374151" },
  sendBtn: {
    backgroundColor: "#006837",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },

  lightCard: { backgroundColor: "#FFFFFF", borderBottomColor: "#E5E7EB" },
  darkCard: { backgroundColor: "#111827", borderBottomColor: "#374151" },
  lightText: { color: "#111827" },
  darkText: { color: "#FFFFFF" },
});
