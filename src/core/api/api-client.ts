type RequestOptions = {
  signal?: AbortSignal;
};

export type ApiClient = {
  get<T>(path: string, options?: RequestOptions): Promise<T>;
};

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export const apiClient: ApiClient = {
  async get<T>(path: string, options?: RequestOptions): Promise<T> {
    if (!apiUrl) {
      throw new Error("EXPO_PUBLIC_API_URL is not configured.");
    }

    const response = await fetch(`${apiUrl}${path}`, {
      method: "GET",
      signal: options?.signal,
    });

    if (!response.ok) {
      throw new Error(`Request failed (${response.status}).`);
    }

    return response.json() as Promise<T>;
  },
};
