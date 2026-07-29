import { useLocalSearchParams } from "expo-router";

import { ProductDetailContainer } from "@/screens/product-detail";

export default function ProductDetailRoute() {
  const { ProductId } = useLocalSearchParams<{ ProductId: string }>();

  return <ProductDetailContainer productId={ProductId} />;
}
