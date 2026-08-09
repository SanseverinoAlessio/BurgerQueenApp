import * as SecureStore from "expo-secure-store";

const ACCESS_TOKEN_KEY = "burger-queen-access-token";
const REFRESH_TOKEN_KEY = "burger-queen-refresh-token";

function getWebItem(key: string): string | null {
  return typeof localStorage === "undefined" ? null : localStorage.getItem(key);
}

const JwtService = {
  async getAccessToken(): Promise<string | null> {
    return SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
  },

  async setAccessToken(accessToken: string): Promise<void> {
    await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken);
  },

  async getRefreshToken(): Promise<string | null> {
    return SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
  },

  async setRefreshToken(refreshToken: string): Promise<void> {
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
  },

  async setTokenPair(accessToken: string, refreshToken: string): Promise<void> {
    await Promise.all([
      this.setAccessToken(accessToken),
      this.setRefreshToken(refreshToken),
    ]);
  },

  async removeAccessToken(): Promise<void> {
    await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
  },

  async removeTokens(): Promise<void> {
    await Promise.all([
      SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
      SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
    ]);
  },
};

export default JwtService;
