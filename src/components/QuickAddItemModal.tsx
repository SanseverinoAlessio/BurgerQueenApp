import { useVariationSelection } from "@/hooks/useVariationsSelection";
import { colors } from "@/theme/colors";
import type { ElementMeasurements } from "@/types/layout";
import type { ProductDetail } from "@/types/product";
import { useEffect } from "react";
import {
  ActivityIndicator,
  Button,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { VariationsSelection } from "./VariationsSelection";
type QuickAddItemProps = {
  buttonMeasurements: ElementMeasurements | null;
  error: string | null;
  isOpen: boolean;
  isLoading: boolean;
  onClose: () => void;
  onRetry: () => void;
  product: ProductDetail | null;
};

export function QuickAddItemModal({
  buttonMeasurements,
  error,
  isOpen,
  isLoading,
  onClose,
  onRetry,
  product,
}: QuickAddItemProps) {
  const { selectedVariations, setSelectedVariations } = useVariationSelection();

  useEffect(() => {
    setSelectedVariations(
      product
        ? Object.fromEntries(
            product.groups
              .filter((group) => group.variations.length > 0 && group.min > 0)
              .map((group) => [group.id, group.variations[0].id]),
          )
        : {},
    );
  }, [product, setSelectedVariations]);

  useEffect(() => {
    //Valuta se sono state selezionate tutte le variazioni
    const variationsIds = product?.groups
      ?.map((el) => {
        return el.variations.map(function (variation) {
          return variation.id;
        });
      })
      .flat();
    console.log("tutte le variazioni", variationsIds);

    console.log(selectedVariations);
  }, [selectedVariations]);

  return (
    <Modal
      animationType="fade"
      navigationBarTranslucent
      onRequestClose={onClose}
      presentationStyle="overFullScreen"
      statusBarTranslucent
      transparent
      visible={isOpen}
    >
      <View style={style.container}>
        <Pressable
          accessibilityLabel="Chiudi il modale"
          accessibilityRole="button"
          onPress={onClose}
          style={style.backdrop}
        />
        <View style={[style.card, { top: buttonMeasurements?.y ?? 0 }]}>
          {/*<Button onPress={onClose} title="Chiudi" /> */}

          {isLoading ? <ActivityIndicator /> : null}

          {!isLoading && error ? (
            <View>
              <Text>{error}</Text>
              <Button onPress={onRetry} title="Riprova" />
            </View>
          ) : null}

          {!isLoading && !error && product ? (
            <>
              <Text>{product.name}</Text>
              <VariationsSelection
                product={product}
                selectedVariations={selectedVariations}
                setSelectedVariations={setSelectedVariations}
              />
            </>
          ) : null}
        </View>
      </View>
    </Modal>
  );
}

const style = StyleSheet.create({
  backdrop: {
    bottom: 0,
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
  },
  container: {
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    flex: 1,
  },
  card: {
    backgroundColor: colors.background,
    borderRadius: 18,
    padding: 10,
    position: "absolute",
    right: 10,
  },
});
