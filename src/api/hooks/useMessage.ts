import apiClient from "@/api/axiosInstance";
import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from "@microsoft/signalr/dist/esm/index.js";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../client";

// --- Types ---
export interface ChatThreadDto {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  avatarText: string;
  isOnline: boolean;
}

export interface SendMessageDto {
  receiverId: string;
  content: string;
}

export interface MarkAsReadDto {
  messageIds: string[];
}

export interface MessageDto {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  sentAt: string;
  isRead?: boolean;
}

export interface UnreadCountResponse {
  unreadCount: number;
}

// --- Query Keys Factory ---
export const messageKeys = {
  all: ["messages"] as const,
  chats: () => [...messageKeys.all, "chats"] as const,
  conversation: (otherUserId: string) =>
    [...messageKeys.all, "conversation", otherUserId] as const,
  unreadCount: () => [...messageKeys.all, "unread-count"] as const,
};

// --- API Service ---
export const messagesApi = {
  getChats: async (): Promise<ChatThreadDto[]> => {
    const response = await apiClient.get<ChatThreadDto[]>("/messages");
    return response.data;
  },

  sendMessage: async (dto: SendMessageDto): Promise<MessageDto> => {
    const response = await apiClient.post<MessageDto>("/messages", dto);
    console.log(response.data);
    return response.data;
  },

  getConversation: async (
    otherUserId: string,
    skip: number = 0,
    take: number = 50,
  ): Promise<MessageDto[]> => {
    const response = await apiClient.get<MessageDto[]>(
      `/messages/conversation/${otherUserId}`,
      { params: { skip, take } },
    );
    return response.data;
  },

  getUnreadCount: async (): Promise<UnreadCountResponse> => {
    const response = await apiClient.get<UnreadCountResponse>(
      "/messages/unread-count",
    );
    return response.data;
  },

  markAsRead: async (dto: MarkAsReadDto): Promise<{ message: string }> => {
    const response = await apiClient.patch<{ message: string }>(
      "/messages/read",
      dto,
    );
    return response.data;
  },
};

// --- React Query Hooks ---

export function useChatThreads() {
  return useQuery({
    queryKey: messageKeys.chats(),
    queryFn: messagesApi.getChats,
  });
}

export function useConversation(otherUserId: string, skip = 0, take = 50) {
  return useQuery({
    queryKey: messageKeys.conversation(otherUserId),
    queryFn: () => messagesApi.getConversation(otherUserId, skip, take),
    enabled: !!otherUserId,
  });
}

export function useUnreadMessageCount() {
  return useQuery({
    queryKey: messageKeys.unreadCount(),
    queryFn: messagesApi.getUnreadCount,
    refetchInterval: 10000,
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: SendMessageDto) => messagesApi.sendMessage(dto),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: messageKeys.conversation(data.receiverId),
      });
      queryClient.invalidateQueries({
        queryKey: messageKeys.chats(),
      });
    },
  });
}

export function useMarkAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: MarkAsReadDto) => messagesApi.markAsRead(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: messageKeys.unreadCount(),
      });
      queryClient.invalidateQueries({
        queryKey: messageKeys.chats(),
      });
    },
  });
}

export function useSignalRMessages(otherUserId?: string) {
  const queryClient = useQueryClient();

  useEffect(() => {
    let connection: HubConnection | null = null;

    const startSignalRConnection = async () => {
      try {
        const token = await AsyncStorage.getItem("accessToken");

        connection = new HubConnectionBuilder()
          .withUrl(`http://192.168.10.111:5116/hubs/chat`, {
            accessTokenFactory: () => token || "",
          })
          .withAutomaticReconnect()
          .configureLogging(LogLevel.Information)
          .build();

        connection.on("ReceiveMessage", (message: MessageDto) => {
          queryClient.invalidateQueries({
            queryKey: messageKeys.unreadCount(),
          });
          queryClient.invalidateQueries({
            queryKey: messageKeys.chats(),
          });

          // Determine the active chat participant ID depending on direction
          const activeId =
            otherUserId ||
            (message.senderId === otherUserId
              ? message.senderId
              : message.receiverId);

          if (activeId) {
            queryClient.invalidateQueries({
              queryKey: messageKeys.conversation(activeId),
            });
          }

          if (
            otherUserId &&
            (message.senderId === otherUserId ||
              message.receiverId === otherUserId)
          ) {
            queryClient.setQueryData<MessageDto[]>(
              messageKeys.conversation(otherUserId),
              (oldData = []) => [...oldData, message],
            );
          }
        });

        await connection.start();
        console.log("SignalR Connected successfully.");
      } catch (error) {
        console.error("SignalR Connection Error: ", error);
      }
    };

    startSignalRConnection();

    return () => {
      if (connection) {
        connection.stop();
      }
    };
  }, [otherUserId, queryClient]);
}
