import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import type { ComponentProps } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppHeader } from "@/components/AppHeader";
import { colors } from "@/theme/colors";
import { fonts } from "@/theme/fonts";
import { responsiveFontSize } from "@/utils/responsiveFontSize";

import { AccountHero } from "../components/AccountHero";

type AccountActionProps = {
  backgroundColor: string;
  disabled?: boolean;
  icon: ComponentProps<typeof FontAwesome6>["name"];
  label: string;
  onPress?: () => void;
  textColor?: string;
};

function AccountAction({
  backgroundColor,
  disabled = false,
  icon,
  label,
  onPress,
  textColor = colors.text,
}: AccountActionProps) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.actionButton,
        { backgroundColor },
        disabled && styles.disabled,
        pressed && styles.pressed,
      ]}
    >
      <FontAwesome6 color={textColor} name={icon} size={17} />
      <Text style={[styles.actionLabel, { color: textColor }]}>{label}</Text>
    </Pressable>
  );
}

export type AccountViewProps = {
  displayName?: string;
  isLoggingOut?: boolean;
  onDeleteAccount?: () => void;
  onEditProfile?: () => void;
  onLogout?: () => void;
  onOrderHistory?: () => void;
};

export function AccountView({
  displayName = "User",
  isLoggingOut = false,
  onDeleteAccount,
  onEditProfile,
  onLogout,
  onOrderHistory,
}: AccountViewProps) {
  return (
    <SafeAreaView edges={["right", "bottom", "left"]} style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.page}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <AppHeader showCart={false} subtitle="Lorem ipsum" />
        </View>

        <AccountHero displayName={displayName} />

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Di cosa hai bisogno?</Text>
          <Text style={styles.cardSubtitle}>
            Gestisci dati, ordini ed account da qui...
          </Text>
          <View style={styles.divider} />

          <View style={styles.actions}>
            <AccountAction
              backgroundColor={colors.title}
              icon="user"
              label="Modifica Dati"
              onPress={onEditProfile}
            />
            <AccountAction
              backgroundColor={colors.title}
              icon="list-ul"
              label="Storico Ordini"
              onPress={onOrderHistory}
            />
            <AccountAction
              backgroundColor={colors.text}
              disabled={isLoggingOut}
              icon="right-from-bracket"
              label={isLoggingOut ? "Uscita..." : "Esci"}
              onPress={onLogout}
              textColor={colors.surface}
            />
            <AccountAction
              backgroundColor="#C91D20"
              icon="trash-can"
              label="Elimina Account"
              onPress={onDeleteAccount}
              textColor={colors.surface}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.background,
    flex: 1,
  },
  page: {
    alignItems: "center",
    backgroundColor: colors.background,
    flexGrow: 1,
    paddingBottom: 20,
  },
  header: {
    width: "100%",
  },
  card: {
    backgroundColor: colors.background,
    borderRadius: 18,
    elevation: 5,
    marginTop: 22,
    maxWidth: 410,
    paddingBottom: 44,
    paddingHorizontal: 18,
    paddingTop: 38,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.14,
    shadowRadius: 7,
    width: "78%",
  },
  cardTitle: {
    color: colors.text,
    fontFamily: fonts.bold,
    fontSize: responsiveFontSize(20),
    textAlign: "center",
  },
  cardSubtitle: {
    color: colors.text,
    fontFamily: fonts.regular,
    fontSize: responsiveFontSize(16),
    marginTop: 1,
    textAlign: "center",
  },
  divider: {
    backgroundColor: colors.textMuted,
    height: 1,
    marginTop: 8,
    opacity: 0.85,
  },
  actions: {
    gap: 15,
    marginTop: 42,
  },
  actionButton: {
    alignItems: "center",
    borderRadius: 22,
    elevation: 3,
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    minHeight: 43,
    paddingHorizontal: 18,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
  },
  actionLabel: {
    fontFamily: fonts.bold,
    fontSize: responsiveFontSize(17),
  },
  pressed: {
    opacity: 0.78,
  },
  disabled: {
    opacity: 0.55,
  },
});
