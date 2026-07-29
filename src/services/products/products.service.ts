import { apiClient, type ApiClient } from "@/core/api";
import type { Product, ProductDetail } from "@/types/product";

export async function getCategoryProducts(
  categoryId: string,
  signal?: AbortSignal,
  client: ApiClient = apiClient,
): Promise<Product[]> {
  return client.get<Product[]>(
    `/categories/${encodeURIComponent(categoryId)}/products`,
    { signal },
  );
}

export async function getProduct(
  productId: string,
  signal?: AbortSignal,
  client: ApiClient = apiClient,
): Promise<ProductDetail> {
  return client.get<ProductDetail>(
    `/products/${encodeURIComponent(productId)}`,
    { signal },
  );
}
