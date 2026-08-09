import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { router } from "expo-router";

import AuthService from "@/services/api/AuthService";
import { notifySessionExpired } from "@/services/AuthSessionEvents";
import JwtService from "@/services/JwtService";

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

type FailedQueueItem = {
  reject: (error: unknown) => void;
  resolve: (accessToken: string) => void;
};

const baseUrl = process.env.EXPO_PUBLIC_API_URL;

let isRefreshing = false;
let failedQueue: FailedQueueItem[] = [];

function processQueue(error: unknown, accessToken?: string) {
  failedQueue.forEach(({ reject, resolve }) => {
    if (error || !accessToken) {
      reject(error);
      return;
    }

    resolve(accessToken);
  });

  failedQueue = [];
}

export const axiosClient = axios.create({
  baseURL: baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
  withCredentials: true,
});

axiosClient.interceptors.request.use(
  async (config) => {
    const isRefreshRequest = config.url?.includes("auth/refresh") ?? false;

    if (isRefreshRequest) {
      return config;
    }

    const accessToken = await JwtService.getAccessToken();

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error: unknown) => Promise.reject(error),
);

axiosClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const requestUrl = originalRequest.url ?? "";
    const isPublicAuthRequest = [
      "auth/email-availability",
      "auth/login",
      "auth/register",
      "auth/refresh",
    ].some((path) => requestUrl.includes(path));

    if (
      error.response?.status !== 401 ||
      originalRequest._retry ||
      isPublicAuthRequest
    ) {
      return Promise.reject(error);
    }

    const currentRefreshToken = await JwtService.getRefreshToken();

    if (!currentRefreshToken) {
      await JwtService.removeTokens();
      notifySessionExpired();
      router.replace("/account");
      return Promise.reject(error);
    }

    if (isRefreshing) {
      try {
        const accessToken = await new Promise<string>((resolve, reject) => {
          failedQueue.push({ reject, resolve });
        });

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return await axiosClient(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const response = await AuthService.refreshToken();
      const accessToken = response.access_token;

      await JwtService.setTokenPair(accessToken, response.refresh_token);
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      processQueue(null, accessToken);

      return await axiosClient(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError);
      await JwtService.removeTokens();
      notifySessionExpired();
      router.replace("/account");

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default axiosClient;
