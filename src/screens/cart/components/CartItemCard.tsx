import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { Image } from "expo-image";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "@/theme/colors";
import { fonts } from "@/theme/fonts";
import type { CartItem } from "@/types/cart";
import { resolveApiImageUrl } from "@/utils/resolveApiImageUrl";
import { responsiveFontSize } from "@/utils/responsiveFontSize";

import { QuantityPicker } from "./QuantityPicker";

type CartItemCardProps = {
  isUpdating: boolean;
  item: CartItem;
  onDecrease: () => void;
  onIncrease: () => void;
  onRemove: () => void;
};

export function CartItemCard({
  isUpdating,
  item,
  onDecrease,
  onIncrease,
  onRemove,
}: CartItemCardProps) {
  const imageUrl = resolveApiImageUrl(item.imageUrl);
  const formattedPrice = Number.isInteger(item.unitPrice)
    ? item.unitPrice.toFixed(0)
    : item.unitPrice.toFixed(2);

  return (
    <View style={styles.shadow}>
      <View style={styles.card}>
        <View style={styles.media}>
          {imageUrl ? (
            <Image
              accessibilityLabel={item.name}
              contentFit="cover"
              source={{ uri: imageUrl }}
              style={styles.image}
            />
          ) : (
            <View style={styles.placeholder}>
              <FontAwesome6 color={colors.textMuted} name="burger" size={35} />
            </View>
          )}
        </View>

        <View style={styles.content}>
          <Text numberOfLines={1} style={styles.name}>
            {item.name}
          </Text>
          {item.description ? (
            <Text numberOfLines={2} style={styles.description}>
              {item.description}
            </Text>
          ) : null}
          <Text style={styles.price}>€ {formattedPrice}</Text>

          <View style={styles.quantityPicker}>
            <QuantityPicker
              accessibilityLabel={`Quantità di ${item.name}`}
              isLoading={isUpdating}
              onDecrease={onDecrease}
              onIncrease={onIncrease}
              quantity={item.quantity}
            />
          </View>
        </View>
      </View>

      <Pressable
        accessibilityLabel={`Rimuovi ${item.name} dal carrello`}
        accessibilityRole="button"
        hitSlop={7}
        onPress={onRemove}
        style={({ pressed }) => [
          styles.removeButton,
          pressed && styles.pressed,
        ]}
      >
        <FontAwesome6 color={colors.surface} name="xmark" size={14} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  shadow: {
    backgroundColor: colors.card,
    borderRadius: 12,
    elevation: 4,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.16,
    shadowRadius: 5,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    flexDirection: "row",
    height: 108,
    overflow: "hidden",
  },
  media: {
    backgroundColor: colors.border,
    width: "34%",
  },
  image: {
    height: "100%",
    width: "100%",
  },
  placeholder: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  content: {
    flex: 1,
    paddingBottom: 9,
    paddingHorizontal: 9,
    paddingTop: 10,
  },
  name: {
    color: colors.text,
    fontFamily: fonts.bold,
    fontSize: responsiveFontSize(17),
    lineHeight: 20,
    paddingRight: 18,
  },
  description: {
    color: colors.text,
    fontFamily: fonts.regular,
    fontSize: responsiveFontSize(15),
    lineHeight: 18,
    paddingRight: 8,
  },
  price: {
    color: colors.text,
    fontFamily: fonts.semiBold,
    fontSize: responsiveFontSize(19),
    marginTop: 7,
  },
  quantityPicker: {
    bottom: 10,
    position: "absolute",
    right: 10,
  },
  removeButton: {
    alignItems: "center",
    backgroundColor: "#EF4444",
    borderRadius: 11,
    height: 22,
    justifyContent: "center",
    position: "absolute",
    right: -5,
    top: -5,
    width: 22,
  },
  pressed: {
    opacity: 0.65,
  },
});
