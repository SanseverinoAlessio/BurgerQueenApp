import { useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";

import type { CartItem } from "@/types/cart";

import { CartView } from "./CartView";

const initialItems: CartItem[] = Array.from({ length: 4 }, (_, index) => ({
  description: "Lorem ipsum dolor sit amet, consectetur",
  id: index + 1,
  imageUrl: "/storage/images/products/fravecator.jpg",
  name: "Fravecatore",
  quantity: 2,
  unitPrice: 10,
}));

export function CartContainer() {
  const router = useRouter();
  const [items, setItems] = useState(initialItems);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const total = useMemo(
    () =>
      items.reduce(
        (currentTotal, item) =>
          currentTotal + item.unitPrice * item.quantity,
        0,
      ),
    [items],
  );

  const handleBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace("/");
  }, [router]);

  const handleDecrease = useCallback((itemId: number) => {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === itemId
          ? { ...item, quantity: Math.max(1, item.quantity - 1) }
          : item,
      ),
    );
  }, []);

  const handleIncrease = useCallback((itemId: number) => {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item,
      ),
    );
  }, []);

  const handleRemove = useCallback((itemId: number) => {
    setItems((currentItems) =>
      currentItems.filter((item) => item.id !== itemId),
    );
  }, []);

  const handleConfirm = useCallback(() => {
    // Order creation will be connected here.
  }, []);

  return (
    <CartView
      items={items}
      onBack={handleBack}
      onConfirm={handleConfirm}
      onDecrease={handleDecrease}
      onIncrease={handleIncrease}
      onRemove={handleRemove}
      onSelectTime={setSelectedTime}
      selectedTime={selectedTime}
      total={total}
    />
  );
}
