import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  loginApi,
  registerApi,
  sendOtpApi,
  verifyOtpApi,
  LoginRequest,
  RegisterRequestDto,
  SendOtpRequest,
  VerifyOtpRequest,
} from "../auth";
import { saveTokens, clearTokens } from "../storage";

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginRequest) => loginApi(credentials),
    onSuccess: async (data) => {
      await saveTokens(data.accessToken, data.refreshToken);
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: (payload: RegisterRequestDto) => registerApi(payload),
  });
};

export const useSendOtp = () => {
  return useMutation({
    mutationFn: (payload: SendOtpRequest) => sendOtpApi(payload),
  });
};

export const useVerifyOtp = () => {
  return useMutation({
    mutationFn: (payload: VerifyOtpRequest) => verifyOtpApi(payload),
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await clearTokens();
    },
    onSuccess: () => {
      queryClient.clear();
    },
  });
};
