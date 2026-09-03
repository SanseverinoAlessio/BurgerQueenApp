import axios from "axios";
import { useRouter } from "expo-router";
import { useCallback, useContext, useEffect, useRef, useState } from "react";

import { AuthContext } from "@/context/auth.context";
import AuthService from "@/services/api/AuthService";

import { PhoneVerificationView } from "./PhoneVerificationView";

type OtpApiError = {
  errors?: Record<string, string[]>;
  message?: string;
  retry_after?: number;
};

function getOtpError(error: unknown): { message: string; retryAfter: number } {
  if (!axios.isAxiosError<OtpApiError>(error)) {
    return { message: "Si è verificato un errore. Riprova.", retryAfter: 0 };
  }
  return {
    message: Object.values(error.response?.data.errors ?? {})[0]?.[0] ?? error.response?.data.message ?? "Si è verificato un errore. Riprova.",
    retryAfter: Number(error.response?.data.retry_after ?? error.response?.headers["retry-after"] ?? 0),
  };
}

export function PhoneVerificationContainer() {
  const router = useRouter();
  const { setProfile } = useContext(AuthContext);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const initialRequestSent = useRef(false);

  const sendOtp = useCallback(async () => {
    if (isSending || remainingSeconds > 0) return;
    setIsSending(true);
    setError(null);
    try {
      const retryAfter = await AuthService.sendPhoneVerificationOtp();
      setRemainingSeconds(Math.max(1, retryAfter));
      setMessage("Il codice è stato inviato al tuo numero di telefono.");
    } catch (caughtError) {
      const apiError = getOtpError(caughtError);
      setError(apiError.message);
      if (apiError.retryAfter > 0) setRemainingSeconds(apiError.retryAfter);
    } finally {
      setIsSending(false);
    }
  }, [isSending, remainingSeconds]);

  useEffect(() => {
    if (!initialRequestSent.current) {
      initialRequestSent.current = true;
      void sendOtp();
    }
  }, [sendOtp]);

  useEffect(() => {
    if (remainingSeconds <= 0) return;
    const timer = setInterval(() => {
      setRemainingSeconds((seconds) => Math.max(0, seconds - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [remainingSeconds]);

  const handleVerify = useCallback(async () => {
    if (!otp.trim() || isVerifying) {
      if (!otp.trim()) setError("Inserisci il codice OTP.");
      return;
    }
    setIsVerifying(true);
    setError(null);
    try {
      const profile = await AuthService.verifyPhoneVerificationOtp(otp.trim());
      setProfile(profile);
      router.replace("/cart");
    } catch (caughtError) {
      setError(getOtpError(caughtError).message);
    } finally {
      setIsVerifying(false);
    }
  }, [isVerifying, otp, router, setProfile]);

  return (
    <PhoneVerificationView
      error={error}
      isSending={isSending}
      isVerifying={isVerifying}
      message={message}
      onBack={() => router.back()}
      onChangeOtp={(value) => { setOtp(value.replace(/\D/g, "")); setError(null); }}
      onResend={() => void sendOtp()}
      onVerify={() => void handleVerify()}
      otp={otp}
      remainingSeconds={remainingSeconds}
    />
  );
}
