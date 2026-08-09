import { AuthContext } from "@/context/auth.context";
import { Stack } from "expo-router";
import { useContext } from "react";

export const unstable_settings = {
  initialRouteName: "index",
};

export default function AccountLayout() {
  const context = useContext(AuthContext);
  if (context.loading) return null;

  return (
    <Stack>
      <Stack.Screen options={{ headerShown: false }} name="index" />

      {/** Route non protette */}
      <Stack.Protected guard={!context.isLoggedIn}>
        <Stack.Screen options={{ headerShown: false }} name="register" />
      </Stack.Protected>
    </Stack>
  );
}
