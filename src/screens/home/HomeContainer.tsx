import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";

import { getCategories } from "@/services/categories/categories.service";
import type { category } from "@/types/category";

import { HomeView } from "./HomeView";

export function HomeContainer() {
  const router = useRouter();
  const [categories, setCategories] = useState<category[]>([]);

  const handleCategoryPress = useCallback(
    (categoryId: number) => {
      const category = categories.find((item) => item.id === categoryId);

      router.push({
        pathname: "/categories/[CategoryId]/products",
        params: {
          CategoryId: String(categoryId),
          CategoryName: category?.name ?? "Prodotti",
        },
      });
    },
    [categories, router],
  );

  useEffect(() => {
    const fetchCategories = async () => {
      let categories = await getCategories();
      setCategories(categories);
    };

    fetchCategories();
  }, []);

  return (
    <HomeView
      categories={categories}
      onSuggestionPress={handleCategoryPress}
    />
  );
}
