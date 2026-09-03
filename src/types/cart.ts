export type CartItem = {
  description: string | null;
  id: number;
  imageUrl: string | null;
  name: string;
  productId: number;
  quantity: number;
  unitPrice: number;
  variationIds: number[];
  variations: CartItemVariation[];
};

export type CartItemVariation = {
  id: number;
  name: string;
  price: number;
};

export type Cart = {
  expiresAt: string | null;
  id: number | null;
  items: CartItem[];
  total: number;
};

export type AddCartItemInput = {
  productId: number;
  quantity: number;
  variationIds: number[];
};

export type AddCartItemResponse = {
  message: string;
  cart: {
    expires_at: string;
    id: number;
  };
  item: {
    id: number;
    product_id: number;
    quantity: number;
    variation_ids: number[];
  };
};

export type UpdateCartItemResponse = {
  message: string;
  item: {
    id: number;
    quantity: number;
  };
};
