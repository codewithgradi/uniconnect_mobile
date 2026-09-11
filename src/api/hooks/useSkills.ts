import api from "@/api/axiosInstance";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface SkillDto {
  id: string;
  name: string;
}

export interface CreateSkillDto {
  name: string;
}

// --- API Functions ---

export const fetchSkills = async (): Promise<SkillDto[]> => {
  const response = await api.get<SkillDto[]>("/skills");
  return response.data;
};

export const createSkill = async (dto: CreateSkillDto): Promise<SkillDto> => {
  const response = await api.post<SkillDto>("/skills", dto);
  return response.data;
};

export const deleteSkill = async (id: string): Promise<void> => {
  await api.delete(`/skills/${id}`);
};

// --- TanStack Query Hooks ---

export const useSkills = () => {
  return useQuery({
    queryKey: ["skills"],
    queryFn: fetchSkills,
  });
};

export const useCreateSkill = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSkill,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skills"] });
    },
  });
};

export const useDeleteSkill = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteSkill,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skills"] });
    },
  });
};
