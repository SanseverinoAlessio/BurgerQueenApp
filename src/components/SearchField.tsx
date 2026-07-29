import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { Pressable, StyleSheet, TextInput, View } from "react-native";

import { colors } from "@/theme/colors";
import { fonts } from "@/theme/fonts";
import { responsiveFontSize } from "@/utils/responsiveFontSize";

type SearchFieldProps = {
  value: string;
  onChangeText: (value: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
};

export function SearchField({
  value,
  onChangeText,
  onSubmit,
  placeholder = "Cerca...",
}: SearchFieldProps) {
  return (
    <View style={styles.container}>
      <TextInput
        onChangeText={onChangeText}
        onSubmitEditing={onSubmit}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        returnKeyType="search"
        style={styles.input}
        value={value}
      />
      <Pressable
        accessibilityLabel="Cerca"
        accessibilityRole="button"
        hitSlop={10}
        onPress={onSubmit}
      >
        <FontAwesome6
          color={colors.text}
          name="magnifying-glass"
          size={21}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 25,
    borderWidth: 1,
    flexDirection: "row",
    height: 50,
    paddingHorizontal: 18,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.14,
    shadowRadius: 4,
  },
  input: {
    color: colors.text,
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: responsiveFontSize(15),
    height: "100%",
  },
});
