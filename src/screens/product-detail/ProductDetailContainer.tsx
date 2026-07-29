import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";

import { getProduct } from "@/services/products/products.service";
import type { ProductDetail } from "@/types/product";

import { ProductDetailView } from "./ProductDetailView";

type ProductDetailContainerProps = {
  productId?: string;
};

export function ProductDetailContainer({
  productId,
}: ProductDetailContainerProps) {
  const router = useRouter();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [requestVersion, setRequestVersion] = useState(0);

  const handleBackPress = useCallback(() => {
    router.back();
  }, [router]);

  const retry = useCallback(() => {
    setRequestVersion((version) => version + 1);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function loadProduct() {
      if (!productId) {
        setError("A product id is required.");
        setIsLoading(false);
        return;
      }

      setError(null);
      setIsLoading(true);

      try {
        const result = await getProduct(productId, controller.signal);
        setProduct(result);
      } catch (caughtError) {
        if (caughtError instanceof Error && caughtError.name === "AbortError") {
          return;
        }

        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "Something went wrong.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    loadProduct();

    return () => controller.abort();
  }, [productId, requestVersion]);

  return (
    <ProductDetailView
      error={error}
      isLoading={isLoading}
      onBackPress={handleBackPress}
      onRetry={retry}
      product={product}
    />
  );
}
