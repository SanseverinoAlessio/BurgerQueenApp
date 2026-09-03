import { getProduct } from "@/services/products/products.service";
import type { ProductDetail } from "@/types/product";
import { useCallback, useEffect, useState } from "react";

type ProductDetailState = {
  error: string | null;
  isLoading: boolean;
  product: ProductDetail | null;
  productId: string | null;
};

export function useProductDetail(productId?: string) {
  const [requestVersion, setRequestVersion] = useState(0);
  const [state, setState] = useState<ProductDetailState>({
    error: null,
    isLoading: Boolean(productId),
    product: null,
    productId: productId ?? null,
  });

  const retry = useCallback(() => {
    if (productId) {
      setRequestVersion((version) => version + 1);
    }
  }, [productId]);

  useEffect(() => {
    if (!productId) {
      return;
    }

    const controller = new AbortController();
    const requestedProductId = productId;

    async function loadProduct() {
      setState({
        error: null,
        isLoading: true,
        product: null,
        productId: requestedProductId,
      });

      try {
        const response = await getProduct(
          requestedProductId,
          controller.signal,
        );

        setState({
          error: null,
          isLoading: false,
          product: response.data,
          productId: requestedProductId,
        });
      } catch (caughtError) {
        if (controller.signal.aborted) {
          return;
        }

        setState({
          error:
            caughtError instanceof Error
              ? caughtError.message
              : "Non è stato possibile caricare il prodotto.",
          isLoading: false,
          product: null,
          productId: requestedProductId,
        });
      }
    }

    loadProduct();

    return () => controller.abort();
  }, [productId, requestVersion]);

  const isCurrentProduct = state.productId === (productId ?? null);

  return {
    error: isCurrentProduct ? state.error : null,
    isLoading:
      Boolean(productId) && (!isCurrentProduct || state.isLoading),
    product: isCurrentProduct ? state.product : null,
    retry,
  };
}
