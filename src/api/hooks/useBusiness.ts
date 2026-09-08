import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../axiosInstance"; // Import your configured axios instance

// --- DTO Interfaces ---

export interface BusinessProfileDto {
  id: string;
  companyName: string;
  industry: string;
  websiteUrl: string;
}

export interface CreateBusinessDto {
  companyName: string;
  registrationNumber: string;
  industry: string;
  websiteUrl: string;
}

// --- Query Keys ---

export const businessKeys = {
  all: ["business"] as const,
  me: () => [...businessKeys.all, "me"] as const,
};

// --- API Fetcher Functions (Using Axios) ---

async function fetchMyBusinessProfile(): Promise<BusinessProfileDto | null> {
  try {
    const response = await api.get<BusinessProfileDto>("/business/me");
    return response.data;
  } catch (err: any) {
    if (err?.response?.status === 404) {
      return null;
    }
    throw new Error(
      err?.response?.data?.message || "Failed to fetch business profile.",
    );
  }
}

async function createBusinessProfile(dto: CreateBusinessDto): Promise<void> {
  try {
    await api.post("/business", dto);
  } catch (err: any) {
    const errorData = err?.response?.data;
    const errorText =
      typeof errorData === "string"
        ? errorData
        : errorData?.message || errorData?.detail;
    throw new Error(errorText || "Failed to create business profile.");
  }
}

// --- TanStack Query Hooks (v5) ---

export function useMyBusinessProfile() {
  return useQuery({
    queryKey: businessKeys.me(),
    queryFn: fetchMyBusinessProfile,
    retry: (failureCount, error: any) => {
      if (error.message.includes("404")) return false;
      return failureCount < 3;
    },
  });
}

export function useCreateBusinessProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBusinessProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: businessKeys.me() });
    },
  });
}
