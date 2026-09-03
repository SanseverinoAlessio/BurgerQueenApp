import { colors } from "@/theme/colors";
import { fonts } from "@/theme/fonts";
import type { ProductDetail } from "@/types/product";
import { responsiveFontSize } from "@/utils/responsiveFontSize";
import type { Dispatch, SetStateAction } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type VariationsSelectionProps = {
  product: ProductDetail;
  setSelectedVariations: Dispatch<SetStateAction<Record<number, number>>>;
  selectedVariations: Record<number, number>;
};

export function VariationsSelection({
  product,
  setSelectedVariations,
  selectedVariations,
}: VariationsSelectionProps) {
  return (
    <>
      {product.groups.map((group) => (
        <View key={group.id} style={styles.group}>
          {product.groups.length > 1 || group.name ? (
            <Text style={styles.groupTitle}>{group.name}</Text>
          ) : null}
          {group.description ? (
            <Text style={styles.groupDescription}>{group.description}</Text>
          ) : null}
          {group.variations.map((variation) => {
            const isSelected = selectedVariations[group.id] === variation.id;

            return (
              <Pressable
                accessibilityRole="radio"
                accessibilityState={{ selected: isSelected }}
                key={variation.id}
                onPress={() =>
                  setSelectedVariations((current) => ({
                    ...current,
                    [group.id]: variation.id,
                  }))
                }
                style={styles.variation}
              >
                <View style={styles.radio}>
                  {isSelected ? <View style={styles.radioSelected} /> : null}
                </View>
                <Text style={styles.variationName}>{variation.name}</Text>
              </Pressable>
            );
          })}
        </View>
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  groupTitle: {
    color: colors.text,
    fontFamily: fonts.semiBold,
    fontSize: responsiveFontSize(18),
    marginBottom: 8,
  },

  groupDescription: {
    color: colors.text,
    fontFamily: fonts.regular,
    fontSize: responsiveFontSize(15),
    marginBottom: 8,
  },

  group: {
    marginTop: 26,
  },

  variation: {
    alignItems: "center",
    flexDirection: "row",
    gap: 9,
    minHeight: 34,
  },

  radioSelected: {
    backgroundColor: colors.text,
    borderRadius: 6,
    height: 12,
    width: 12,
  },

  variationName: {
    color: colors.text,
    fontFamily: fonts.regular,
    fontSize: responsiveFontSize(18),
  },

  radio: {
    alignItems: "center",
    borderColor: colors.text,
    borderRadius: 11,
    borderWidth: 1.5,
    height: 22,
    justifyContent: "center",
    width: 22,
  },
});
