import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import type { ComponentProps } from "react";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { colors } from "@/theme/colors";
import { fonts } from "@/theme/fonts";
import { responsiveFontSize } from "@/utils/responsiveFontSize";

type AuthFieldProps = ComponentProps<typeof TextInput> & {
  error?: string;
  icon: ComponentProps<typeof FontAwesome6>["name"];
  label: string;
  onToggleVisibility?: () => void;
  passwordVisible?: boolean;
};

export function AuthField({
  error,
  icon,
  label,
  onBlur,
  onFocus,
  onToggleVisibility,
  passwordVisible = false,
  style,
  value,
  ...inputProps
}: AuthFieldProps) {
  const [isFocused, setIsFocused] = useState(false);
  const isRaised = isFocused || String(value ?? "").length > 0;
  const animation = useRef(new Animated.Value(isRaised ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animation, {
      duration: 170,
      easing: Easing.out(Easing.cubic),
      toValue: isRaised ? 1 : 0,
      useNativeDriver: false,
    }).start();
  }, [animation, isRaised]);

  return (
    <View style={styles.fieldGroup}>
      <View
        style={[
          styles.inputContainer,
          isFocused && styles.inputContainerFocused,
          error && styles.inputContainerError,
        ]}
      >
        <FontAwesome6
          color={isFocused ? colors.text : colors.textMuted}
          name={icon}
          size={18}
        />
        <TextInput
          {...inputProps}
          accessibilityLabel={inputProps.accessibilityLabel ?? label}
          onBlur={(event) => {
            setIsFocused(false);
            onBlur?.(event);
          }}
          onFocus={(event) => {
            setIsFocused(true);
            onFocus?.(event);
          }}
          placeholder={undefined}
          placeholderTextColor={colors.textMuted}
          style={[styles.input, style]}
          value={value}
        />
        {onToggleVisibility ? (
          <Pressable
            accessibilityLabel={
              passwordVisible ? "Nascondi password" : "Mostra password"
            }
            accessibilityRole="button"
            hitSlop={10}
            onPress={onToggleVisibility}
          >
            <FontAwesome6
              color={isFocused ? colors.text : colors.textMuted}
              name={passwordVisible ? "eye-slash" : "eye"}
              size={17}
            />
          </Pressable>
        ) : null}
      </View>

      <Animated.Text
        accessible={false}
        pointerEvents="none"
        style={[
          styles.label,
          {
            color: animation.interpolate({
              inputRange: [0, 1],
              outputRange: [colors.textMuted, colors.text],
            }),
            fontSize: animation.interpolate({
              inputRange: [0, 1],
              outputRange: [responsiveFontSize(16), responsiveFontSize(17)],
            }),
            left: animation.interpolate({
              inputRange: [0, 1],
              outputRange: [34, 17],
            }),
            top: animation.interpolate({
              inputRange: [0, 1],
              outputRange: [29, -6],
            }),
          },
          error && styles.labelError,
        ]}
      >
        {label}
      </Animated.Text>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  fieldGroup: {
    paddingTop: 14,
    position: "relative",
  },
  label: {
    fontFamily: fonts.regular,
    lineHeight: 18,
    paddingHorizontal: 6,
    position: "absolute",
    zIndex: 3,
  },
  inputContainer: {
    alignItems: "center",
    backgroundColor: colors.background,
    borderColor: "#B7B7B7",
    borderRadius: 26,
    borderWidth: 1.5,
    elevation: 1,
    flexDirection: "row",
    height: 52,
    paddingHorizontal: 13,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    zIndex: 1,
  },
  inputContainerFocused: {
    borderColor: colors.text,
    borderWidth: 2,
    elevation: 2,
    shadowColor: colors.shadow,
    shadowOpacity: 0.14,
    shadowRadius: 4,
  },
  inputContainerError: {
    borderColor: colors.error,
  },
  input: {
    color: colors.text,
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: responsiveFontSize(16),
    height: "100%",
    marginLeft: 9,
    paddingVertical: 0,
  },
  labelError: {
    color: colors.error,
  },
  errorText: {
    color: colors.error,
    fontFamily: fonts.regular,
    fontSize: responsiveFontSize(13),
    marginLeft: 17,
    marginTop: 4,
  },
});
