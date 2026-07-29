import { apiClient } from "@/core/api";
import { category } from "@/types/category";

export async function getCategories(): Promise<category[]> {
  return await apiClient.get("/categories");
}
