const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export function resolveApiImageUrl(imageUrl: string | null) {
  if (!imageUrl || !apiUrl) {
    return imageUrl;
  }

  try {
    const apiOrigin = new URL(apiUrl);
    const resolvedUrl = new URL(imageUrl, `${apiOrigin.origin}/`);
    const usesLocalBackendHost =
      resolvedUrl.hostname === "localhost" ||
      resolvedUrl.hostname === "127.0.0.1" ||
      resolvedUrl.hostname.endsWith(".local") ||
      resolvedUrl.hostname.endsWith(".test");

    if (usesLocalBackendHost) {
      resolvedUrl.protocol = apiOrigin.protocol;
      resolvedUrl.host = apiOrigin.host;
    }

    return resolvedUrl.toString();
  } catch {
    return imageUrl;
  }
}
