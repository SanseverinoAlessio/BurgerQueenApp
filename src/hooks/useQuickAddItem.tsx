import type { ElementMeasurements } from "@/types/layout";
import { useCallback, useState } from "react";
import { useProductDetail } from "./useProductDetail";

export function useQuickAddItem() {
  const [productId, setProductId] = useState<number | null>(null);
  const [buttonMeasurements, setButtonMeasurements] =
    useState<ElementMeasurements | null>(null);
  const productDetail = useProductDetail(
    productId === null ? undefined : String(productId),
  );

  const isOpen = productId !== null;

  const open = useCallback(
    (
      nextProductId: number,
      nextButtonMeasurements: ElementMeasurements,
    ) => {
      setButtonMeasurements(nextButtonMeasurements);
      setProductId(nextProductId);
    },
    [],
  );

  const close = useCallback(() => {
    setButtonMeasurements(null);
    setProductId(null);
  }, []);

  return {
    buttonMeasurements,
    close,
    isOpen,
    open,
    ...productDetail,
  };
}
