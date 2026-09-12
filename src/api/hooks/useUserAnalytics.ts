import { useQuery } from "@tanstack/react-query";
import apiClient from "@/api/axiosInstance"; // Adjust your base client import

// --- Types ---
export interface RecentApplicationStatusDto {
  applicationId: string;
  jobTitle: string;
  companyName: string;
  status: string;
  appliedAtUtc: string;
}

export interface StudentAnalyticsDto {
  studentId: string;
  appliedJobsCount: number;
  bookmarkedJobsCount: number;
  totalConnections: number;
  pendingConnectionRequests: number;
  totalEndorsementsReceived: number;
  profileViewsCount: number;
  recentApplications: RecentApplicationStatusDto[];
}

export interface JobListingPerformanceDto {
  opportunityId: string;
  title: string;
  applicantCount: number;
  postedAtUtc: string;
  status: string;
}

export interface BusinessAnalyticsDto {
  businessId: string;
  activeJobListings: number;
  totalJobPostings: number;
  totalApplicantsReceived: number;
  pendingApplicantReviews: number;
  shortlistedCandidatesCount: number;
  profileViewsCount: number;
  topListings: JobListingPerformanceDto[];
}

// --- Query Keys ---
export const userAnalyticsKeys = {
  all: ["userAnalytics"] as const,
  student: (userId?: string) => [...userAnalyticsKeys.all, "student", userId] as const,
  business: (userId?: string) => [...userAnalyticsKeys.all, "business", userId] as const,
};

// --- API Client Methods ---
export const userAnalyticsApi = {
  getStudentAnalytics: async (): Promise<StudentAnalyticsDto> => {
    const response = await apiClient.get(`/analytics/student`);
    return response.data;
  },

  getBusinessAnalytics: async (): Promise<BusinessAnalyticsDto> => {
    const response = await apiClient.get(`/analytics/business/`);
    return response.data;
  },
};

// --- TanStack Query Hooks ---
export const useStudentAnalytics = () => {
  return useQuery({
    queryKey: userAnalyticsKeys.student(),
    queryFn: () => userAnalyticsApi.getStudentAnalytics(),

  });
};

export const useBusinessAnalytics = () => {
  return useQuery({
    queryKey: userAnalyticsKeys.business(),
    queryFn: () => userAnalyticsApi.getBusinessAnalytics(),
  
  });
};