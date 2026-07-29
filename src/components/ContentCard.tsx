import { Image } from "expo-image";
import type { ComponentProps, ReactNode } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type ViewStyle,
} from "react-native";

import { colors } from "@/theme/colors";
import { fonts } from "@/theme/fonts";
import { responsiveFontSize } from "@/utils/responsiveFontSize";

type ContentCardProps = {
  title: string;
  subtitle?: string;
  image?: ComponentProps<typeof Image>["source"];
  leading?: ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
};

export function ContentCard({
  title,
  subtitle,
  image,
  leading,
  onPress,
  style,
}: ContentCardProps) {
  return (
    <Pressable
      accessibilityRole={onPress ? "button" : undefined}
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        pressed && onPress && styles.pressed,
        style,
      ]}
    >
      <View style={styles.inner}>
        {image ? (
          <Image contentFit="cover" source={image} style={styles.media} />
        ) : leading ? (
          <View style={styles.media}>{leading}</View>
        ) : null}

        <View style={styles.content}>
          <Text numberOfLines={2} style={styles.title}>
            {title}
          </Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 20,
    elevation: 9,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 9 },
    shadowOpacity: 0.28,
    shadowRadius: 9,
  },
  inner: {
    alignItems: "stretch",
    borderRadius: 20,
    flexDirection: "row",
    minHeight: 90,
    overflow: "hidden",
  },
  pressed: {
    opacity: 0.82,
  },
  media: {
    alignItems: "center",
    alignSelf: "stretch",
    backgroundColor: colors.title,
    justifyContent: "center",
    width: "35%",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    color: colors.text,
    fontFamily: fonts.bold,
    fontSize: responsiveFontSize(24),
    lineHeight: 28,
  },
  subtitle: {
    color: colors.text,
    fontFamily: fonts.semiBold,
    fontSize: responsiveFontSize(18),
    lineHeight: 21,
    marginTop: 3,
    opacity: 0.68,
  },
});
