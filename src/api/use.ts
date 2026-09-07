import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useUpdateProfile } from "@/api/hooks/useProfile" ; // Adjust import path as needed

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: useUpdateProfile,
    onSuccess: () => {
      // This tells TanStack Query to refetch your profile data immediately
      queryClient.invalidateQueries({ queryKey: ["myProfile"] }); // Make sure "myProfile" matches your useMyProfile query key
    },
  });
};
