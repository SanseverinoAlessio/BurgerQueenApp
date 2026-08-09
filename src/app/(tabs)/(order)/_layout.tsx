import { Stack } from "expo-router";

export const unstable_settings = {
  initialRouteName: "index",
};

export default function OrderLayout() {
  return (
    <Stack initialRouteName="index" screenOptions={{ headerShown: false }} />
  );
}
