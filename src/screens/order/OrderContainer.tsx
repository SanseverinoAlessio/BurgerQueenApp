import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";

import { getCategories } from "@/services/categories/categories.service";
import type { category } from "@/types/category";

import { OrderView } from "./OrderView";

export function OrderContainer() {
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

  const handleCartPress = useCallback(() => {
    router.push("/cart");
  }, [router]);

  useEffect(() => {
    const controller = new AbortController();

    const fetchCategories = async () => {
      try {
        const response = await getCategories(controller.signal);
        setCategories(response.data);
      } catch (caughtError) {
        if (!controller.signal.aborted) {
          console.error("Unable to load categories.", caughtError);
        }
      }
    };

    fetchCategories();

    return () => controller.abort();
  }, []);

  return (
    <OrderView
      categories={categories}
      onCartPress={handleCartPress}
      onSuggestionPress={handleCategoryPress}
    />
  );
}
