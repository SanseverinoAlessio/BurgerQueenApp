import axiosClient from "@/infrastructure/axios.client";
import type { category } from "@/types/category";
import type { AxiosResponse } from "axios";

export async function getCategories(
  signal?: AbortSignal,
): Promise<AxiosResponse<category[]>> {
  return axiosClient.get<category[]>("/categories", { signal });
}
