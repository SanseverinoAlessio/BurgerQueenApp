import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
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

type PhoneVerificationViewProps = {
  error: string | null;
  isSending: boolean;
  isVerifying: boolean;
  message: string | null;
  onBack: () => void;
  onChangeOtp: (value: string) => void;
  onResend: () => void;
  onVerify: () => void;
  otp: string;
  remainingSeconds: number;
};

export function PhoneVerificationView(props: PhoneVerificationViewProps) {
  const { error, isSending, isVerifying, message, onBack, onChangeOtp, onResend, onVerify, otp, remainingSeconds } = props;
  const insets = useSafeAreaInsets();

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.page}>
      <AppHeader showCart={false} subtitle="Sicurezza account" />
      <View style={[styles.content, { paddingBottom: Math.max(insets.bottom + 24, 32) }]}>
        <Pressable accessibilityLabel="Torna al checkout" onPress={onBack} style={styles.backButton}>
          <FontAwesome6 color={colors.text} name="chevron-left" size={18} />
        </Pressable>
        <View style={styles.card}>
          <View style={styles.icon}><FontAwesome6 color={colors.text} name="mobile-screen-button" size={30} /></View>
          <Text style={styles.title}>Verifica il numero</Text>
          <Text style={styles.description}>Inserisci il codice OTP ricevuto tramite SMS per poter confermare l’ordine.</Text>
          <TextInput
            accessibilityLabel="Codice OTP"
            keyboardType="number-pad"
            maxLength={20}
            onChangeText={onChangeOtp}
            placeholder="Codice OTP"
            style={styles.input}
            value={otp}
          />
          {message ? <Text style={styles.message}>{message}</Text> : null}
          {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
          <Pressable disabled={isVerifying || otp.length === 0} onPress={onVerify} style={[styles.primaryButton, (isVerifying || otp.length === 0) && styles.disabled]}>
            {isVerifying ? <ActivityIndicator color={colors.text} /> : <Text style={styles.primaryText}>Verifica</Text>}
          </Pressable>
          <Pressable disabled={isSending || remainingSeconds > 0} onPress={onResend} style={styles.resendButton}>
            <Text style={[styles.resendText, (isSending || remainingSeconds > 0) && styles.muted]}>
              {isSending ? "Invio in corso..." : remainingSeconds > 0 ? `Invia di nuovo tra ${remainingSeconds}s` : "Invia di nuovo"}
            </Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  page: { backgroundColor: colors.background, flex: 1 },
  content: { flex: 1, justifyContent: "center", paddingHorizontal: 24 },
  backButton: { alignItems: "center", backgroundColor: colors.title, borderRadius: 18, height: 36, justifyContent: "center", marginBottom: 14, width: 36 },
  card: { alignItems: "center", backgroundColor: colors.surface, borderRadius: 22, elevation: 5, padding: 24, shadowColor: colors.shadow, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.14, shadowRadius: 7 },
  icon: { alignItems: "center", backgroundColor: colors.title, borderRadius: 30, height: 60, justifyContent: "center", width: 60 },
  title: { color: colors.text, fontFamily: fonts.bold, fontSize: responsiveFontSize(27), marginTop: 14 },
  description: { color: colors.textMuted, fontFamily: fonts.regular, fontSize: responsiveFontSize(16), lineHeight: 22, marginTop: 8, textAlign: "center" },
  input: { backgroundColor: colors.background, borderColor: colors.border, borderRadius: 22, borderWidth: 1, color: colors.text, fontFamily: fonts.semiBold, fontSize: responsiveFontSize(22), height: 50, letterSpacing: 6, marginTop: 22, paddingHorizontal: 18, textAlign: "center", width: "100%" },
  message: { color: "#16794A", fontFamily: fonts.regular, marginTop: 12, textAlign: "center" },
  error: { color: colors.error, fontFamily: fonts.regular, marginTop: 12, textAlign: "center" },
  primaryButton: { alignItems: "center", backgroundColor: colors.title, borderRadius: 22, height: 46, justifyContent: "center", marginTop: 20, width: "100%" },
  primaryText: { color: colors.text, fontFamily: fonts.bold, fontSize: responsiveFontSize(17) },
  resendButton: { marginTop: 16, padding: 8 },
  resendText: { color: colors.text, fontFamily: fonts.semiBold, fontSize: responsiveFontSize(15) },
  muted: { color: colors.textMuted },
  disabled: { opacity: 0.5 },
});
