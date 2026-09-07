import apiClient from "@/api/axiosInstance"; // Adjust your axios client import path as needed
import { useMutation } from "@tanstack/react-query";

// --- Types ---
export interface ChatRequest {
  message: string;
}

export interface ChatResponseDto {
  success: boolean;
  reply: string | null;
  error: string | null;
}

// --- API Service ---
export const chatApi = {
  sendMessage: async (request: ChatRequest): Promise<ChatResponseDto> => {
    const response = await apiClient.post<ChatResponseDto>("/chat", request);
    return response.data;
  },
};

// --- React Query Hook ---
export function useChat() {
  const {
    mutateAsync: sendMessage,
    isPending: isSendingMessage,
    isError,
    error,
  } = useMutation({
    mutationFn: (message: string) => chatApi.sendMessage({ message }),
  });

  return {
    sendMessage,
    isSendingMessage,
    isError,
    error,
  };
}