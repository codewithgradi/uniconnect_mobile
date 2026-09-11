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
export interface ApplicantDto {
  firstName: string;
  lastName: string;
  systemHeadline: string;
  aboutBio: string;
  cvFileUrl: string;
}

export interface GetOpportunityWithApplications {
  id: string;
  userId: string;
  businessProfileId: string;
  title: string;
  description: string;
  applicants: ApplicantDto[];
}

export const fetchOpportunityWithApplications = async (
  opportunityId: string,
): Promise<GetOpportunityWithApplications> => {
  const { data } = await api.get<GetOpportunityWithApplications>(
    `/api/opportunities/${opportunityId}/applications`,
  );
  console.log(data);
  return data;
};

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
    const response = await api.get(`/opportunities/${businessProfileId}`);
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
    try {
      await api.post("/opportunities", dto);
    } catch (err: any) {
      console.log("Backend validation error details:", err?.response?.data);
      throw err;
    }
  },

  apply: async (opportunityId: string): Promise<any> => {
    const response = await api.post(`/opportunities/${opportunityId}/apply`);
    return response.data;
  },

  approve: async (opportunityId: string): Promise<void> => {
    await api.patch(`/opportunities/${opportunityId}/approve`);
  },

  reject: async (opportunityId: string): Promise<void> => {
    await api.patch(`/opportunities/${opportunityId}/reject`);
  },

  close: async (opportunityId: string): Promise<void> => {
    await api.patch(`/opportunities/${opportunityId}/close`);
  },
};

