import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

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

// --- API Fetcher Functions ---

const API_BASE_URL = "/api/business";

async function fetchMyBusinessProfile(): Promise<BusinessProfileDto | null> {
  const response = await fetch(API_BASE_URL + "/me", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error("Failed to fetch business profile.");
  }

  return response.json();
}

async function createBusinessProfile(dto: CreateBusinessDto): Promise<void> {
  const response = await fetch(API_BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dto),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to create business profile.");
  }
}

// --- TanStack Query Hooks (v5) ---

export function useMyBusinessProfile() {
  return useQuery({
    queryKey: businessKeys.me(),
    queryFn: fetchMyBusinessProfile,
    retry: (failureCount, error) => {
      // Do not retry on 404 (not found is an expected state for users without a business yet)
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
      // Invalidate the 'me' query so it refetches the newly created profile
      queryClient.invalidateQueries({ queryKey: businessKeys.me() });
    },
  });
}
