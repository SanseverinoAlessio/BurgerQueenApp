import { AuthContext, AuthProvider } from "@/context/auth.context";
import {
  SignikaNegative_400Regular,
  SignikaNegative_600SemiBold,
  SignikaNegative_700Bold,
  useFonts,
} from "@expo-google-fonts/signika-negative";
import { Stack } from "expo-router";
import { useContext } from "react";

function RootNavigator() {
  const { isLoggedIn, loading } = useContext(AuthContext);

  if (loading) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Protected guard={isLoggedIn}>
        <Stack.Screen name="(protected)" />
      </Stack.Protected>
      <Stack.Screen name="cart" />
      <Stack.Screen name="login" />
    </Stack>
  );
}

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
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}
