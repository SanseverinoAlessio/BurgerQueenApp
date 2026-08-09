import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { Image } from "expo-image";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { AppHeader } from "@/components/AppHeader";
import { colors } from "@/theme/colors";
import { fonts } from "@/theme/fonts";
import type { ProductDetail } from "@/types/product";
import { resolveApiImageUrl } from "@/utils/resolveApiImageUrl";
import { responsiveFontSize } from "@/utils/responsiveFontSize";

type ProductDetailViewProps = {
  error: string | null;
  isLoading: boolean;
  onBackPress: () => void;
  onCartPress: () => void;
  onRetry: () => void;
  product: ProductDetail | null;
};

export default function ProductDetailView({
  error,
  isLoading,
  onBackPress,
  onCartPress,
  onRetry,
  product,
}: ProductDetailViewProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariations, setSelectedVariations] = useState<
    Record<number, number>
  >({});

  useEffect(() => {
    if (!product) {
      return;
    }

    setSelectedVariations(
      Object.fromEntries(
        product.groups
          .filter((group) => group.variations.length > 0 && group.min > 0)
          .map((group) => [group.id, group.variations[0].id]),
      ),
    );
  }, [product]);

  const imageUrl = resolveApiImageUrl(product?.img_url ?? null);

  return (
    <ScrollView
      contentContainerStyle={styles.page}
      showsVerticalScrollIndicator={false}
    >
      <AppHeader showCart={false} subtitle="Lorem ipsum" />

      <View style={styles.heading}>
        <Pressable
          accessibilityLabel="Torna indietro"
          accessibilityRole="button"
          hitSlop={10}
          onPress={onBackPress}
          style={({ pressed }) => [
            styles.backButton,
            pressed && styles.pressed,
          ]}
        >
          <FontAwesome6 color={colors.text} name="chevron-left" size={20} />
        </Pressable>
        <Text numberOfLines={1} style={styles.title}>
          {product?.name ?? "Prodotto"}
        </Text>
        <Pressable
          accessibilityLabel="Carrello, 1 prodotto"
          accessibilityRole="button"
          hitSlop={8}
          onPress={onCartPress}
          style={({ pressed }) => [
            styles.cartButton,
            pressed && styles.pressed,
          ]}
        >
          <FontAwesome6 color={colors.text} name="cart-shopping" size={23} />
          <View style={styles.cartBadge}>
            <Text style={styles.cartBadgeText}>1</Text>
          </View>
        </Pressable>
      </View>
      <View style={styles.divider} />

      {isLoading ? (
        <View style={styles.status}>
          <ActivityIndicator color={colors.title} size="large" />
        </View>
      ) : error ? (
        <View style={styles.status}>
          <Text style={styles.error}>{error}</Text>
          <Pressable
            accessibilityRole="button"
            onPress={onRetry}
            style={({ pressed }) => [
              styles.retryButton,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.retryText}>Riprova</Text>
          </Pressable>
        </View>
      ) : product ? (
        <View style={styles.content}>
          <View style={styles.productImageContainer}>
            {imageUrl ? (
              <Image
                accessibilityLabel={product.name}
                contentFit="cover"
                source={{ uri: imageUrl }}
                style={styles.productImage}
              />
            ) : (
              <View style={styles.imagePlaceholder}>
                <FontAwesome6
                  color={colors.textMuted}
                  name="burger"
                  size={60}
                />
              </View>
            )}
          </View>

          <View style={styles.detailsCard}>
            <Text style={styles.descriptionTitle}>Descrizione</Text>
            {product.description ? (
              <Text style={styles.description}>{product.description}</Text>
            ) : null}

            {product.groups.map((group) => (
              <View key={group.id} style={styles.group}>
                {product.groups.length > 1 || group.name ? (
                  <Text style={styles.groupTitle}>{group.name}</Text>
                ) : null}
                {group.description ? (
                  <Text style={styles.groupDescription}>
                    {group.description}
                  </Text>
                ) : null}
                {group.variations.map((variation) => {
                  const isSelected =
                    selectedVariations[group.id] === variation.id;

                  return (
                    <Pressable
                      accessibilityRole="radio"
                      accessibilityState={{ selected: isSelected }}
                      key={variation.id}
                      onPress={() =>
                        setSelectedVariations((current) => ({
                          ...current,
                          [group.id]: variation.id,
                        }))
                      }
                      style={styles.variation}
                    >
                      <View style={styles.radio}>
                        {isSelected ? (
                          <View style={styles.radioSelected} />
                        ) : null}
                      </View>
                      <Text style={styles.variationName}>{variation.name}</Text>
                    </Pressable>
                  );
                })}
              </View>
            ))}

            <View style={styles.actions}>
              <View style={styles.quantity}>
                <Pressable
                  accessibilityLabel="Riduci quantità"
                  accessibilityRole="button"
                  disabled={quantity === 1}
                  hitSlop={10}
                  onPress={() =>
                    setQuantity((current) => Math.max(1, current - 1))
                  }
                >
                  <FontAwesome6 color={colors.text} name="minus" size={17} />
                </Pressable>
                <Text style={styles.quantityText}>{quantity}</Text>
                <Pressable
                  accessibilityLabel="Aumenta quantità"
                  accessibilityRole="button"
                  hitSlop={10}
                  onPress={() => setQuantity((current) => current + 1)}
                >
                  <FontAwesome6 color={colors.text} name="plus" size={17} />
                </Pressable>
              </View>
              <Pressable
                accessibilityRole="button"
                style={({ pressed }) => [
                  styles.addButton,
                  pressed && styles.pressed,
                ]}
              >
                <Text style={styles.addButtonText}>Aggiungi</Text>
              </Pressable>
            </View>
          </View>
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: colors.background,
    flexGrow: 1,
    paddingBottom: 100,
  },
  heading: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
    marginTop: 28,
    paddingHorizontal: 16,
  },
  backButton: {
    alignItems: "center",
    backgroundColor: colors.title,
    borderRadius: 18,
    elevation: 3,
    height: 36,
    justifyContent: "center",
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    width: 36,
  },
  pressed: {
    opacity: 0.75,
  },
  title: {
    color: colors.text,
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: responsiveFontSize(32),
    lineHeight: 38,
  },
  cartButton: {
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
  cartBadge: {
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
  cartBadgeText: {
    color: colors.badgeText,
    fontFamily: fonts.bold,
    fontSize: responsiveFontSize(11),
  },
  divider: {
    backgroundColor: colors.textMuted,
    height: 1,
    marginBottom: 28,
    marginHorizontal: 16,
    marginTop: 12,
  },
  content: {
    gap: 38,
    paddingHorizontal: 16,
  },
  productImageContainer: {
    backgroundColor: colors.border,
    borderRadius: 15,
    height: 295,
    overflow: "hidden",
  },
  productImage: {
    height: "100%",
    width: "100%",
  },
  imagePlaceholder: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  detailsCard: {
    backgroundColor: colors.card,
    borderRadius: 15,
    elevation: 5,
    padding: 26,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  descriptionTitle: {
    color: colors.text,
    fontFamily: fonts.bold,
    fontSize: responsiveFontSize(30),
    lineHeight: 35,
  },
  description: {
    color: colors.text,
    fontFamily: fonts.regular,
    fontSize: responsiveFontSize(19),
    lineHeight: 25,
    marginTop: 8,
  },
  group: {
    marginTop: 26,
  },
  groupTitle: {
    color: colors.text,
    fontFamily: fonts.semiBold,
    fontSize: responsiveFontSize(18),
    marginBottom: 8,
  },
  groupDescription: {
    color: colors.text,
    fontFamily: fonts.regular,
    fontSize: responsiveFontSize(15),
    marginBottom: 8,
  },
  variation: {
    alignItems: "center",
    flexDirection: "row",
    gap: 9,
    minHeight: 34,
  },
  radio: {
    alignItems: "center",
    borderColor: colors.text,
    borderRadius: 11,
    borderWidth: 1.5,
    height: 22,
    justifyContent: "center",
    width: 22,
  },
  radioSelected: {
    backgroundColor: colors.text,
    borderRadius: 6,
    height: 12,
    width: 12,
  },
  variationName: {
    color: colors.text,
    fontFamily: fonts.regular,
    fontSize: responsiveFontSize(18),
  },
  actions: {
    alignItems: "center",
    flexDirection: "row",
    gap: 24,
    marginTop: 30,
  },
  quantity: {
    alignItems: "center",
    flexDirection: "row",
    gap: 16,
  },
  quantityText: {
    color: colors.text,
    fontFamily: fonts.bold,
    fontSize: responsiveFontSize(24),
  },
  addButton: {
    backgroundColor: colors.text,
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 13,
  },
  addButtonText: {
    color: colors.surface,
    fontFamily: fonts.bold,
    fontSize: responsiveFontSize(18),
  },
  status: {
    alignItems: "center",
    gap: 16,
    justifyContent: "center",
    minHeight: 240,
    paddingHorizontal: 24,
  },
  retryButton: {
    backgroundColor: colors.title,
    borderRadius: 18,
    paddingHorizontal: 22,
    paddingVertical: 9,
  },
  retryText: {
    color: colors.text,
    fontFamily: fonts.bold,
    fontSize: responsiveFontSize(16),
  },
  error: {
    color: colors.error,
    fontFamily: fonts.regular,
    fontSize: responsiveFontSize(16),
    textAlign: "center",
  },
});
