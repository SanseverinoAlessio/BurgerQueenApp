import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { MenuView } from "@expo/ui/community/menu";
import { Picker } from "@react-native-picker/picker";
import { useRef } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  type StyleProp,
  StyleSheet,
  Text,
  View,
  type ViewStyle,
} from "react-native";

import { colors } from "@/theme/colors";
import { fonts } from "@/theme/fonts";
import { responsiveFontSize } from "@/utils/responsiveFontSize";

type SelectValue = number | string;

export type SelectOption<T extends SelectValue = number> = {
  disabled?: boolean;
  id: T;
  title: string;
};

type SelectFieldProps<T extends SelectValue> = {
  accessibilityLabel?: string;
  disabled?: boolean;
  isLoading?: boolean;
  dialogTitle?: string;
  onValueChange: (value: T) => void;
  options: readonly SelectOption<T>[];
  placeholder?: string;
  style?: StyleProp<ViewStyle>;
  value: T | null;
};

export function SelectField<T extends SelectValue>({
  accessibilityLabel = "Apri selezione",
  disabled = false,
  dialogTitle,
  isLoading = false,
  onValueChange,
  options,
  placeholder = "Seleziona...",
  style,
  value,
}: SelectFieldProps<T>) {
  const pickerRef = useRef<Picker<T>>(null);
  const selectedOption = options.find((option) => option.id === value);
  const isDisabled = disabled || isLoading || options.length === 0;

  const trigger = (
    <View
      accessible={Platform.OS !== "android" || isDisabled}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled }}
      style={[styles.trigger, isDisabled && styles.disabled]}
    >
      {isLoading ? (
        <ActivityIndicator color={colors.textMuted} />
      ) : (
        <Text
          numberOfLines={1}
          style={selectedOption ? styles.value : styles.placeholder}
        >
          {selectedOption?.title ?? placeholder}
        </Text>
      )}

      <FontAwesome6 color={colors.textMuted} name="caret-down" size={16} />
    </View>
  );

  if (isDisabled) {
    return <View style={[styles.container, style]}>{trigger}</View>;
  }

  if (Platform.OS === "android") {
    return (
      <View style={[styles.container, style]}>
        <Pressable
          accessibilityLabel={accessibilityLabel}
          accessibilityRole="button"
          onPress={() => pickerRef.current?.focus()}
          style={({ pressed }) => pressed && styles.pressed}
        >
          {trigger}
        </Pressable>

        <Picker
          enabled
          mode="dialog"
          onValueChange={(selectedValue) => onValueChange(selectedValue)}
          prompt={dialogTitle ?? placeholder}
          ref={pickerRef}
          selectedValue={value ?? undefined}
          style={styles.nativePicker}
        >
          {options.map((option) => (
            <Picker.Item
              enabled={!option.disabled}
              key={String(option.id)}
              label={option.title}
              value={option.id}
            />
          ))}
        </Picker>
      </View>
    );
  }

  return (
    <MenuView
      actions={options.map((option) => ({
        attributes: { disabled: option.disabled },
        id: String(option.id),
        state: option.id === value ? "on" : "off",
        title: option.title,
      }))}
      onPressAction={({ nativeEvent }) => {
        const selected = options.find(
          (option) => String(option.id) === nativeEvent.event,
        );

        if (selected && !selected.disabled) {
          onValueChange(selected.id);
        }
      }}
      style={[styles.container, style]}
    >
      {trigger}
    </MenuView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  trigger: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 24,
    borderWidth: 1,
    elevation: 3,
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: 48,
    paddingHorizontal: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
  },
  value: {
    color: colors.text,
    flex: 1,
    fontFamily: fonts.semiBold,
    fontSize: responsiveFontSize(16),
    marginRight: 10,
  },
  placeholder: {
    color: colors.textMuted,
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: responsiveFontSize(16),
    marginRight: 10,
  },
  disabled: {
    opacity: 0.5,
  },
  nativePicker: {
    height: 1,
    opacity: 0,
    position: "absolute",
    right: 0,
    width: 1,
  },
  pressed: {
    opacity: 0.82,
  },
});
