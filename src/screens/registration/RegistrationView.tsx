import { AppHeader } from "@/components/AppHeader";
import { AuthField } from "@/components/AuthField";
import type { RegistrationFieldErrors } from "@/schemas/auth.schemas";
import { colors } from "@/theme/colors";
import { fonts } from "@/theme/fonts";
import { responsiveFontSize } from "@/utils/responsiveFontSize";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type RegistrationViewProps = {
  email: string;
  error: string | null;
  fieldErrors: RegistrationFieldErrors;
  firstName: string;
  isPasswordConfirmationVisible: boolean;
  isPasswordVisible: boolean;
  isSubmitting: boolean;
  lastName: string;
  onBack: () => void;
  onChangeEmail: (value: string) => void;
  onChangeFirstName: (value: string) => void;
  onChangeLastName: (value: string) => void;
  onChangePassword: (value: string) => void;
  onChangePasswordConfirmation: (value: string) => void;
  onChangePhone: (value: string) => void;
  onRegister: () => void;
  onTogglePasswordConfirmationVisibility: () => void;
  onTogglePasswordVisibility: () => void;
  password: string;
  passwordConfirmation: string;
  phone: string;
};

export function RegistrationView({
  email,
  error,
  fieldErrors,
  firstName,
  isPasswordConfirmationVisible,
  isPasswordVisible,
  isSubmitting,
  lastName,
  onBack,
  onChangeEmail,
  onChangeFirstName,
  onChangeLastName,
  onChangePassword,
  onChangePasswordConfirmation,
  onChangePhone,
  onRegister,
  onTogglePasswordConfirmationVisibility,
  onTogglePasswordVisibility,
  password,
  passwordConfirmation,
  phone,
}: RegistrationViewProps) {
  const insets = useSafeAreaInsets();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.keyboardView}
    >
      <ScrollView
        contentContainerStyle={[
          styles.page,
          { paddingBottom: Math.max(insets.bottom + 92, 112) },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <AppHeader showCart={false} subtitle="Lorem ipsum" />
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>A Regina T’Aspetta</Text>

          <Pressable
            accessibilityLabel="Torna al login"
            accessibilityRole="button"
            hitSlop={8}
            onPress={onBack}
            style={({ pressed }) => [styles.backRow, pressed && styles.pressed]}
          >
            <View style={styles.backIcon}>
              <FontAwesome6
                color={colors.surface}
                name="chevron-left"
                size={15}
              />
            </View>
            <Text style={styles.subtitle}>Registrati!</Text>
          </Pressable>

          <View style={styles.form}>
            <AuthField
              autoComplete="given-name"
              error={fieldErrors.first_name}
              icon="user"
              label="Nome"
              onChangeText={onChangeFirstName}
              returnKeyType="next"
              value={firstName}
            />
            <AuthField
              autoComplete="family-name"
              error={fieldErrors.last_name}
              icon="user"
              label="Cognome"
              onChangeText={onChangeLastName}
              returnKeyType="next"
              value={lastName}
            />
            <AuthField
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect={false}
              error={fieldErrors.email}
              icon="envelope"
              keyboardType="email-address"
              label="Email"
              onChangeText={onChangeEmail}
              returnKeyType="next"
              value={email}
            />
            <AuthField
              autoComplete="tel"
              error={fieldErrors.phone}
              icon="phone"
              keyboardType="phone-pad"
              label="Numero di telefono"
              onChangeText={onChangePhone}
              returnKeyType="next"
              value={phone}
            />
            <AuthField
              autoCapitalize="none"
              autoComplete="new-password"
              error={fieldErrors.password}
              icon="lock"
              label="Password"
              onChangeText={onChangePassword}
              onToggleVisibility={onTogglePasswordVisibility}
              passwordVisible={isPasswordVisible}
              returnKeyType="next"
              secureTextEntry={!isPasswordVisible}
              value={password}
            />
            <AuthField
              autoCapitalize="none"
              autoComplete="new-password"
              error={fieldErrors.password_confirmation}
              icon="lock"
              label="Ripeti Password"
              onChangeText={onChangePasswordConfirmation}
              onSubmitEditing={onRegister}
              onToggleVisibility={onTogglePasswordConfirmationVisibility}
              passwordVisible={isPasswordConfirmationVisible}
              returnKeyType="done"
              secureTextEntry={!isPasswordConfirmationVisible}
              value={passwordConfirmation}
            />
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <Pressable
            accessibilityRole="button"
            disabled={isSubmitting}
            onPress={onRegister}
            style={({ pressed }) => [
              styles.registerButton,
              isSubmitting && styles.disabled,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.registerButtonText}>
              {isSubmitting ? "Registrazione..." : "Registrati"}
            </Text>
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
  card: {
    backgroundColor: colors.card,
    borderRadius: 27,
    elevation: 5,
    marginHorizontal: 20,
    marginTop: 22,
    maxWidth: 570,
    paddingBottom: 20,
    paddingHorizontal: 22,
    paddingTop: 34,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 7,
    width: "90%",
  },
  title: {
    color: colors.text,
    fontFamily: fonts.bold,
    fontSize: responsiveFontSize(38),
    lineHeight: 43,
  },
  backRow: {
    alignItems: "center",
    alignSelf: "flex-start",
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
  },
  backIcon: {
    alignItems: "center",
    backgroundColor: colors.text,
    borderRadius: 13,
    height: 26,
    justifyContent: "center",
    width: 26,
  },
  subtitle: {
    color: colors.text,
    fontFamily: fonts.bold,
    fontSize: responsiveFontSize(21),
  },
  form: {
    gap: 16,
    marginTop: 17,
  },
  registerButton: {
    alignItems: "center",
    backgroundColor: colors.text,
    borderRadius: 12,
    elevation: 3,
    justifyContent: "center",
    marginTop: 22,
    minHeight: 46,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
  },
  errorText: {
    color: colors.error,
    fontFamily: fonts.regular,
    fontSize: responsiveFontSize(15),
    marginTop: 16,
    textAlign: "center",
  },
  disabled: {
    opacity: 0.6,
  },
  registerButtonText: {
    color: colors.surface,
    fontFamily: fonts.bold,
    fontSize: responsiveFontSize(18),
  },
  pressed: {
    opacity: 0.75,
  },
});
