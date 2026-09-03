import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import type { ComponentProps } from "react";
import {
  ActivityIndicator,
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

export type EditAccountTab = "account" | "password";

type ProfileFieldProps = {
  autoComplete?: ComponentProps<typeof TextInput>["autoComplete"];
  icon: ComponentProps<typeof FontAwesome6>["name"];
  keyboardType?: ComponentProps<typeof TextInput>["keyboardType"];
  label: string;
  onChangeText: (value: string) => void;
  secureTextEntry?: boolean;
  value: string;
};

function ProfileField({
  autoComplete,
  icon,
  keyboardType,
  label,
  onChangeText,
  secureTextEntry = false,
  value,
}: ProfileFieldProps) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={styles.inputContainer}>
        <FontAwesome6 color={colors.textMuted} name={icon} size={17} />
        <TextInput
          autoCapitalize="none"
          autoComplete={autoComplete}
          keyboardType={keyboardType}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          style={styles.input}
          value={value}
        />
      </View>
    </View>
  );
}

export type EditAccountViewProps = {
  activeTab: EditAccountTab;
  currentPassword: string;
  displayName: string;
  error: string | null;
  firstName: string;
  isSaving: boolean;
  lastName: string;
  newPassword: string;
  onAccountTabPress: () => void;
  onBack: () => void;
  onChangeCurrentPassword: (value: string) => void;
  onChangeFirstName: (value: string) => void;
  onChangeLastName: (value: string) => void;
  onChangeNewPassword: (value: string) => void;
  onChangePhone: (value: string) => void;
  onChangeRepeatPassword: (value: string) => void;
  onPasswordTabPress: () => void;
  onSave: () => void;
  phone: string;
  repeatPassword: string;
  success: string | null;
};

export function EditAccountView(props: EditAccountViewProps) {
  const {
    activeTab, currentPassword, displayName, error, firstName, isSaving,
    lastName, newPassword, onAccountTabPress, onBack,
    onChangeCurrentPassword, onChangeFirstName, onChangeLastName,
    onChangeNewPassword, onChangePhone, onChangeRepeatPassword,
    onPasswordTabPress, onSave, phone, repeatPassword, success,
  } = props;
  const insets = useSafeAreaInsets();
  const isAccountTab = activeTab === "account";

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.keyboardView}>
      <ScrollView
        contentContainerStyle={[styles.page, { paddingBottom: Math.max(insets.bottom + 96, 116) }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <AppHeader showCart={false} subtitle="Il tuo account" />
        </View>

        <View style={styles.navigation}>
          <Pressable accessibilityLabel="Torna indietro" accessibilityRole="button" hitSlop={10} onPress={onBack} style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}>
            <FontAwesome6 color={colors.text} name="chevron-left" size={20} />
          </Pressable>
          <Text style={styles.navigationTitle}>Modifica il profilo</Text>
        </View>

        <AccountHero displayName={displayName} />

        <View style={styles.card}>
          <View style={styles.tabs}>
            <Pressable accessibilityRole="tab" accessibilityState={{ selected: isAccountTab }} onPress={onAccountTabPress} style={({ pressed }) => [styles.tab, pressed && styles.pressed]}>
              <View style={[styles.tabIcon, isAccountTab && styles.activeTabIcon]}>
                <FontAwesome6 color={colors.text} name="user" size={24} />
              </View>
              <Text style={styles.tabLabel}>Account</Text>
            </Pressable>
            <Pressable accessibilityRole="tab" accessibilityState={{ selected: !isAccountTab }} onPress={onPasswordTabPress} style={({ pressed }) => [styles.tab, pressed && styles.pressed]}>
              <View style={[styles.tabIcon, !isAccountTab && styles.activeTabIcon]}>
                <FontAwesome6 color={colors.text} name="lock" size={27} />
              </View>
              <Text style={styles.tabLabel}>Password</Text>
            </Pressable>
          </View>

          <View style={styles.divider} />
          <View style={styles.form}>
            {isAccountTab ? (
              <>
                <ProfileField autoComplete="given-name" icon="user" label="Nome" onChangeText={onChangeFirstName} value={firstName} />
                <ProfileField autoComplete="family-name" icon="user" label="Cognome" onChangeText={onChangeLastName} value={lastName} />
                <ProfileField autoComplete="tel" icon="phone" keyboardType="phone-pad" label="Il tuo numero" onChangeText={onChangePhone} value={phone} />
              </>
            ) : (
              <>
                <ProfileField autoComplete="current-password" icon="lock" label="Password attuale" onChangeText={onChangeCurrentPassword} secureTextEntry value={currentPassword} />
                <ProfileField autoComplete="new-password" icon="key" label="Nuova password" onChangeText={onChangeNewPassword} secureTextEntry value={newPassword} />
                <ProfileField autoComplete="new-password" icon="key" label="Ripeti nuova password" onChangeText={onChangeRepeatPassword} secureTextEntry value={repeatPassword} />
              </>
            )}
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}
          {success ? <Text style={styles.success}>{success}</Text> : null}
          <Pressable accessibilityRole="button" disabled={isSaving} onPress={onSave} style={({ pressed }) => [styles.saveButton, isSaving && styles.disabled, pressed && styles.pressed]}>
            {isSaving ? <ActivityIndicator color={colors.text} /> : <Text style={styles.saveLabel}>Salva</Text>}
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardView: { backgroundColor: colors.background, flex: 1 },
  page: { alignItems: "center", backgroundColor: colors.background, flexGrow: 1 },
  header: { width: "100%" },
  navigation: { alignItems: "center", flexDirection: "row", gap: 12, marginTop: 22, maxWidth: 440, width: "84%" },
  navigationTitle: { color: colors.text, fontFamily: fonts.regular, fontSize: responsiveFontSize(28) },
  backButton: { alignItems: "center", backgroundColor: colors.title, borderRadius: 18, elevation: 3, height: 36, justifyContent: "center", shadowColor: colors.shadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 3, width: 36 },
  card: { backgroundColor: colors.background, borderRadius: 18, elevation: 5, marginTop: 20, maxWidth: 440, paddingBottom: 24, paddingHorizontal: 17, paddingTop: 6, shadowColor: colors.shadow, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.14, shadowRadius: 7, width: "84%" },
  tabs: { alignItems: "flex-start", flexDirection: "row", gap: 7, justifyContent: "center" },
  tab: { alignItems: "center", minWidth: 64 },
  tabIcon: { alignItems: "center", height: 42, justifyContent: "center", width: 42 },
  activeTabIcon: { backgroundColor: colors.title, borderRadius: 22 },
  tabLabel: { color: colors.text, fontFamily: fonts.regular, fontSize: responsiveFontSize(14), marginTop: 1 },
  divider: { backgroundColor: colors.textMuted, height: 1, marginTop: 5, opacity: 0.85 },
  form: { gap: 11, marginTop: 12 },
  fieldGroup: { gap: 3 },
  fieldLabel: { color: colors.text, fontFamily: fonts.regular, fontSize: responsiveFontSize(17), marginLeft: 7 },
  inputContainer: { alignItems: "center", backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 24, borderWidth: 1, elevation: 3, flexDirection: "row", height: 45, paddingHorizontal: 13, shadowColor: colors.shadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.13, shadowRadius: 4 },
  input: { color: colors.text, flex: 1, fontFamily: fonts.regular, fontSize: responsiveFontSize(16), height: "100%", marginLeft: 10, paddingVertical: 0 },
  error: { color: colors.error, fontFamily: fonts.regular, marginTop: 14, textAlign: "center" },
  success: { color: "#16794A", fontFamily: fonts.regular, marginTop: 14, textAlign: "center" },
  saveButton: { alignItems: "center", backgroundColor: colors.title, borderRadius: 22, elevation: 3, justifyContent: "center", marginTop: 25, minHeight: 43, shadowColor: colors.shadow, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.18, shadowRadius: 4 },
  saveLabel: { color: colors.text, fontFamily: fonts.bold, fontSize: responsiveFontSize(18) },
  disabled: { opacity: 0.55 },
  pressed: { opacity: 0.76 },
});
