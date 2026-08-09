import ProductDetailContainer from "@/screens/product-detail/ProductDetailContainer";
import { useLocalSearchParams } from "expo-router";

export default function ProductDetailRoute() {
  const { ProductId } = useLocalSearchParams<{ ProductId: string }>();

  return <ProductDetailContainer productId={ProductId} />;
}
