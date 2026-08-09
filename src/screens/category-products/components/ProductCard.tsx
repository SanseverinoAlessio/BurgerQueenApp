import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { Image } from "expo-image";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "@/theme/colors";
import { fonts } from "@/theme/fonts";
import type { Product } from "@/types/product";
import { resolveApiImageUrl } from "@/utils/resolveApiImageUrl";
import { responsiveFontSize } from "@/utils/responsiveFontSize";

type ProductCardProps = {
  onAddPress?: (product: Product) => void;
  onPress?: () => void;
  product: Product;
};

export function ProductCard({
  onAddPress,
  onPress,
  product,
}: ProductCardProps) {
  const formattedPrice = Number.isInteger(product.price)
    ? product.price.toFixed(0)
    : product.price.toFixed(2);
  const imageUrl = resolveApiImageUrl(product.img_url);

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      <View style={styles.media}>
        {imageUrl ? (
          <Image
            accessibilityLabel={product.name}
            contentFit="cover"
            source={{ uri: imageUrl }}
            style={styles.image}
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <FontAwesome6 color={colors.textMuted} name="burger" size={34} />
          </View>
        )}
      </View>
      <View style={styles.content}>
        <Text numberOfLines={1} style={styles.name}>
          {product.name}
        </Text>
        {product.description ? (
          <Text numberOfLines={2} style={styles.description}>
            {product.description}
          </Text>
        ) : null}
        <Text style={styles.price}>€ {formattedPrice}</Text>
      </View>

      <View style={{ width: "15%" }}>
        <Pressable
          accessibilityLabel={`Aggiungi ${product.name}`}
          accessibilityRole="button"
          hitSlop={6}
          onPress={() => onAddPress?.(product)}
          style={({ pressed }) => [
            styles.addButton,
            pressed && styles.addButtonPressed,
          ]}
        >
          <FontAwesome6 color={colors.surface} name="plus" size={22} />
        </Pressable>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 15,
    elevation: 6,
    flexDirection: "row",
    height: 110,
    overflow: "hidden",
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.22,
    shadowRadius: 6,
  },
  cardPressed: {
    opacity: 0.82,
  },
  media: {
    height: 110,
    position: "relative",
    width: "35%",
  },
  image: {
    bottom: 0,
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
  },
  imagePlaceholder: {
    alignItems: "center",
    backgroundColor: colors.border,
    flex: 1,
    justifyContent: "center",
  },
  addButton: {
    backgroundColor: colors.text,
    alignItems: "center",
    borderRadius: 18,
    bottom: -1,
    height: 110,
    justifyContent: "center",
    right: 0,
  },
  addButtonPressed: {
    opacity: 0.75,
  },
  content: {
    justifyContent: "center",
    width: "50%",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  name: {
    color: colors.text,
    fontFamily: fonts.bold,
    fontSize: responsiveFontSize(20),
    lineHeight: 23,
  },
  description: {
    color: colors.text,
    fontFamily: fonts.regular,
    fontSize: responsiveFontSize(16),
    lineHeight: 18,
    marginTop: 1,
  },
  price: {
    color: colors.text,
    fontFamily: fonts.bold,
    fontSize: responsiveFontSize(19),
    lineHeight: 22,
    marginTop: 7,
  },
});
