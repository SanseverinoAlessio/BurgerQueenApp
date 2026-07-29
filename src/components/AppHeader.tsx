import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { Image } from "expo-image";
import type { ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors } from "@/theme/colors";
import { fonts } from "@/theme/fonts";
import { responsiveFontSize } from "@/utils/responsiveFontSize";

type AppHeaderProps = {
  brand?: ReactNode;
  subtitle?: string;
  cartCount?: number;
  onCartPress?: () => void;
  showCart?: boolean;
};

const logo = require("@/assets/images/burgerqueen_logo.svg");

export function AppHeader({
  brand,
  subtitle,
  cartCount = 0,
  onCartPress,
  showCart = true,
}: AppHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <View style={[styles.background, { paddingTop: insets.top + 8 }]}>
        <View>
          {brand ?? (
            <View style={styles.defaultBrand}>
              <Image contentFit="contain" source={logo} style={styles.logo} />
            </View>
          )}
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
      </View>
      <View pointerEvents="none" style={styles.angledEdge} />

      {showCart ? (
        <Pressable
          accessibilityLabel={`Carrello, ${cartCount} prodotti`}
          accessibilityRole="button"
          hitSlop={8}
          onPress={onCartPress}
          style={({ pressed }) => [
            styles.cartButton,
            pressed && styles.cartButtonPressed,
          ]}
        >
          <FontAwesome6
            color={colors.text}
            name="cart-shopping"
            size={23}
          />
          {cartCount > 0 ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{cartCount}</Text>
            </View>
          ) : null}
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 198,
    overflow: "hidden",
    position: "relative",
  },
  background: {
    backgroundColor: colors.header,
    height: 144,
    paddingHorizontal: 28,
    zIndex: 1,
  },
  angledEdge: {
    backgroundColor: colors.header,
    height: 58,
    left: -14,
    position: "absolute",
    right: -14,
    top: 120,
    transform: [{ rotate: "-5deg" }],
  },
  defaultBrand: {
    alignItems: "center",
    alignSelf: "flex-start",
    flexDirection: "row",
  },
  logo: {
    height: 116,
    width: 155,
  },
  subtitle: {
    color: colors.title,
    fontFamily: fonts.regular,
    fontSize: responsiveFontSize(16),
    marginLeft: 28,
    marginTop: -5,
  },
  cartButton: {
    alignItems: "center",
    backgroundColor: colors.cartButton,
    borderRadius: 28,
    bottom: 6,
    height: 54,
    justifyContent: "center",
    position: "absolute",
    right: 30,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    width: 54,
    zIndex: 2,
  },
  cartButtonPressed: {
    opacity: 0.8,
  },
  badge: {
    alignItems: "center",
    backgroundColor: colors.badge,
    borderRadius: 10,
    bottom: -1,
    height: 20,
    justifyContent: "center",
    position: "absolute",
    right: -3,
    width: 20,
  },
  badgeText: {
    color: colors.badgeText,
    fontFamily: fonts.bold,
    fontSize: responsiveFontSize(11),
  },
});
