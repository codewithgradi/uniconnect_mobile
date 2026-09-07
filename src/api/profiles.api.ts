import api from "./axiosInstance"; // standard axios instance with Auth token header
import {
  AddCertificationDto,
  AddExperienceDto,
  CertificationDto,
  CreateProfileDto,
  ExperienceDto,
  ProfileDto,
  UpdateProfileDto,
} from "@/types/appTypes";

export const profilesApi = {
  getMyProfile: async (): Promise<ProfileDto> => {
    const response = await api.get("/profiles/me");
    return response.data;
  },

  getProfileById: async (profileId: string): Promise<ProfileDto> => {
    const response = await api.get(`/profiles/${profileId}`);
    return response.data;
  },

  createProfile: async (dto: CreateProfileDto): Promise<ProfileDto> => {
    const response = await api.post("/profiles", dto);
    return response.data;
  },

  updateProfile: async (
    dto: UpdateProfileDto,
  ): Promise<{ message: string }> => {
    const response = await api.put("/profiles/me", dto);
    return response.data;
  },

  saveCvUrl: async (
    fileUri: string,
    fileName: string,
    fileType: string,
    token?: string,
  ): Promise<string> => {
    const formData = new FormData();
    formData.append("file", {
      uri: fileUri,
      name: fileName,
      type: fileType || "application/pdf",
    } as any);

    const response = await fetch("http://localhost:5116/api/media/upload-cv", {
      method: "POST",
      body: formData,
      headers: {
        // Native fetch automatically handles multipart/form-data boundaries.
        // Only include authorization if your endpoint requires it:
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        errorText || `Upload failed with status ${response.status}`,
      );
    }

    const data = await response.json();
    return data.url || data;
  },

  addExperience: async (dto: AddExperienceDto): Promise<ExperienceDto> => {
    const response = await api.post("/profiles/me/experiences", dto);
    return response.data;
  },

  deleteExperience: async (experienceId: string): Promise<void> => {
    await api.delete(`/profiles/me/experiences/${experienceId}`);
  },

  addCertification: async (
    dto: AddCertificationDto,
  ): Promise<CertificationDto> => {
    const response = await api.post("/profiles/me/certifications", dto);
    return response.data;
  },

  deleteCertification: async (certificationId: string): Promise<void> => {
    await api.delete(`/profiles/me/certifications/${certificationId}`);
  },

  addSkill: async (skillId: string): Promise<{ message: string }> => {
    const response = await api.post(`/profiles/me/skills/${skillId}`);
    return response.data;
  },

  endorseSkill: async ({
    targetProfileId,
    skillId,
  }: {
    targetProfileId: string;
    skillId: string;
  }): Promise<{ message: string }> => {
    const response = await api.post(
      `/profiles/${targetProfileId}/skills/${skillId}/endorse`,
    );
    return response.data;
  },
};
