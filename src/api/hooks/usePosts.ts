import api from "@/api/axiosInstance";
import apiClient from "@/api/axiosInstance";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker"; // Make sure this is imported
import { Platform } from "react-native";
import { BASE_URL } from "../client";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface CreatePostInput {
  content: string;
  media?: ImagePicker.ImagePickerAsset | null;
}
export interface AuthorDto {
  id: string;
  firstName: string;
  lastName: string;
  headline?: string;
  avatarUrl?: string;
}

export interface CommentDto {
  id: string;
  content: string;
  author: AuthorDto;
  createdAtUtc: string;
}

export interface PostDto {
  id: string;
  authorId: string;
  content: string;
  createdAt: string;
  commentCount: number;
  likeCount: number;
  firstName: string;
  lastName: string;
  userEmail: string;
  userReactionType?: string;
  comments?: CommentDto[];
  isLiked: boolean;
  mediaUrl?:string;
  mediaType?:String;
}

export interface PagedResult<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface CreatePostRequest {
  content: string;
}

export interface AddCommentRequest {
  content: string;
}

export interface ToggleReactionRequest {
  reactionType: string;
}

export interface MessageResponse {
  message: string;
}

export interface CommentUI {
  id: string;
  author: string;
  handle: string;
  content: string;
  createdAt: string;
}

export interface PostUI {
  id: string;
  author: string;
  handle: string;
  content: string;
  createdAt: string;
  likes: number;
  isLiked: boolean;
  comments: CommentUI[];
  firstname: string;
  lastname: string;
  userEmail: string;
  likeCount: number;
  commentCount: number;
  mediaUrl?: string;
  mediaType?: String;
}

/**
 * Fetch paginated feed posts.
 */
export async function getFeed(pageNumber = 1, pageSize = 10) {
  const response = await apiClient.get<PagedResult<PostDto> | PostDto[]>(
    "/posts/feed",
    {
      params: { pageNumber, pageSize },
    },
  );
  return response.data;
}

/**
 * Create a new post.
 */
export async function createPost(
  request: CreatePostRequest,
): Promise<MessageResponse> {
  const response = await apiClient.post<MessageResponse>("/posts", request);
  return response.data;
}

/**
 * Add a comment to a specific post.
 */
export async function addComment(
  postId: string,
  request: AddCommentRequest,
): Promise<MessageResponse> {
  const response = await apiClient.post<MessageResponse>(
    `/posts/${postId}/comments`,
    request,
  );
  return response.data;
}

/**
 * Toggle a reaction on a post.
 */
export async function toggleReaction(
  postId: string,
  request: ToggleReactionRequest,
): Promise<MessageResponse> {
  const response = await apiClient.post<MessageResponse>(
    `/posts/${postId}/react`,
    request,
  );
  return response.data;
}

export function usePosts() {
  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    isError,
    refetch,
    isRefetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["posts"],
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const currentPage = typeof pageParam === "number" ? pageParam : 1;
      const result = await getFeed(currentPage, 10);
      return result ?? { items: [], pageNumber: currentPage, totalPages: 1 };
    },
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage) return undefined;
      if (Array.isArray(lastPage)) {
        return lastPage.length > 0 ? allPages.length + 1 : undefined;
      }

      const pageNumber =
        lastPage.pageNumber ??
        (lastPage as any).currentPage ??
        (lastPage as any).page ??
        allPages.length;
      const totalPages =
        lastPage.totalPages ??
        (lastPage.totalCount && lastPage.pageSize
          ? Math.ceil(lastPage.totalCount / lastPage.pageSize)
          : undefined);

      if (totalPages !== undefined) {
        return pageNumber < totalPages ? pageNumber + 1 : undefined;
      }

      const items = lastPage.items || (lastPage as any).data || [];
      return items.length > 0 ? pageNumber + 1 : undefined;
    },
    select: (data) => {
      if (!data || !data.pages) return [];

      return data.pages.flatMap((result) => {
        if (!result) return [];
        const items: any[] = Array.isArray(result)
          ? result
          : result.items || (result as any).data || [];

        return items.map((post: PostDto): PostUI => {
          const authorFullName = [post.firstName, post.lastName]
            .filter(Boolean)
            .join(" ");
          const fallbackAuthor =
            authorFullName || post.userEmail || "Unknown User";
          const authorHandle = post.userEmail
            ? `@${post.userEmail.split("@")[0]}`
            : `@${fallbackAuthor.toLowerCase().replace(/\s+/g, "")}`;

          return {
            id: post.id || Math.random().toString(),
            author: fallbackAuthor,
            handle: authorHandle,
            content: post.content || "",
            createdAt: post.createdAt
              ? new Date(post.createdAt).toLocaleDateString()
              : "",
            likes: post.likeCount || 0,
            isLiked: post.isLiked ?? !!post.userReactionType,
            firstname: post.firstName || "",
            lastname: post.lastName || "",
            userEmail: post.userEmail || "",
            likeCount: post.likeCount || 0,
            commentCount: post.commentCount || 0,
            comments:
              post.comments?.map(
                (c: any): CommentUI => ({
                  id: c.id || Math.random().toString(),
                  author: c.author
                    ? `${c.author.firstName} ${c.author.lastName}`
                    : "Unknown",
                  handle: c.author
                    ? `@${c.author.firstName?.toLowerCase() || "user"}`
                    : "@unknown",
                  content: c.content || "",
                  createdAt: c.createdAtUtc
                    ? new Date(c.createdAtUtc).toLocaleDateString()
                    : "",
                }),
              ) || [],
          };
        });
      });
    },
  });
const createPostMutation = useMutation({
  mutationFn: async (input: CreatePostInput) => {
    const formData = new FormData();
    formData.append("Content", String(input.content ?? "").trim());

    if (input.media?.uri) {
      if (Platform.OS === "web") {
        const response = await fetch(input.media.uri);
        const blob = await response.blob();
        const fileName =
          input.media.fileName ||
          `upload.${input.media.type === "video" ? "mp4" : "jpg"}`;
        formData.append("MediaFile", blob, fileName);
      } else {
        const uriParts = input.media.uri.split(".");
        const fileExtension =
          uriParts[uriParts.length - 1] ||
          (input.media.type === "video" ? "mp4" : "jpg");

        formData.append("MediaFile", {
          uri: input.media.uri,
          name: `upload.${fileExtension}`,
          type:
            input.media.type === "video"
              ? `video/${fileExtension}`
              : `image/${fileExtension}`,
        } as any);
      }
    }

    // Retrieve token manually for fetch
    let token = await AsyncStorage.getItem("accessToken");
    token = token ? token.replace(/^"(.*)"$/, "$1").trim() : null;

    const res = await fetch(`${BASE_URL}posts`, {
      method: "POST",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        // Do NOT set Content-Type here; fetch automatically generates
        // the correct multipart/form-data boundary header.
      },
      body: formData,
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Upload failed: ${errorText}`);
    }

    return await res.json();
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["posts"] });
  },
});
  const addCommentMutation = useMutation({
    mutationFn: ({ postId, content }: { postId: string; content: string }) =>
      addComment(postId, { content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const toggleReactionMutation = useMutation({
    mutationFn: (postId: string) =>
      toggleReaction(postId, { reactionType: "Like" }),
    onMutate: async (postId: string) => {
      await queryClient.cancelQueries({ queryKey: ["posts"] });
      const previousPosts = queryClient.getQueryData(["posts"]);

      queryClient.setQueryData(["posts"], (oldData: any) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page: any) => {
            if (Array.isArray(page)) {
              return page.map((post: PostDto) => {
                if (post.id === postId) {
                  const nextIsLiked = !post.isLiked;
                  return {
                    ...post,
                    isLiked: nextIsLiked,
                    userReactionType: nextIsLiked ? "Like" : undefined,
                    likeCount: nextIsLiked
                      ? post.likeCount + 1
                      : Math.max(0, post.likeCount - 1),
                  };
                }
                return post;
              });
            }
            if (page && Array.isArray(page.items)) {
              return {
                ...page,
                items: page.items.map((post: PostDto) => {
                  if (post.id === postId) {
                    const nextIsLiked = !post.isLiked;
                    return {
                      ...post,
                      isLiked: nextIsLiked,
                      userReactionType: nextIsLiked ? "Like" : undefined,
                      likeCount: nextIsLiked
                        ? post.likeCount + 1
                        : Math.max(0, post.likeCount - 1),
                    };
                  }
                  return post;
                }),
              };
            }
            return page;
          }),
        };
      });

      return { previousPosts };
    },
    onError: (err, postId, context: any) => {
      if (context?.previousPosts) {
        queryClient.setQueryData(["posts"], context.previousPosts);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  return {
    posts: data || [],
    isLoading,
    isError,
    refetch,
    isRefetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    createPost: createPostMutation.mutateAsync,
    isCreatingPost: createPostMutation.isPending,
    toggleLike: toggleReactionMutation.mutateAsync,
    isLiking: toggleReactionMutation.isPending,
    addComment: addCommentMutation.mutateAsync,
  };
}
