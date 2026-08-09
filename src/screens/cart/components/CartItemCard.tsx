import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { Image } from "expo-image";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "@/theme/colors";
import { fonts } from "@/theme/fonts";
import type { CartItem } from "@/types/cart";
import { resolveApiImageUrl } from "@/utils/resolveApiImageUrl";
import { responsiveFontSize } from "@/utils/responsiveFontSize";

type CartItemCardProps = {
  item: CartItem;
  onDecrease: () => void;
  onIncrease: () => void;
  onRemove: () => void;
};

export function CartItemCard({
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

          <View style={styles.quantity}>
            <Pressable
              accessibilityLabel={`Riduci quantità di ${item.name}`}
              accessibilityRole="button"
              disabled={item.quantity === 1}
              hitSlop={8}
              onPress={onDecrease}
              style={({ pressed }) => pressed && styles.pressed}
            >
              <FontAwesome6
                color={item.quantity === 1 ? colors.textMuted : colors.text}
                name="minus"
                size={14}
              />
            </Pressable>
            <Text style={styles.quantityText}>{item.quantity}</Text>
            <Pressable
              accessibilityLabel={`Aumenta quantità di ${item.name}`}
              accessibilityRole="button"
              hitSlop={8}
              onPress={onIncrease}
              style={({ pressed }) => pressed && styles.pressed}
            >
              <FontAwesome6 color={colors.text} name="plus" size={14} />
            </Pressable>
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
    fontSize: responsiveFontSize(13),
    lineHeight: 15,
    paddingRight: 8,
  },
  price: {
    color: colors.text,
    fontFamily: fonts.semiBold,
    fontSize: responsiveFontSize(16),
    marginTop: 7,
  },
  quantity: {
    alignItems: "center",
    bottom: 10,
    flexDirection: "row",
    gap: 12,
    position: "absolute",
    right: 10,
  },
  quantityText: {
    color: colors.text,
    fontFamily: fonts.bold,
    fontSize: responsiveFontSize(17),
    minWidth: 12,
    textAlign: "center",
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
