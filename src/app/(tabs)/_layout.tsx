import {
  TAB_BAR_BORDER_RADIUS,
  TAB_BAR_BOTTOM_GAP,
  TAB_BAR_HEIGHT,
  TAB_BAR_HORIZONTAL_INSET,
} from "@/constants/tabBar";
import { colors } from "@/theme/colors";
import { fonts } from "@/theme/fonts";
import { responsiveFontSize } from "@/utils/responsiveFontSize";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const tabBarBottom = insets.bottom + TAB_BAR_BOTTOM_GAP;

  return (
    <Tabs
      initialRouteName="(order)"
      screenOptions={{
        headerShown: false,
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
          borderRadius: TAB_BAR_BORDER_RADIUS,
          borderTopWidth: 0,
          bottom: tabBarBottom,
          elevation: 8,
          height: TAB_BAR_HEIGHT,
          left: TAB_BAR_HORIZONTAL_INSET,
          paddingBottom: 6,
          paddingTop: 6,
          position: "relative",
          right: TAB_BAR_HORIZONTAL_INSET,
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
