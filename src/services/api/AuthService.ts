import axiosClient from "@/infrastructure/axios.client";
import JwtService from "@/services/JwtService";
import type { RegistrationPayload } from "@/types/registration";

export type AuthTokenResponse = {
  access_token: string;
  expires_in: number;
  profile: unknown;
  refresh_expires_in: number;
  refresh_token: string;
  token_type: "bearer" | string;
};

const AuthService = {
  async refreshToken(): Promise<AuthTokenResponse> {
    const refreshToken = await JwtService.getRefreshToken();

    if (!refreshToken) {
      throw new Error("A refresh token is required to refresh the session.");
    }

    const response = await axiosClient.post("auth/refresh", {
      refresh_token: refreshToken,
    });

    return response.data;
  },

  async login(email: string, password: string): Promise<AuthTokenResponse> {
    const response = await axiosClient.post<AuthTokenResponse>("auth/login", {
      email,
      password,
    });

    return response.data;
  },

  async logout(): Promise<void> {
    const refreshToken = await JwtService.getRefreshToken();

    if (!refreshToken) {
      return;
    }

    await axiosClient.post("auth/logout", {
      refresh_token: refreshToken,
    });
  },

  async isEmailAvailable(email: string): Promise<boolean> {
    const response = await axiosClient.post<{ available: boolean }>(
      "auth/email-availability",
      { email },
    );

    return response.data.available;
  },

  async register(data: RegistrationPayload): Promise<AuthTokenResponse> {
    const response = await axiosClient.post<AuthTokenResponse>(
      "auth/register",
      data,
    );

    return response.data;
  },
};

export default AuthService;
