import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import type { ComponentProps } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppHeader } from "@/components/AppHeader";
import { colors } from "@/theme/colors";
import { fonts } from "@/theme/fonts";
import { responsiveFontSize } from "@/utils/responsiveFontSize";

import { AccountHero } from "../components/AccountHero";

type ProfileFieldProps = {
  autoComplete?: ComponentProps<typeof TextInput>["autoComplete"];
  icon: ComponentProps<typeof FontAwesome6>["name"];
  keyboardType?: ComponentProps<typeof TextInput>["keyboardType"];
  label: string;
  onChangeText?: (value: string) => void;
  value: string;
};

function ProfileField({
  autoComplete,
  icon,
  keyboardType,
  label,
  onChangeText,
  value,
}: ProfileFieldProps) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={styles.inputContainer}>
        <FontAwesome6 color={colors.textMuted} name={icon} size={17} />
        <TextInput
          autoComplete={autoComplete}
          keyboardType={keyboardType}
          onChangeText={onChangeText}
          style={styles.input}
          value={value}
        />
      </View>
    </View>
  );
}

export type EditAccountViewProps = {
  displayName?: string;
  firstName?: string;
  lastName?: string;
  onAccountTabPress?: () => void;
  onBack: () => void;
  onChangeFirstName?: (value: string) => void;
  onChangeLastName?: (value: string) => void;
  onChangePhone?: (value: string) => void;
  onPasswordTabPress?: () => void;
  onSave?: () => void;
  phone?: string;
};

export function EditAccountView({
  displayName = "Alessio",
  firstName = "Alessio",
  lastName = "Sanseverino",
  onAccountTabPress,
  onBack,
  onChangeFirstName,
  onChangeLastName,
  onChangePhone,
  onPasswordTabPress,
  onSave,
  phone = "3393349401",
}: EditAccountViewProps) {
  const insets = useSafeAreaInsets();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.keyboardView}
    >
      <ScrollView
        contentContainerStyle={[
          styles.page,
          { paddingBottom: Math.max(insets.bottom + 96, 116) },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <AppHeader showCart={false} subtitle="Lorem ipsum" />
        </View>

        <View style={styles.navigation}>
          <Pressable
            accessibilityLabel="Torna indietro"
            accessibilityRole="button"
            hitSlop={10}
            onPress={onBack}
            style={({ pressed }) => [
              styles.backButton,
              pressed && styles.pressed,
            ]}
          >
            <FontAwesome6
              color={colors.text}
              name="chevron-left"
              size={20}
            />
          </Pressable>
        </View>

        <AccountHero displayName={displayName} />

        <View style={styles.card}>
          <View style={styles.tabs}>
            <Pressable
              accessibilityRole="tab"
              onPress={onAccountTabPress}
              style={({ pressed }) => [styles.tab, pressed && styles.pressed]}
            >
              <View style={[styles.tabIcon, styles.activeTabIcon]}>
                <FontAwesome6 color={colors.text} name="user" size={24} />
              </View>
              <Text style={styles.tabLabel}>Account</Text>
            </Pressable>

            <Pressable
              accessibilityRole="tab"
              onPress={onPasswordTabPress}
              style={({ pressed }) => [styles.tab, pressed && styles.pressed]}
            >
              <View style={styles.tabIcon}>
                <FontAwesome6 color={colors.text} name="lock" size={27} />
              </View>
              <Text style={styles.tabLabel}>Password</Text>
            </Pressable>
          </View>

          <View style={styles.divider} />

          <View style={styles.form}>
            <ProfileField
              autoComplete="given-name"
              icon="user"
              label="Nome"
              onChangeText={onChangeFirstName}
              value={firstName}
            />
            <ProfileField
              autoComplete="family-name"
              icon="user"
              label="Cognome"
              onChangeText={onChangeLastName}
              value={lastName}
            />
            <ProfileField
              autoComplete="tel"
              icon="phone"
              keyboardType="phone-pad"
              label="Il tuo numero"
              onChangeText={onChangePhone}
              value={phone}
            />
          </View>

          <Pressable
            accessibilityRole="button"
            onPress={onSave}
            style={({ pressed }) => [
              styles.saveButton,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.saveLabel}>Salva</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    backgroundColor: colors.background,
    flex: 1,
  },
  page: {
    alignItems: "center",
    backgroundColor: colors.background,
    flexGrow: 1,
  },
  header: {
    width: "100%",
  },
  navigation: {
    marginTop: 22,
    maxWidth: 440,
    width: "84%",
  },
  backButton: {
    alignItems: "center",
    backgroundColor: colors.title,
    borderRadius: 18,
    elevation: 3,
    height: 36,
    justifyContent: "center",
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    width: 36,
  },
  card: {
    backgroundColor: colors.background,
    borderRadius: 18,
    elevation: 5,
    marginTop: 20,
    maxWidth: 440,
    paddingBottom: 24,
    paddingHorizontal: 17,
    paddingTop: 6,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.14,
    shadowRadius: 7,
    width: "84%",
  },
  tabs: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "center",
    gap: 7,
  },
  tab: {
    alignItems: "center",
    minWidth: 64,
  },
  tabIcon: {
    alignItems: "center",
    height: 42,
    justifyContent: "center",
    width: 42,
  },
  activeTabIcon: {
    backgroundColor: colors.title,
    borderRadius: 22,
  },
  tabLabel: {
    color: colors.text,
    fontFamily: fonts.regular,
    fontSize: responsiveFontSize(14),
    marginTop: 1,
  },
  divider: {
    backgroundColor: colors.textMuted,
    height: 1,
    marginTop: 5,
    opacity: 0.85,
  },
  form: {
    gap: 11,
    marginTop: 12,
  },
  fieldGroup: {
    gap: 3,
  },
  fieldLabel: {
    color: colors.text,
    fontFamily: fonts.regular,
    fontSize: responsiveFontSize(17),
    marginLeft: 7,
  },
  inputContainer: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 24,
    borderWidth: 1,
    elevation: 3,
    flexDirection: "row",
    height: 45,
    paddingHorizontal: 13,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.13,
    shadowRadius: 4,
  },
  input: {
    color: colors.text,
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: responsiveFontSize(16),
    height: "100%",
    marginLeft: 10,
    paddingVertical: 0,
  },
  saveButton: {
    alignItems: "center",
    backgroundColor: colors.title,
    borderRadius: 22,
    elevation: 3,
    justifyContent: "center",
    marginTop: 25,
    minHeight: 43,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
  },
  saveLabel: {
    color: colors.text,
    fontFamily: fonts.bold,
    fontSize: responsiveFontSize(18),
  },
  pressed: {
    opacity: 0.76,
  },
});
