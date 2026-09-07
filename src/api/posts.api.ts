import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  PostDto,
  CreatePostRequest,
  AddCommentRequest,
  ToggleReactionRequest,
} from "@/types/appTypes";

const api = axios.create({
  baseURL: "http://10.0.2.2:5000", // Adjust to host server IP
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const postsApi = {
  searchProfiles: async (params?: {
    searchItem?: string;
    targetProgramme?: string;
  }) => {
    const searchParams = new URLSearchParams();
    if (params?.searchItem)
      searchParams.append("searchItem", params.searchItem);
    if (params?.targetProgramme)
      searchParams.append("targetProgramme", params.targetProgramme);

    const response = await fetch(`/api/profiles?${searchParams.toString()}`);
    if (!response.ok) throw new Error("Failed to search profiles");
    return response.json();
  },

  getFeed: async (pageNumber = 1, pageSize = 10): Promise<PostDto[]> => {
    const response = await api.get("/api/posts/feed", {
      params: { pageNumber, pageSize },
    });
    return response.data;
  },

  createPost: async (
    request: CreatePostRequest,
  ): Promise<{ message: string }> => {
    const response = await api.post("/api/posts", request);
    return response.data;
  },

  addComment: async ({
    postId,
    request,
  }: {
    postId: string;
    request: AddCommentRequest;
  }): Promise<{ message: string }> => {
    const response = await api.post(`/api/posts/${postId}/comments`, request);
    return response.data;
  },

  toggleReaction: async ({
    postId,
    request,
  }: {
    postId: string;
    request: ToggleReactionRequest;
  }): Promise<{ message: string }> => {
    const response = await api.post(`/api/posts/${postId}/react`, request);
    return response.data;
  },
};
