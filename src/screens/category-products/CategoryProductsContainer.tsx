import { getCategoryProducts } from "@/services/products/products.service";
import type { Product } from "@/types/product";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import CategoryProductsView from "./CategoryProductsView";

type CategoryProductsContainerProps = {
  categoryId?: string;
  categoryName?: string;
};

export default function CategoryProductsContainer({
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
    router.dismissTo("/");
  }, [router]);

  const handleCartPress = useCallback(() => {
    router.push("/cart");
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
        const response = await getCategoryProducts(
          categoryId,
          controller.signal,
        );
        setProducts(response.data);
      } catch (caughtError) {
        if (controller.signal.aborted) {
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
      onCartPress={handleCartPress}
      onProductPress={handleProductPress}
      onRetry={retry}
      products={products}
    />
  );
}
