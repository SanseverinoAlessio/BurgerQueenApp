import CategoryProductsContainer from "@/screens/category-products/CategoryProductsContainer";
import { useLocalSearchParams } from "expo-router";

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
