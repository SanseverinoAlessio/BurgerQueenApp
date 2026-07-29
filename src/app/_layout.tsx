import {
  SignikaNegative_400Regular,
  SignikaNegative_600SemiBold,
  SignikaNegative_700Bold,
  useFonts,
} from "@expo-google-fonts/signika-negative";
import { Stack } from "expo-router";

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    SignikaNegative_400Regular,
    SignikaNegative_600SemiBold,
    SignikaNegative_700Bold,
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="login" />
    </Stack>
  );
}
