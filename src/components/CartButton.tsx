import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import type { StyleProp, ViewStyle } from "react-native";

import { useCart } from "@/context/cart.context";
import { colors } from "@/theme/colors";
import { fonts } from "@/theme/fonts";
import { responsiveFontSize } from "@/utils/responsiveFontSize";

type CartButtonProps = {
  count?: number;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

export function CartButton({
  count,
  onPress,
  style,
}: CartButtonProps) {
  const { itemsCount } = useCart();
  const resolvedCount = count ?? itemsCount;
  const productLabel = resolvedCount === 1 ? "prodotto" : "prodotti";

  return (
    <Pressable
      accessibilityLabel={`Carrello, ${resolvedCount} ${productLabel}`}
      accessibilityRole="button"
      hitSlop={8}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        style,
        pressed && styles.pressed,
      ]}
    >
      <FontAwesome6 color={colors.text} name="cart-shopping" size={23} />
      {resolvedCount > 0 ? (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{resolvedCount}</Text>
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    backgroundColor: colors.cartButton,
    borderRadius: 27,
    elevation: 4,
    height: 54,
    justifyContent: "center",
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    width: 54,
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
  pressed: {
    opacity: 0.8,
  },
});
