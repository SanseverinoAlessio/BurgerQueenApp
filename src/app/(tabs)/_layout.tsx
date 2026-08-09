import { colors } from "@/theme/colors";
import { fonts } from "@/theme/fonts";
import { responsiveFontSize } from "@/utils/responsiveFontSize";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs
      initialRouteName="(order)"
      screenOptions={{
        headerShown: false,
        sceneStyle: {
          backgroundColor: colors.background,
        },
        tabBarActiveTintColor: colors.text,
        tabBarHideOnKeyboard: true,
        tabBarInactiveTintColor: colors.text,
        tabBarItemStyle: {
          paddingVertical: 4,
        },
        tabBarLabelStyle: {
          fontFamily: fonts.bold,
          fontSize: responsiveFontSize(14),
          lineHeight: 16,
        },
        tabBarStyle: {
          backgroundColor: colors.tabBar,
          borderRadius: 18,
          borderTopWidth: 0,
          bottom: 0,
          elevation: 8,
          height: 72,
          left: 14,
          paddingBottom: 6,
          paddingTop: 6,
          position: "absolute",
          right: 14,
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 5 },
          shadowOpacity: 0.18,
          shadowRadius: 6,
        },
      }}
    >
      <Tabs.Screen
        name="(order)"
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome6 color={color} name="burger" size={24} />
          ),
          title: "Ordina",
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome6 color={color} name="list" size={24} />
          ),
          title: "Ordini",
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome6 color={color} name="user" size={24} />
          ),
          title: "Account",
        }}
      />
    </Tabs>
  );
}
