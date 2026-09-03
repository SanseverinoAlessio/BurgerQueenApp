export type UserProfile = {
  email: string;
  first_name: string;
  id: number;
  last_name: string;
  phone: string;
  phone_number_verified_at: string | null;
};

export type AuthTokenResponse = {
  access_token: string;
  expires_in: number;
  profile: UserProfile;
  refresh_expires_in: number;
  refresh_token: string;
  token_type: "bearer" | string;
};
