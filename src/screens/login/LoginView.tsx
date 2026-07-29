import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
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

import { colors } from "@/theme/colors";
import { fonts } from "@/theme/fonts";
import { responsiveFontSize } from "@/utils/responsiveFontSize";

type LoginViewProps = {
  email: string;
  isPasswordVisible: boolean;
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
  isPasswordVisible,
  onChangeEmail,
  onChangePassword,
  onForgotPassword,
  onLogin,
  onRegister,
  onTogglePasswordVisibility,
  password,
}: LoginViewProps) {
  const insets = useSafeAreaInsets();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.keyboardView}
    >
      <ScrollView
        contentContainerStyle={[
          styles.page,
          {
            paddingBottom: Math.max(insets.bottom, 20),
            paddingTop: Math.max(insets.top, 20),
          },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <Text style={styles.title}>A Regina T’Aspetta</Text>
          <Text style={styles.subtitle}>Accedi al tuo account</Text>

          <View style={styles.form}>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Username</Text>
              <View style={styles.inputContainer}>
                <FontAwesome6
                  color={colors.textMuted}
                  name="envelope"
                  size={21}
                />
                <TextInput
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect={false}
                  keyboardType="email-address"
                  onChangeText={onChangeEmail}
                  placeholder="Email"
                  placeholderTextColor={colors.textMuted}
                  returnKeyType="next"
                  style={styles.input}
                  value={email}
                />
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputContainer}>
                <FontAwesome6
                  color={colors.textMuted}
                  name="lock"
                  size={21}
                />
                <TextInput
                  autoCapitalize="none"
                  autoComplete="current-password"
                  onChangeText={onChangePassword}
                  onSubmitEditing={onLogin}
                  placeholder="La tua password..."
                  placeholderTextColor={colors.textMuted}
                  returnKeyType="done"
                  secureTextEntry={!isPasswordVisible}
                  style={styles.input}
                  value={password}
                />
                <Pressable
                  accessibilityLabel={
                    isPasswordVisible
                      ? "Nascondi password"
                      : "Mostra password"
                  }
                  accessibilityRole="button"
                  hitSlop={10}
                  onPress={onTogglePasswordVisibility}
                >
                  <FontAwesome6
                    color={colors.textMuted}
                    name={isPasswordVisible ? "eye-slash" : "eye"}
                    size={19}
                  />
                </Pressable>
              </View>
            </View>
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

          <Pressable
            accessibilityRole="button"
            onPress={onLogin}
            style={({ pressed }) => [
              styles.loginButton,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.loginButtonText}>Accedi</Text>
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
    justifyContent: "center",
    paddingHorizontal: 5,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 30,
    elevation: 5,
    maxWidth: 570,
    paddingBottom: 42,
    paddingHorizontal: 30,
    paddingTop: 48,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 7,
    width: "100%",
  },
  title: {
    color: colors.text,
    fontFamily: fonts.bold,
    fontSize: responsiveFontSize(42),
    lineHeight: 48,
  },
  subtitle: {
    color: colors.text,
    fontFamily: fonts.regular,
    fontSize: responsiveFontSize(25),
    lineHeight: 30,
    marginTop: 2,
  },
  form: {
    gap: 20,
    marginTop: 36,
  },
  fieldGroup: {
    gap: 6,
  },
  label: {
    color: colors.text,
    fontFamily: fonts.regular,
    fontSize: responsiveFontSize(22),
    lineHeight: 27,
    marginLeft: 5,
  },
  inputContainer: {
    alignItems: "center",
    backgroundColor: colors.background,
    borderColor: "#B7B7B7",
    borderRadius: 28,
    borderWidth: 2,
    elevation: 3,
    flexDirection: "row",
    height: 56,
    paddingHorizontal: 14,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  input: {
    color: colors.text,
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: responsiveFontSize(18),
    height: "100%",
    marginLeft: 10,
    paddingVertical: 0,
  },
  forgotButton: {
    alignSelf: "flex-end",
    marginRight: 8,
    marginTop: 10,
  },
  forgotText: {
    color: colors.text,
    fontFamily: fonts.regular,
    fontSize: responsiveFontSize(18),
  },
  inlineBold: {
    fontFamily: fonts.bold,
  },
  loginButton: {
    alignItems: "center",
    backgroundColor: colors.text,
    borderRadius: 15,
    elevation: 3,
    justifyContent: "center",
    marginTop: 28,
    minHeight: 70,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
  },
  loginButtonText: {
    color: colors.surface,
    fontFamily: fonts.bold,
    fontSize: responsiveFontSize(24),
  },
  registerButton: {
    alignSelf: "center",
    marginTop: 20,
  },
  registerText: {
    color: colors.text,
    fontFamily: fonts.regular,
    fontSize: responsiveFontSize(20),
    textAlign: "center",
  },
  pressed: {
    opacity: 0.75,
  },
});
