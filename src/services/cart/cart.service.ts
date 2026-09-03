import axiosClient from "@/infrastructure/axios.client";
import type {
  AddCartItemInput,
  AddCartItemResponse,
  Cart,
  CartItemVariation,
  UpdateCartItemResponse,
} from "@/types/cart";

type CartApiResponse = {
  cart: {
    expires_at: string;
    id: number;
  } | null;
  items: {
    description: string | null;
    id: number;
    image_url: string | null;
    line_total: number;
    name: string;
    product_id: number;
    quantity: number;
    unit_price: number;
    variation_ids: number[];
    variations: CartItemVariation[];
  }[];
  total: number;
};

export async function getCart(signal?: AbortSignal): Promise<Cart> {
  const response = await axiosClient.get<CartApiResponse>("/cart", { signal });

  return {
    expiresAt: response.data.cart?.expires_at ?? null,
    id: response.data.cart?.id ?? null,
    items: response.data.items.map((item) => ({
      description: item.description,
      id: item.id,
      imageUrl: item.image_url,
      name: item.name,
      productId: item.product_id,
      quantity: item.quantity,
      unitPrice: item.unit_price,
      variationIds: item.variation_ids,
      variations: item.variations,
    })),
    total: response.data.total,
  };
}

export async function updateCartItemQuantity(
  itemId: number,
  quantity: number,
): Promise<UpdateCartItemResponse> {
  const response = await axiosClient.patch<UpdateCartItemResponse>(
    `/cart/items/${itemId}`,
    { quantity },
  );

  return response.data;
}

export async function removeCartItem(itemId: number): Promise<void> {
  await axiosClient.delete(`/cart/items/${itemId}`);
}

export async function addCartItem({
  productId,
  quantity,
  variationIds,
}: AddCartItemInput): Promise<AddCartItemResponse> {
  if (!Number.isInteger(quantity) || quantity < 1) {
    throw new Error("La quantità deve essere maggiore di zero.");
  }

  let cartResponse: AddCartItemResponse | null = null;

  for (let itemIndex = 0; itemIndex < quantity; itemIndex += 1) {
    const response = await axiosClient.post<AddCartItemResponse>(
      "/cart/items",
      {
        product_id: productId,
        variation_ids: variationIds,
      },
    );

    cartResponse = response.data;
  }

  return cartResponse as AddCartItemResponse;
}
