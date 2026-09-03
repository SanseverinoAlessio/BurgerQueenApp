import type { CartItem } from "@/types/cart";

export type CheckoutOption = {
  id: number;
  title: string;
};

export type CheckoutInfo = {
  hours: CheckoutOption[];
  types: CheckoutOption[];
};

export type CreateOrderInput = {
  address: string | null;
  cart: Array<{
    product: CartItem["productId"];
    quantity: CartItem["quantity"];
    variations: CartItem["variationIds"];
  }>;
  time: number;
  type: number;
};

export type CreateOrderResponse = {
  message: string;
};
