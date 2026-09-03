import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
} from "react-native";

import { colors } from "@/theme/colors";
import { fonts } from "@/theme/fonts";
import { responsiveFontSize } from "@/utils/responsiveFontSize";

type AddToCartButtonProps = {
  isLoading: boolean;
  onPress: () => void;
};

export function AddToCartButton({
  isLoading,
  onPress,
}: AddToCartButtonProps) {
  return (
    <Pressable
      accessibilityLabel="Aggiungi al carrello"
      accessibilityRole="button"
      accessibilityState={{ busy: isLoading, disabled: isLoading }}
      disabled={isLoading}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        isLoading && styles.loading,
        pressed && styles.pressed,
      ]}
    >
      {isLoading ? (
        <ActivityIndicator color={colors.surface} size="small" />
      ) : (
        <Text style={styles.label}>Aggiungi</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    backgroundColor: colors.text,
    borderRadius: 14,
    justifyContent: "center",
    minHeight: 48,
    minWidth: 112,
    paddingHorizontal: 18,
    paddingVertical: 13,
  },
  label: {
    color: colors.surface,
    fontFamily: fonts.bold,
    fontSize: responsiveFontSize(18),
  },
  loading: {
    opacity: 0.8,
  },
  pressed: {
    opacity: 0.75,
  },
});
