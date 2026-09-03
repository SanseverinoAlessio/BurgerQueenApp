import { useState } from "react";

export function useVariationSelection() {
  const [selectedVariations, setSelectedVariations] = useState<
    Record<number, number>
  >({});

  return {
    selectedVariations,
    setSelectedVariations,
  };
}
