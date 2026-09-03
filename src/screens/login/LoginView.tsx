import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppHeader } from "@/components/AppHeader";
import { AuthField } from "@/components/AuthField";
import type { LoginFieldErrors } from "@/schemas/auth.schemas";
import { colors } from "@/theme/colors";
import { fonts } from "@/theme/fonts";
import { responsiveFontSize } from "@/utils/responsiveFontSize";

type LoginViewProps = {
  email: string;
  error: string | null;
  fieldErrors: LoginFieldErrors;
  isPasswordVisible: boolean;
  isSubmitting: boolean;
  onChangeEmail: (email: string) => void;
  onChangePassword: (password: string) => void;
  onForgotPassword: () => void;
  onLogin: () => void;
  onRegister: () => void;
  onTogglePasswordVisibility: () => void;
  password: string;
};

export function LoginView({
  email,
  error,
  fieldErrors,
  isPasswordVisible,
  isSubmitting,
  onChangeEmail,
  onChangePassword,
  onForgotPassword,
  onLogin,
  onRegister,
  onTogglePasswordVisibility,
  password,
}: LoginViewProps) {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.keyboardView}
    >
      <SafeAreaView edges={["right", "bottom", "left"]} style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.page}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <AppHeader showCart={false} subtitle="Lorem ipsum" />
          </View>

          <View style={styles.cardShadow}>
            <View style={styles.card}>
              <Text style={styles.title}>A Regina T’Aspetta</Text>
              <Text style={styles.subtitle}>Accedi al tuo account</Text>

              <View style={styles.form}>
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
                  autoCapitalize="none"
                  autoComplete="current-password"
                  error={fieldErrors.password}
                  icon="lock"
                  label="Password"
                  onChangeText={onChangePassword}
                  onSubmitEditing={onLogin}
                  onToggleVisibility={onTogglePasswordVisibility}
                  passwordVisible={isPasswordVisible}
                  returnKeyType="done"
                  secureTextEntry={!isPasswordVisible}
                  value={password}
                />
              </View>

              <Pressable
                accessibilityRole="button"
                hitSlop={8}
                onPress={onForgotPassword}
                style={({ pressed }) => [
                  styles.forgotButton,
                  pressed && styles.pressed,
                ]}
              >
                <Text style={styles.forgotText}>
                  Hai dimenticato la{" "}
                  <Text style={styles.inlineBold}>password?</Text>
                </Text>
              </Pressable>

              {error ? <Text style={styles.errorText}>{error}</Text> : null}

              <Pressable
                accessibilityRole="button"
                disabled={isSubmitting}
                onPress={onLogin}
                style={({ pressed }) => [
                  styles.loginButton,
                  isSubmitting && styles.disabled,
                  pressed && styles.pressed,
                ]}
              >
                <Text style={styles.loginButtonText}>
                  {isSubmitting ? "Accesso..." : "Accedi"}
                </Text>
              </Pressable>

              <Pressable
                accessibilityRole="button"
                hitSlop={8}
                onPress={onRegister}
                style={({ pressed }) => [
                  styles.registerButton,
                  pressed && styles.pressed,
                ]}
              >
                <Text style={styles.registerText}>
                  Non hai ancora un account?{" "}
                  <Text style={styles.inlineBold}>registrati</Text>
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.background,
    flex: 1,
  },
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
  cardShadow: {
    backgroundColor: colors.card,
    borderRadius: 28,
    elevation: 5,
    marginHorizontal: 14,
    marginTop: 22,
    maxWidth: 570,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 7,
    width: "92%",
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 28,
    overflow: "hidden",
    paddingBottom: 34,
    paddingHorizontal: 22,
    paddingTop: 38,
    width: "100%",
  },
  title: {
    color: colors.text,
    fontFamily: fonts.bold,
    fontSize: responsiveFontSize(39),
    lineHeight: 44,
  },
  subtitle: {
    color: colors.text,
    fontFamily: fonts.regular,
    fontSize: responsiveFontSize(21),
    lineHeight: 26,
    marginTop: 2,
  },
  form: {
    gap: 17,
    marginTop: 28,
  },
  forgotButton: {
    alignSelf: "flex-end",
    marginRight: 5,
    marginTop: 9,
  },
  forgotText: {
    color: colors.text,
    fontFamily: fonts.regular,
    fontSize: responsiveFontSize(17),
  },
  inlineBold: {
    fontFamily: fonts.bold,
  },
  loginButton: {
    alignItems: "center",
    backgroundColor: colors.text,
    borderRadius: 14,
    elevation: 3,
    justifyContent: "center",
    marginTop: 24,
    minHeight: 58,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
  },
  errorText: {
    color: colors.error,
    fontFamily: fonts.regular,
    fontSize: responsiveFontSize(15),
    marginTop: 14,
    textAlign: "center",
  },
  disabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    color: colors.surface,
    fontFamily: fonts.bold,
    fontSize: responsiveFontSize(21),
  },
  registerButton: {
    alignSelf: "center",
    marginTop: 18,
  },
  registerText: {
    color: colors.text,
    fontFamily: fonts.regular,
    fontSize: responsiveFontSize(18),
    textAlign: "center",
  },
  pressed: {
    opacity: 0.75,
  },
});
