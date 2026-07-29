import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { AppHeader } from "@/components/AppHeader";
import { colors } from "@/theme/colors";
import { fonts } from "@/theme/fonts";
import type { Product } from "@/types/product";
import { responsiveFontSize } from "@/utils/responsiveFontSize";

import { ProductCard } from "./components/ProductCard";

type CategoryProductsViewProps = {
  categoryName: string;
  error: string | null;
  isLoading: boolean;
  onBackPress: () => void;
  onProductPress: (productId: number) => void;
  onRetry: () => void;
  products: Product[];
};

export function CategoryProductsView({
  categoryName,
  error,
  isLoading,
  onBackPress,
  onProductPress,
  onRetry,
  products,
}: CategoryProductsViewProps) {
  const titleParts = categoryName.trim().split(/\s+/);
  const titleStart = titleParts.slice(0, 2).join(" ");
  const titleAccent = titleParts.slice(2).join(" ");

  const emptyContent = isLoading ? (
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
  ) : (
    <Text style={styles.empty}>Nessun prodotto trovato.</Text>
  );

  const header = (
    <>
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
          <FontAwesome6
            color={colors.text}
            name="chevron-left"
            size={20}
          />
        </Pressable>
        <Text numberOfLines={2} style={styles.title}>
          {titleStart}
          {titleAccent ? (
            <Text style={styles.titleAccent}> {titleAccent}</Text>
          ) : null}
        </Text>
        <Pressable
          accessibilityLabel="Carrello, 1 prodotto"
          accessibilityRole="button"
          hitSlop={8}
          style={({ pressed }) => [
            styles.cartButton,
            pressed && styles.pressed,
          ]}
        >
          <FontAwesome6
            color={colors.text}
            name="cart-shopping"
            size={23}
          />
          <View style={styles.cartBadge}>
            <Text style={styles.cartBadgeText}>1</Text>
          </View>
        </Pressable>
      </View>
      <View style={styles.divider} />
    </>
  );

  return (
    <FlatList
      contentContainerStyle={styles.list}
      data={error || isLoading ? [] : products}
      keyExtractor={(product) => String(product.id)}
      ListEmptyComponent={emptyContent}
      ListHeaderComponent={header}
      renderItem={({ item }) => (
        <View style={styles.cardContainer}>
          <ProductCard
            onAddPress={() => onProductPress(item.id)}
            onPress={() => onProductPress(item.id)}
            product={item}
          />
        </View>
      )}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    backgroundColor: colors.background,
    flexGrow: 1,
    paddingBottom: 96,
  },
  heading: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
    marginTop: 28,
    paddingHorizontal: 22,
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
    fontSize: responsiveFontSize(30),
    lineHeight: 36,
  },
  titleAccent: {
    color: colors.title,
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
    marginBottom: 22,
    marginHorizontal: 22,
    marginTop: 12,
  },
  cardContainer: {
    marginBottom: 14,
    paddingHorizontal: 20,
  },
  status: {
    alignItems: "center",
    gap: 16,
    justifyContent: "center",
    minHeight: 180,
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
  empty: {
    color: colors.textMuted,
    fontFamily: fonts.regular,
    fontSize: responsiveFontSize(16),
    paddingHorizontal: 24,
    paddingVertical: 48,
    textAlign: "center",
  },
  error: {
    color: colors.error,
    fontFamily: fonts.regular,
    fontSize: responsiveFontSize(16),
    textAlign: "center",
  },
});
