import axiosClient from "@/infrastructure/axios.client";
import type { Product, ProductDetail } from "@/types/product";
import type { AxiosResponse } from "axios";

export async function getCategoryProducts(
  categoryId: string,
  signal?: AbortSignal,
): Promise<AxiosResponse<Product[]>> {
  return axiosClient.get<Product[]>(
    `/categories/${encodeURIComponent(categoryId)}/products`,
    { signal },
  );
}

export async function getProduct(
  productId: string,
  signal?: AbortSignal,
): Promise<AxiosResponse<ProductDetail>> {
  return axiosClient.get<ProductDetail>(
    `/products/${encodeURIComponent(productId)}`,
    { signal },
  );
}
