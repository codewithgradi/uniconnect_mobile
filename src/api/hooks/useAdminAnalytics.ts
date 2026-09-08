import { useQuery, UseQueryOptions } from "@tanstack/react-query";

// types/adminAnalytics.ts

export interface DailyRegistrationDto {
  date: string;
  count: number;
}

export interface AdminAnalyticsDto {
  totalUsers: number;
  totalStudents: number;
  totalBusinesses: number;
  totalAdmins: number;
  totalOpportunities: number;
  publishedOpportunities: number;
  pendingOpportunities: number;
  closedOpportunities: number;
  totalJobApplications: number;
  totalPosts: number;
  totalComments: number;
  totalLikes: number;
  totalConnections: number;
  totalDirectMessages: number;
  pendingBusinessVerifications: number;
  recentRegistrations: DailyRegistrationDto[];
}
// api/services/adminAnalyticsService.ts

// Replace with your actual configured HTTP client (e.g., axios or fetch wrapper)
import api from "@/api/axiosInstance";

export const fetchAdminAnalytics = async (): Promise<AdminAnalyticsDto> => {
  const response = await api.get<AdminAnalyticsDto>("/admin/analytics");
  return response.data;
};

// api/hooks/useAdminAnalytics.ts

export const ADMIN_ANALYTICS_QUERY_KEY = ["admin-analytics"] as const;

export const useAdminAnalytics = (
  options?: Omit<
    UseQueryOptions<
      AdminAnalyticsDto,
      Error,
      AdminAnalyticsDto,
      typeof ADMIN_ANALYTICS_QUERY_KEY
    >,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: ADMIN_ANALYTICS_QUERY_KEY,
    queryFn: fetchAdminAnalytics,
    staleTime: 1000 * 60 * 5, // 5 minutes cache freshness
    refetchOnWindowFocus: true,
    ...options,
  });
};
