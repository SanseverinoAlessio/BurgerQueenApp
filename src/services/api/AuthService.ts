import axiosClient from "@/infrastructure/axios.client";
import JwtService from "@/services/JwtService";
import type { RegistrationPayload } from "@/types/registration";
import type { AuthTokenResponse, UserProfile } from "@/types/auth";

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

  async getProfile(): Promise<UserProfile> {
    const response = await axiosClient.get<UserProfile>("auth/me");
    return response.data;
  },

  async updateProfile(data: {
    first_name: string;
    last_name: string;
    phone: string;
  }): Promise<UserProfile> {
    const response = await axiosClient.patch<{ profile: UserProfile }>(
      "auth/profile",
      data,
    );
    return response.data.profile;
  },

  async updatePassword(data: {
    current_password: string;
    password: string;
    password_confirmation: string;
  }): Promise<void> {
    await axiosClient.put("auth/password", data);
  },

  async getPhoneVerificationStatus(): Promise<boolean> {
    const response = await axiosClient.get<{
      phone_number_verified: boolean;
    }>("auth/phone-verification");
    return response.data.phone_number_verified;
  },

  async sendPhoneVerificationOtp(): Promise<number> {
    const response = await axiosClient.post<{ retry_after: number }>(
      "auth/phone-verification/request",
    );
    return response.data.retry_after;
  },

  async verifyPhoneVerificationOtp(otp: string): Promise<UserProfile> {
    const response = await axiosClient.post<{ profile: UserProfile }>(
      "auth/phone-verification/verify",
      { otp },
    );
    return response.data.profile;
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
