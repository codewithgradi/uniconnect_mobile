// src/api/axiosInstance.ts
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "./client";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  async (config) => {
    
    let token = await AsyncStorage.getItem("accessToken");
    console.log("Outgoing Request to:", config.url);
    console.log("Token retrieved from AsyncStorage:", token);

    if (token) {
      // Strip surrounding quotes if stored via JSON.stringify
      token = token.replace(/^"(.*)"$/, "$1").trim();

      // Standard way to set headers across Axios versions
      config.headers.set
        ? config.headers.set("Authorization", `Bearer ${token}`)
        : (config.headers.Authorization = `Bearer ${token}`);
    }

    return config;
  },
  (error) => Promise.reject(error),
);

export default api;
