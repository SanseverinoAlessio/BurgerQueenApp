import axiosClient from "@/infrastructure/axios.client";
import type {
  CheckoutInfo,
  CreateOrderInput,
  CreateOrderResponse,
} from "@/types/checkout";

export async function getCheckoutInfo(
  typeId?: number,
  signal?: AbortSignal,
): Promise<CheckoutInfo> {
  const response = await axiosClient.get<CheckoutInfo>("/checkout", {
    params: typeId ? { type_id: typeId } : undefined,
    signal,
  });

  return response.data;
}

export async function createOrder(
  input: CreateOrderInput,
): Promise<CreateOrderResponse> {
  const response = await axiosClient.post<CreateOrderResponse>(
    "/order/create",
    input,
  );

  return response.data;
}
