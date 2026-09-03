import { Image } from "expo-image";
import { useContext, type ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AuthContext } from "@/context/auth.context";
import { colors } from "@/theme/colors";
import { fonts } from "@/theme/fonts";
import { responsiveFontSize } from "@/utils/responsiveFontSize";

import { CartButton } from "./CartButton";

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
  cartCount,
  onCartPress,
  showCart = true,
}: AppHeaderProps) {
  const insets = useSafeAreaInsets();
  const authContext = useContext(AuthContext);
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

      {showCart && authContext.isLoggedIn ? (
        <CartButton
          count={cartCount}
          onPress={onCartPress}
          style={styles.cartButton}
        />
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
    bottom: 6,
    position: "absolute",
    right: 30,
    zIndex: 2,
  },
});
