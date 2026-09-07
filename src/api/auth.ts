import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiClient } from "./client";

export type UserType = "student" | "alumni" | "business" | "admin";

export interface RegisterRequestDto {
  email: string;
  password: string;
  userType: UserType;
  firstName?: string;
  lastName?: string;
  programme?: string;
  companyName?: string;
  studentNumber?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  tokenType: string;
  accessToken: string;
  expiresIn: number;
  refreshToken: string;
}

export interface SendOtpRequest {
  email: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

// Login Call
export const loginApi = async (
  credentials: LoginRequest,
): Promise<AuthResponse> => {
  const { data } = await apiClient.post<AuthResponse>(
    "auth/login",
    credentials,
  );

  // Save token to AsyncStorage using the matching key "accessToken"
  if (data.accessToken) {
    await AsyncStorage.setItem("accessToken", data.accessToken);
    if (data.refreshToken) {
      await AsyncStorage.setItem("refreshToken", data.refreshToken);
    }
  }

  return data;
};

// Register Call
export const registerApi = async (
  payload: RegisterRequestDto,
): Promise<void> => {
  await apiClient.post("auth/register", payload);
};

// Send OTP Call
export const sendOtpApi = async (payload: SendOtpRequest): Promise<void> => {
  await apiClient.post("otp/send-otp", payload);
};

// Verify OTP Call
export const verifyOtpApi = async (
  payload: VerifyOtpRequest,
): Promise<void> => {
  await apiClient.post("otp/verify-otp", payload);
};
