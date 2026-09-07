import apiClient from "@/api/axiosInstance";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Types
export interface InstitutionalEventDto {
  id: string;
  title: string;
  description: string;
  dateUtc: string;
  location?: string;
  createdAtUtc?: string;
}

export interface CreateEventDto {
  title: string;
  description: string;
  dateUtc: string;
  location?: string;
}

export interface SystemEventAnnouncement {
  title: string;
  content: string;
  sentBy: string;
  sentAtUtc: string;
}

// API Service with response normalization (handles PascalCase/camelCase mismatches)
export const institutionalApi = {
  getUpcomingEvents: async (): Promise<InstitutionalEventDto[]> => {
    const response = await apiClient.get<any>("/institutional/events");
    console.log("Raw API Events Response:", response.data);

    // Extract array safely whether it's direct array, wrapped in .data, or .items
    const rawData = Array.isArray(response.data)
      ? response.data
      : response.data?.items || response.data?.data || [];

    // Normalize properties so components never encounter undefined fields
    return rawData.map((item: any) => ({
      id: item.id || item.Id || Math.random().toString(),
      title: item.title || item.Title || "Untitled Event",
      description: item.description || item.Description || "",
      dateUtc: item.dateUtc || item.DateUtc || new Date().toISOString(),
      location: item.location || item.Location,
      createdAtUtc: item.createdAtUtc || item.CreatedAtUtc,
    }));
  },

  createEvent: async (dto: CreateEventDto): Promise<{ message: string }> => {
    const response = await apiClient.post<{ message: string }>(
      "/institutional/events",
      dto,
    );
    return response.data;
  },
};

// React Query Hook
export function useInstitutionalEvents() {
  const queryClient = useQueryClient();

  const {
    data: events = [],
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["institutional-events"],
    queryFn: institutionalApi.getUpcomingEvents,
  });

  const { mutateAsync: createEvent, isPending: isCreatingEvent } = useMutation({
    mutationFn: (dto: CreateEventDto) => institutionalApi.createEvent(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["institutional-events"] });
    },
  });

  return {
    events,
    isLoading,
    isError,
    refetch,
    isRefetching,
    createEvent,
    isCreatingEvent,
  };
}
