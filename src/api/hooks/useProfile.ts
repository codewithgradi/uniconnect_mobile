import {
  AddCertificationDto,
  AddExperienceDto,
  CreateProfileDto,
  ProfileDto,
  UpdateProfileDto,
} from "@/types/appTypes";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Platform } from "react-native";
import api from "@/api/axiosInstance";

// --- API DEFINITION ---

export const profilesApi = {
  searchProfiles: async (params?: {
    searchItem?: string;
    targetProgramme?: string;
  }): Promise<ProfileDto[]> => {
    const searchParams = new URLSearchParams();
    if (params?.searchItem)
      searchParams.append("searchItem", params.searchItem);
    if (params?.targetProgramme)
      searchParams.append("targetProgramme", params.targetProgramme);

    const response = await api.get<ProfileDto[]>(
      `/profiles?${searchParams.toString()}`,
    );
    return response.data;
  },

  getMyProfile: async (): Promise<ProfileDto> => {
    const response = await api.get<ProfileDto>("/profiles/me");
    return response.data;
  },

  getProfileById: async (profileId: string): Promise<ProfileDto> => {
    const response = await api.get<ProfileDto>(`/profiles/${profileId}`);
    return response.data;
  },

  createProfile: async (dto: CreateProfileDto) => {
    const response = await api.post<ProfileDto>("/profiles", dto);
    return response.data;
  },

  updateProfile: async (dto: UpdateProfileDto) => {
    const response = await api.put<ProfileDto>("/profiles/me", dto);
    console.log(response.data);
    return response.data;
  },

  saveCvUrl: async (
    fileUri: string,
    fileName: string,
    fileType: string,
  ): Promise<string> => {
    const formData = new FormData();

    if (Platform.OS === "web") {
      const res = await fetch(fileUri);
      const blob = await res.blob();
      formData.append("file", blob, fileName || "document.pdf");
    } else {
      let localUri = fileUri;
      if (Platform.OS === "ios" && !localUri.startsWith("file://")) {
        localUri = `file://${localUri}`;
      }

      formData.append("file", {
        uri: localUri,
        name: fileName || "document.pdf",
        type: fileType || "application/pdf",
      } as any);
    }

    formData.append("fileName", fileName || "document.pdf");

    const response = await api.post("/media/upload-cv", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data.url || response.data;
  },

  addExperience: async (dto: AddExperienceDto) => {
    const response = await api.post("/profiles/me/experiences", dto);
    return response.data;
  },

  deleteExperience: async (experienceId: string) => {
    await api.delete(`/profiles/me/experiences/${experienceId}`);
  },

  addCertification: async (dto: AddCertificationDto) => {
    const response = await api.post("/profiles/me/certifications", dto);
    return response.data;
  },

  deleteCertification: async (certificationId: string) => {
    await api.delete(`/profiles/me/certifications/${certificationId}`);
  },

  addSkill: async (skillId: string) => {
    const response = await api.post(`/profiles/me/skills/${skillId}`);
    return response.data;
  },

  endorseSkill: async ({
    targetProfileId,
    skillId,
  }: {
    targetProfileId: string;
    skillId: string;
  }) => {
    const response = await api.post(
      `/profiles/${targetProfileId}/skills/${skillId}/endorse`,
    );
    return response.data;
  },
};

// --- CACHE KEYS ---

export const profileKeys = {
  all: ["profiles"] as const,
  myProfile: () => [...profileKeys.all, "me"] as const,
  detail: (id: string) => [...profileKeys.all, id] as const,
  search: (params?: { searchItem?: string; targetProgramme?: string }) =>
    [...profileKeys.all, "search", params] as const,
};

// --- QUERIES ---

export const useMyProfile = () => {
  return useQuery({
    queryKey: profileKeys.myProfile(),
    queryFn: profilesApi.getMyProfile,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useProfileById = (profileId: string) => {
  return useQuery({
    queryKey: profileKeys.detail(profileId),
    queryFn: () => profilesApi.getProfileById(profileId),
    enabled: Boolean(profileId),
  });
};

export const useSearchProfiles = (params?: {
  searchItem?: string;
  targetProgramme?: string;
}) => {
  return useQuery({
    queryKey: profileKeys.search(params),
    queryFn: () => profilesApi.searchProfiles(params),
  });
};

// --- MUTATIONS ---

export const useCreateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateProfileDto) => profilesApi.createProfile(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.myProfile() });
    },
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: any) => profilesApi.updateProfile(dto),
    onSuccess: (updatedProfile, variables) => {
      // 1. Instantly merge the fresh server response or optimistic variables into the cache
      queryClient.setQueryData(profileKeys.myProfile(), (oldData: any) => {
        if (!oldData) return oldData;

        // If the server response returns the full updated profile entity, use it directly!
        if (updatedProfile && typeof updatedProfile === "object") {
          return {
            ...oldData,
            ...updatedProfile,
          };
        }

        // Fallback to manual payload merging if server response is minimal
        return {
          ...oldData,
          ...variables,
          systemHeadline: variables.headline ?? oldData.systemHeadline,
          headline: variables.headline ?? oldData.headline,
          aboutBio: variables.bio ?? oldData.aboutBio,
          bio: variables.bio ?? oldData.bio,
        };
      });

      // 2. Force refetch to ensure absolute synchronization with the server database
      queryClient.invalidateQueries({ queryKey: profileKeys.myProfile() });
    },
  });
};

export const useSaveCvUrl = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      fileUri,
      fileName,
      fileType,
    }: {
      fileUri: string;
      fileName: string;
      fileType: string;
    }) => profilesApi.saveCvUrl(fileUri, fileName, fileType),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.myProfile() });
    },
  });
};

export const useAddExperience = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: AddExperienceDto) => profilesApi.addExperience(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.myProfile() });
    },
  });
};

export const useDeleteExperience = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (experienceId: string) =>
      profilesApi.deleteExperience(experienceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.myProfile() });
    },
  });
};

export const useAddCertification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: AddCertificationDto) => profilesApi.addCertification(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.myProfile() });
    },
  });
};

export const useDeleteCertification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (certificationId: string) =>
      profilesApi.deleteCertification(certificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.myProfile() });
    },
  });
};

export const useAddSkill = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (skillId: string) => profilesApi.addSkill(skillId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.myProfile() });
    },
  });
};

export const useEndorseSkill = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      targetProfileId,
      skillId,
    }: {
      targetProfileId: string;
      skillId: string;
    }) => profilesApi.endorseSkill({ targetProfileId, skillId }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: profileKeys.detail(variables.targetProfileId),
      });
    },
  });
};
