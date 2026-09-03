import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { AuthContext } from "@/context/auth.context";
import { getCart } from "@/services/cart/cart.service";

type CartContextValue = {
  decrement: (quantity?: number) => void;
  getCounts: () => number;
  increment: (quantity?: number) => void;
  itemsCount: number;
  setItemsCount: (quantity: number) => void;
};

export const CartContext = createContext<CartContextValue | undefined>(
  undefined,
);

function normalizeQuantity(quantity: number): number {
  if (!Number.isFinite(quantity)) {
    return 0;
  }

  return Math.max(0, Math.trunc(quantity));
}

export function CartProvider({ children }: PropsWithChildren) {
  const { isLoggedIn } = useContext(AuthContext);
  const [itemsCount, setItemsCountState] = useState(0);

  const setItemsCount = useCallback((quantity: number) => {
    setItemsCountState(normalizeQuantity(quantity));
  }, []);

  const increment = useCallback((quantity = 1) => {
    const normalizedQuantity = normalizeQuantity(quantity);
    setItemsCountState((currentCount) => currentCount + normalizedQuantity);
  }, []);

  const decrement = useCallback((quantity = 1) => {
    const normalizedQuantity = normalizeQuantity(quantity);
    setItemsCountState((currentCount) =>
      Math.max(0, currentCount - normalizedQuantity),
    );
  }, []);

  const getCounts = useCallback(() => itemsCount, [itemsCount]);

  useEffect(() => {
    if (!isLoggedIn) {
      setItemsCountState(0);
      return;
    }

    const controller = new AbortController();

    async function loadItemsCount() {
      try {
        const cart = await getCart(controller.signal);

        if (!controller.signal.aborted) {
          setItemsCountState(
            cart.items.reduce(
              (currentCount, item) => currentCount + item.quantity,
              0,
            ),
          );
        }
      } catch (caughtError) {
        if (!controller.signal.aborted) {
          console.error("Unable to load the cart items count.", caughtError);
        }
      }
    }

    void loadItemsCount();

    return () => controller.abort();
  }, [isLoggedIn]);

  const value = useMemo(
    () => ({
      decrement,
      getCounts,
      increment,
      itemsCount,
      setItemsCount,
    }),
    [decrement, getCounts, increment, itemsCount, setItemsCount],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);

  if (context === undefined) {
    throw new Error("useCart must be used inside CartProvider.");
  }

  return context;
}
