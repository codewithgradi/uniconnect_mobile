import apiClient from "@/api/axiosInstance";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

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
  content: string;
  author: AuthorDto;
  createdAtUtc: string;
  reactionsCount: number;
  commentsCount: number;
  userReactionType?: string;
  comments?: CommentDto[];
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

        return items.map(
          (post): PostUI => ({
            id: post.id || Math.random().toString(),
            author: post.author
              ? `${post.author.firstName} ${post.author.lastName}`
              : "Unknown",
            handle: post.author
              ? `@${post.author.firstName?.toLowerCase() || "user"}`
              : "@unknown",
            content: post.content || "",
            createdAt: post.createdAtUtc
              ? new Date(post.createdAtUtc).toLocaleDateString()
              : "",
            likes: post.reactionsCount || 0,
            isLiked: !!post.userReactionType,
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
          }),
        );
      });
    },
  });

  const createPostMutation = useMutation({
    mutationFn: (request: { content: string }) => createPost(request),
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
    onSuccess: () => {
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
    toggleLike: toggleReactionMutation.mutate,
    addComment: addCommentMutation.mutateAsync,
  };
}
