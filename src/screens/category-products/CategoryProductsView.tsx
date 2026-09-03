import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppHeader } from "@/components/AppHeader";
import { CartButton } from "@/components/CartButton";
import { colors } from "@/theme/colors";
import { fonts } from "@/theme/fonts";
import type { ElementMeasurements } from "@/types/layout";
import type { Product } from "@/types/product";
import { responsiveFontSize } from "@/utils/responsiveFontSize";

import { ProductCard } from "./components/ProductCard";

type CategoryProductsViewProps = {
  categoryName: string;
  error: string | null;
  isLoading: boolean;
  onBackPress: () => void;
  onCartPress: () => void;
  onProductPress: (productId: number) => void;
  onQuickAddPress: (
    productId: number,
    buttonMeasurements: ElementMeasurements,
  ) => void;
  onRetry: () => void;
  products: Product[];
  showCart: boolean;
};

export default function CategoryProductsView({
  categoryName,
  error,
  isLoading,
  onBackPress,
  onCartPress,
  onProductPress,
  onQuickAddPress,
  onRetry,
  products,
  showCart,
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
        style={({ pressed }) => [styles.retryButton, pressed && styles.pressed]}
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
          <FontAwesome6 color={colors.text} name="chevron-left" size={20} />
        </Pressable>
        <Text numberOfLines={2} style={styles.title}>
          {titleStart}
          {titleAccent ? (
            <Text style={styles.titleAccent}> {titleAccent}</Text>
          ) : null}
        </Text>
        {showCart ? <CartButton onPress={onCartPress} /> : null}
      </View>
      <View style={styles.divider} />
    </>
  );

  return (
    <SafeAreaView edges={["right", "bottom", "left"]} style={styles.safeArea}>
      <FlatList
        contentContainerStyle={styles.list}
        data={error || isLoading ? [] : products}
        keyExtractor={(product) => String(product.id)}
        ListEmptyComponent={emptyContent}
        ListHeaderComponent={header}
        renderItem={({ item }) => (
          <View style={styles.cardContainer}>
            <ProductCard
              onAddPress={(product, measurements) =>
                onQuickAddPress(product.id, measurements)
              }
              onPress={() => onProductPress(item.id)}
              product={item}
            />
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.background,
    flex: 1,
  },
  list: {
    backgroundColor: colors.background,
    flexGrow: 1,
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
