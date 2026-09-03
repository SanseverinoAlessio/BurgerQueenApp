import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { colors } from "@/theme/colors";
import { fonts } from "@/theme/fonts";
import { responsiveFontSize } from "@/utils/responsiveFontSize";

type QuantityPickerProps = {
  accessibilityLabel: string;
  isLoading: boolean;
  onDecrease: () => void;
  onIncrease: () => void;
  quantity: number;
};

export function QuantityPicker({
  accessibilityLabel,
  isLoading,
  onDecrease,
  onIncrease,
  quantity,
}: QuantityPickerProps) {
  const canDecrease = quantity > 1 && !isLoading;

  return (
    <View style={styles.container}>
      <Pressable
        accessibilityLabel={`Riduci ${accessibilityLabel}`}
        accessibilityRole="button"
        accessibilityState={{ disabled: !canDecrease }}
        disabled={!canDecrease}
        hitSlop={8}
        onPress={onDecrease}
        style={({ pressed }) => pressed && styles.pressed}
      >
        <FontAwesome6
          color={canDecrease ? colors.text : colors.textMuted}
          name="minus"
          size={17}
        />
      </Pressable>

      <View style={styles.value}>
        {isLoading ? (
          <ActivityIndicator color={colors.text} size="small" />
        ) : (
          <Text accessibilityLiveRegion="polite" style={styles.quantity}>
            {quantity}
          </Text>
        )}
      </View>

      <Pressable
        accessibilityLabel={`Aumenta ${accessibilityLabel}`}
        accessibilityRole="button"
        accessibilityState={{ disabled: isLoading }}
        disabled={isLoading}
        hitSlop={8}
        onPress={onIncrease}
        style={({ pressed }) => pressed && styles.pressed}
      >
        <FontAwesome6
          color={isLoading ? colors.textMuted : colors.text}
          name="plus"
          size={17}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexDirection: "row",
    gap: 14,
  },
  pressed: {
    opacity: 0.6,
  },
  quantity: {
    color: colors.text,
    fontFamily: fonts.bold,
    fontSize: responsiveFontSize(20),
    textAlign: "center",
  },
  value: {
    alignItems: "center",
    justifyContent: "center",
    minWidth: 16,
  },
});
