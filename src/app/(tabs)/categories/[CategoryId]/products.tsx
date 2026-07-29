import { useLocalSearchParams } from "expo-router";

import { CategoryProductsContainer } from "@/screens/category-products";

export default function CategoryProductsRoute() {
  const { CategoryId, CategoryName } = useLocalSearchParams<{
    CategoryId: string;
    CategoryName?: string;
  }>();

  return (
    <CategoryProductsContainer
      categoryId={CategoryId}
      categoryName={CategoryName}
    />
  );
}
