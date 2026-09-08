import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "./axiosInstance"; // standard axios instance with Auth token header

// --- Types ---
export interface Opportunity {
  id: string;
  businessProfileId: string;
  title: string;
  description: string;
  targetProgramme?: string;
  status: "PendingApproval" | "Published" | "Rejected" | "Closed";
  createdAtUtc: string;
}

export interface CreateOpportunityDto {
  title: string;
  description: string;
  targetProgramme?: string;
}

// --- Query Keys ---
export const opportunityKeys = {
  all: ["opportunities"] as const,
  active: (programme?: string) =>
    [...opportunityKeys.all, "active", programme] as const,
  my: (businessId?: string) =>
    [...opportunityKeys.all, "my", businessId] as const,
  pending: () => [...opportunityKeys.all, "pending"] as const,
  detail: (id: string) => [...opportunityKeys.all, "detail", id] as const,
};

// --- API Client Methods ---
export const opportunitiesApi = {
  getActive: async (targetProgramme?: string): Promise<Opportunity[]> => {
    const params = targetProgramme ? { targetProgramme } : {};
    const response = await api.get("/opportunities", { params });
    return response.data;
  },

  getMyOpportunities: async (
    businessProfileId: string,
  ): Promise<Opportunity[]> => {
    const response = await api.get(
      `/opportunities/${businessProfileId}`,
    );
    console.log("Fetching opportunity with ID:", businessProfileId);
    return response.data;
  },

  getPending: async (): Promise<Opportunity[]> => {
    const response = await api.get("/opportunities/pending");
    return response.data;
  },

  getById: async (id: string): Promise<Opportunity> => {
    const response = await api.get(`/opportunities/${id}`);
    return response.data;
  },
  getMyPostings: async (): Promise<Opportunity> => {
    const response = await api.get(`/opportunities/my-postings`);
    return response.data;
  },

  create: async (dto: CreateOpportunityDto): Promise<void> => {
    await api.post("/opportunities", dto);
  },

  apply: async ({
    opportunityId,
    cvFileUrl,
  }: {
    opportunityId: string;
    cvFileUrl: string;
  }): Promise<void> => {
    await api.post(`/opportunities/${opportunityId}/apply`, {
      cvFileUrl,
    });
  },

  approve: async (opportunityId: string): Promise<void> => {
    await api.put(`/opportunities/${opportunityId}/approve`);
  },

  reject: async (opportunityId: string): Promise<void> => {
    await api.put(`/opportunities/${opportunityId}/reject`);
  },

  close: async (opportunityId: string): Promise<void> => {
    await api.put(`/opportunities/${opportunityId}/close`);
  },
};

