import axios from "axios";
import { useRouter } from "expo-router";
import { useCallback, useContext, useRef, useState } from "react";

import { AuthContext } from "@/context/auth.context";
import { useCart } from "@/context/cart.context";
import { useProductDetail } from "@/hooks/useProductDetail";
import { useVariationSelection } from "@/hooks/useVariationsSelection";
import { addCartItem } from "@/services/cart/cart.service";

import ProductDetailView from "./ProductDetailView";

type ProductDetailContainerProps = {
  productId?: string;
};

export default function ProductDetailContainer({
  productId,
}: ProductDetailContainerProps) {
  const router = useRouter();
  const { isLoggedIn } = useContext(AuthContext);
  const { increment } = useCart();
  const productDetail = useProductDetail(productId);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [addToCartError, setAddToCartError] = useState<string | null>(null);
  const addToCartRequestInFlight = useRef(false);

  const handleBackPress = useCallback(() => {
    router.back();
  }, [router]);

  const handleCartPress = useCallback(() => {
    router.push("/cart");
  }, [router]);

  const handleAddToCart = useCallback(
    async (quantity: number, variationIds: number[]) => {
      if (!productDetail.product) {
        return;
      }

      if (!isLoggedIn) {
        router.push("/login");
        return;
      }

      if (addToCartRequestInFlight.current) {
        return;
      }

      addToCartRequestInFlight.current = true;
      setAddToCartError(null);
      setIsAddingToCart(true);

      try {
        await addCartItem({
          productId: productDetail.product.id,
          quantity,
          variationIds,
        });
        increment(quantity);
      } catch (caughtError) {
        if (
          axios.isAxiosError<{
            errors?: Record<string, string[]>;
            message?: string;
          }>(caughtError)
        ) {
          const validationMessage = Object.values(
            caughtError.response?.data.errors ?? {},
          )[0]?.[0];

          setAddToCartError(
            validationMessage ??
              caughtError.response?.data.message ??
              "Non è stato possibile aggiungere il prodotto al carrello.",
          );
        } else {
          setAddToCartError(
            caughtError instanceof Error
              ? caughtError.message
              : "Non è stato possibile aggiungere il prodotto al carrello.",
          );
        }
      } finally {
        addToCartRequestInFlight.current = false;
        setIsAddingToCart(false);
      }
    },
    [increment, isLoggedIn, productDetail.product, router],
  );

  return (
    <ProductDetailView
      useVariationsSelection={useVariationSelection}
      addToCartError={addToCartError}
      error={productId ? productDetail.error : "A product id is required."}
      isAddingToCart={isAddingToCart}
      isLoading={productId ? productDetail.isLoading : false}
      onAddToCart={handleAddToCart}
      onBackPress={handleBackPress}
      onCartPress={handleCartPress}
      onRetry={productDetail.retry}
      product={productDetail.product}
      showCart={isLoggedIn}
    />
  );
}
