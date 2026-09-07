import axios from "axios";
import {
  getAccessToken,
  getRefreshToken,
  saveTokens,
  clearTokens,
} from "./storage";

export const BASE_URL =
  process.env.EXPO_ENVIRONMENT === "development"
    ? process.env.EXPO_PUBLIC_API_URL_DEV
    : process.env.EXPO_PUBLIC_API_URL;

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Inject Access Token on requests
apiClient.interceptors.request.use(async (config) => {
  const token = await getAccessToken();
  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }
  return config;
});

// Handle 401 & Automatic Refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const requestUrl = originalRequest?.url || "";

    // 🔴 List of auth endpoints that should NEVER attempt token refresh on 401
    const isAuthEndpoint =
      requestUrl.includes("identity/login") ||
      requestUrl.includes("identity/register") ||
      requestUrl.includes("identity/verify-otp") ||
      requestUrl.includes("identity/refresh");

    // Only attempt refresh if status is 401, not retried, AND not an auth endpoint
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isAuthEndpoint
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = await getRefreshToken();
        if (!refreshToken) throw new Error("No refresh token available");

        // Call .NET Identity /refresh endpoint
        const { data } = await axios.post(`${BASE_URL}/refresh`, {
          refreshToken,
        });

        await saveTokens(data.accessToken, data.refreshToken);

        originalRequest.headers.set(
          "Authorization",
          `Bearer ${data.accessToken}`,
        );
        return apiClient(originalRequest);
      } catch (refreshError) {
        await clearTokens();
        return Promise.reject(refreshError);
      }
    }

    // Pass through normal 401s on login directly to the onError handler in LoginScreen
    return Promise.reject(error);
  },
);
