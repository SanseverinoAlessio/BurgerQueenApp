import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";

import { getCategoryProducts } from "@/services/products/products.service";
import type { Product } from "@/types/product";

import { CategoryProductsView } from "./CategoryProductsView";

type CategoryProductsContainerProps = {
  categoryId?: string;
  categoryName?: string;
};

export function CategoryProductsContainer({
  categoryId,
  categoryName = "Prodotti",
}: CategoryProductsContainerProps) {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [requestVersion, setRequestVersion] = useState(0);

  const retry = useCallback(() => {
    setRequestVersion((version) => version + 1);
  }, []);

  const handleBackPress = useCallback(() => {
    router.back();
  }, [router]);

  const handleProductPress = useCallback(
    (productId: number) => {
      router.push({
        pathname: "/categories/[CategoryId]/products/[ProductId]",
        params: {
          CategoryId: categoryId ?? "",
          ProductId: String(productId),
        },
      });
    },
    [categoryId, router],
  );

  useEffect(() => {
    const controller = new AbortController();

    async function loadProducts() {
      if (!categoryId) {
        setError("A category id is required.");
        setIsLoading(false);
        return;
      }

      setError(null);
      setIsLoading(true);

      try {
        const result = await getCategoryProducts(categoryId, controller.signal);
        setProducts(result);
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

    loadProducts();

    return () => controller.abort();
  }, [categoryId, requestVersion]);

  return (
    <CategoryProductsView
      categoryName={categoryName}
      error={error}
      isLoading={isLoading}
      onBackPress={handleBackPress}
      onProductPress={handleProductPress}
      onRetry={retry}
      products={products}
    />
  );
}
