import apiClient from "@/api/axiosInstance"; // Adjust path to your base axios client

export interface ConnectionProfile {
  id: string;
  firstName: string;
  lastName: string;
  headline?: string;
  avatarUrl?: string;
  institution?: string;
}

export interface ConnectionRequestDto {
  id: string;
  requesterId: string;
  requester: ConnectionProfile;
  createdAtUtc: string;
}

export interface MessageResponse {
  message: string;
}

/**
 * Fetch all established connections for the currently authenticated user.
 */
export async function getMyConnections(): Promise<ConnectionProfile[]> {
  const response = await apiClient.get<ConnectionProfile[]>("/connections");
  return response.data;
}

/**
 * Fetch pending incoming connection requests.
 */
export async function getPendingRequests(): Promise<ConnectionRequestDto[]> {
  const response = await apiClient.get<ConnectionRequestDto[]>("/connections/pending");
  return response.data;
}

/**
 * Send a connection request to another profile.
 */
export async function sendConnectionRequest(targetProfileId: string): Promise<MessageResponse> {
  const response = await apiClient.post<MessageResponse>(`/api/connections/${targetProfileId}`);
  return response.data;
}

/**
 * Accept a pending connection request from a requester.
 */
export async function acceptConnectionRequest(requesterId: string): Promise<MessageResponse> {
  const response = await apiClient.patch<MessageResponse>(`/connections/accept/${requesterId}`);
  return response.data;
}

/**
 * Reject a pending connection request from a requester.
 */
export async function rejectConnectionRequest(requesterId: string): Promise<MessageResponse> {
  const response = await apiClient.patch<MessageResponse>(`/connections/reject/${requesterId}`);
  return response.data;
}

/**
 * Remove an existing connection with a target user.
 */
export async function removeConnection(targetUserId: string): Promise<MessageResponse> {
  const response = await apiClient.delete<MessageResponse>(`/connections/${targetUserId}`);
  return response.data;
}