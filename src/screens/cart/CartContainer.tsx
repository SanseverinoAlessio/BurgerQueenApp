import axios from "axios";
import { useRouter } from "expo-router";
import { Alert, Platform } from "react-native";
import { useCallback, useEffect, useRef, useState } from "react";

import { useCart } from "@/context/cart.context";
import AuthService from "@/services/api/AuthService";
import {
  getCart,
  removeCartItem,
  updateCartItemQuantity,
} from "@/services/cart/cart.service";
import {
  createOrder,
  getCheckoutInfo,
} from "@/services/checkout/checkout.service";
import type { Cart, CartItem } from "@/types/cart";
import type { CheckoutOption } from "@/types/checkout";

import { CartView } from "./CartView";

type ApiError = {
  code?: string;
  errors?: Record<string, string[]>;
  message?: string;
};

function getErrorMessage(caughtError: unknown, fallback: string): string {
  if (!axios.isAxiosError<ApiError>(caughtError)) {
    return caughtError instanceof Error ? caughtError.message : fallback;
  }

  return (
    Object.values(caughtError.response?.data.errors ?? {})[0]?.[0] ??
    caughtError.response?.data.message ??
    fallback
  );
}

export function CartContainer() {
  const router = useRouter();
  const { setItemsCount } = useCart();
  const [items, setItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [orderTypes, setOrderTypes] = useState<CheckoutOption[]>([]);
  const [availableHours, setAvailableHours] = useState<CheckoutOption[]>([]);
  const [selectedTypeId, setSelectedTypeId] = useState<number | null>(null);
  const [selectedTimeId, setSelectedTimeId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [isPhoneVerificationVisible, setIsPhoneVerificationVisible] =
    useState(false);
  const [requestVersion, setRequestVersion] = useState(0);
  const [updatingItemIds, setUpdatingItemIds] = useState<Set<number>>(
    () => new Set(),
  );
  const updatingItemIdsRef = useRef(new Set<number>());

  const applyCart = useCallback(
    (cart: Cart) => {
      setItems(cart.items);
      setTotal(cart.total);
      setItemsCount(
        cart.items.reduce((count, item) => count + item.quantity, 0),
      );
    },
    [setItemsCount],
  );

  const refreshCart = useCallback(async () => {
    const cart = await getCart();
    applyCart(cart);
  }, [applyCart]);

  const handleBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace("/");
  }, [router]);

  const handleRetry = useCallback(() => {
    setRequestVersion((version) => version + 1);
  }, []);

  const updateQuantity = useCallback(
    async (itemId: number, change: number) => {
      if (updatingItemIdsRef.current.has(itemId)) return;
      const item = items.find((currentItem) => currentItem.id === itemId);
      if (!item) return;
      const nextQuantity = Math.max(1, item.quantity + change);
      if (nextQuantity === item.quantity) return;

      updatingItemIdsRef.current.add(itemId);
      setUpdatingItemIds(new Set(updatingItemIdsRef.current));
      setActionError(null);
      try {
        await updateCartItemQuantity(itemId, nextQuantity);
        await refreshCart();
      } catch (caughtError) {
        setActionError(
          getErrorMessage(caughtError, "Non è stato possibile aggiornare la quantità."),
        );
      } finally {
        updatingItemIdsRef.current.delete(itemId);
        setUpdatingItemIds(new Set(updatingItemIdsRef.current));
      }
    },
    [items, refreshCart],
  );

  const handleRemove = useCallback(
    async (itemId: number) => {
      if (updatingItemIdsRef.current.has(itemId)) return;
      updatingItemIdsRef.current.add(itemId);
      setUpdatingItemIds(new Set(updatingItemIdsRef.current));
      setActionError(null);
      try {
        await removeCartItem(itemId);
        await refreshCart();
      } catch (caughtError) {
        setActionError(
          getErrorMessage(caughtError, "Non è stato possibile rimuovere il prodotto."),
        );
      } finally {
        updatingItemIdsRef.current.delete(itemId);
        setUpdatingItemIds(new Set(updatingItemIdsRef.current));
      }
    },
    [refreshCart],
  );

  const handleConfirm = useCallback(async () => {
    if (!selectedTypeId || !selectedTimeId || items.length === 0 || isSubmitting) return;
    setActionError(null);
    setIsSubmitting(true);

    try {
      const isPhoneVerified = await AuthService.getPhoneVerificationStatus();
      if (!isPhoneVerified) {
        setIsPhoneVerificationVisible(true);
        return;
      }

      const response = await createOrder({
        address: null,
        cart: items.map((item) => ({
          product: item.productId,
          quantity: item.quantity,
          variations: item.variationIds,
        })),
        time: selectedTimeId,
        type: selectedTypeId,
      });

      applyCart({ expiresAt: null, id: null, items: [], total: 0 });
      const complete = () => router.replace("/orders");
      if (Platform.OS === "web") {
        globalThis.alert?.(response.message);
        complete();
      } else {
        Alert.alert("Ordine confermato", response.message, [
          { onPress: complete, text: "OK" },
        ]);
      }
    } catch (caughtError) {
      if (
        axios.isAxiosError<ApiError>(caughtError) &&
        caughtError.response?.data.code === "PHONE_VERIFICATION_REQUIRED"
      ) {
        setIsPhoneVerificationVisible(true);
      } else {
        setActionError(
          getErrorMessage(caughtError, "Non è stato possibile confermare l’ordine."),
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [applyCart, isSubmitting, items, router, selectedTimeId, selectedTypeId]);

  useEffect(() => {
    const controller = new AbortController();
    async function loadInitialData() {
      setError(null);
      setIsLoading(true);
      try {
        const [cart, checkout] = await Promise.all([
          getCart(controller.signal),
          getCheckoutInfo(undefined, controller.signal),
        ]);
        if (!controller.signal.aborted) {
          applyCart(cart);
          setOrderTypes(checkout.types);
        }
      } catch (caughtError) {
        if (!controller.signal.aborted) {
          setError(getErrorMessage(caughtError, "Non è stato possibile caricare il checkout."));
        }
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }
    void loadInitialData();
    return () => controller.abort();
  }, [applyCart, requestVersion]);

  useEffect(() => {
    setSelectedTimeId(null);
    setAvailableHours([]);
    if (!selectedTypeId) return;
    const controller = new AbortController();
    async function loadHours() {
      setIsCheckoutLoading(true);
      setActionError(null);
      try {
        const checkout = await getCheckoutInfo(selectedTypeId!, controller.signal);
        if (!controller.signal.aborted) setAvailableHours(checkout.hours);
      } catch (caughtError) {
        if (!controller.signal.aborted) {
          setActionError(getErrorMessage(caughtError, "Non è stato possibile caricare gli orari."));
        }
      } finally {
        if (!controller.signal.aborted) setIsCheckoutLoading(false);
      }
    }
    void loadHours();
    return () => controller.abort();
  }, [selectedTypeId]);

  return (
    <CartView
      actionError={actionError}
      availableHours={availableHours}
      error={error}
      isCheckoutLoading={isCheckoutLoading}
      isLoading={isLoading}
      isPhoneVerificationVisible={isPhoneVerificationVisible}
      isSubmitting={isSubmitting}
      items={items}
      onBack={handleBack}
      onClosePhoneVerification={() => setIsPhoneVerificationVisible(false)}
      onConfirm={() => void handleConfirm()}
      onDecrease={(itemId) => void updateQuantity(itemId, -1)}
      onIncrease={(itemId) => void updateQuantity(itemId, 1)}
      onProceedPhoneVerification={() => {
        setIsPhoneVerificationVisible(false);
        router.push("/verify-phone");
      }}
      onRemove={(itemId) => void handleRemove(itemId)}
      onRetry={handleRetry}
      onSelectTime={setSelectedTimeId}
      onSelectType={setSelectedTypeId}
      orderTypes={orderTypes}
      selectedTimeId={selectedTimeId}
      selectedTypeId={selectedTypeId}
      total={total}
      updatingItemIds={updatingItemIds}
    />
  );
}
