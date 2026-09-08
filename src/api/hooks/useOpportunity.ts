// --- TanStack Query Hooks ---

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CreateOpportunityDto, opportunitiesApi, opportunityKeys } from "../opportunity.api";

export const useActiveOpportunities = (targetProgramme?: string) => {
  return useQuery({
    queryKey: opportunityKeys.active(targetProgramme),
    queryFn: () => opportunitiesApi.getActive(targetProgramme),
  });
};

export const useMyOpportunities = (businessProfileId: string) => {
  return useQuery({
    queryKey: opportunityKeys.my(businessProfileId),
    queryFn: () => opportunitiesApi.getMyOpportunities(businessProfileId),
    enabled: !!businessProfileId,
  });
};

export const usePendingOpportunities = () => {
  return useQuery({
    queryKey: opportunityKeys.pending(),
    queryFn: () => opportunitiesApi.getPending(),
  });
};
export const useGetMyPostings = () => {
  return useQuery({
    queryKey: opportunityKeys.my(),
    queryFn: () => opportunitiesApi.getMyPostings(),
  });
};

export const useCreateOpportunity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateOpportunityDto) => opportunitiesApi.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: opportunityKeys.all });
    },
  });
};

export const useApplyForOpportunity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { opportunityId: string; cvFileUrl: string }) =>
      opportunitiesApi.apply(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: opportunityKeys.detail(variables.opportunityId),
      });
      queryClient.invalidateQueries({ queryKey: opportunityKeys.active() });
    },
  });
};

export const useApproveOpportunity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (opportunityId: string) =>
      opportunitiesApi.approve(opportunityId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: opportunityKeys.all });
    },
  });
};

export const useRejectOpportunity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (opportunityId: string) =>
      opportunitiesApi.reject(opportunityId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: opportunityKeys.all });
    },
  });
};

export const useCloseOpportunity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (opportunityId: string) =>
      opportunitiesApi.close(opportunityId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: opportunityKeys.all });
    },
  });
};
