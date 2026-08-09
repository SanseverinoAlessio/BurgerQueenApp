import axios from "axios";
import { useRouter } from "expo-router";
import { useCallback, useContext, useState } from "react";

import { AuthContext } from "@/context/auth.context";
import type { LoginFieldErrors } from "@/schemas/auth.schemas";
import { loginSchema } from "@/schemas/auth.schemas";
import AuthService from "@/services/api/AuthService";
import JwtService from "@/services/JwtService";

import { LoginView } from "./LoginView";

export function LoginContainer() {
  const router = useRouter();
  const { signIn } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<LoginFieldErrors>({});

  const togglePasswordVisibility = useCallback(() => {
    setIsPasswordVisible((isVisible) => !isVisible);
  }, []);

  const handleLogin = useCallback(async () => {
    const validation = loginSchema.safeParse({ email, password });

    if (!validation.success) {
      const errors = validation.error.flatten().fieldErrors;
      setFieldErrors({
        email: errors.email?.[0],
        password: errors.password?.[0],
      });
      setError(null);
      return;
    }

    setFieldErrors({});
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await AuthService.login(
        validation.data.email,
        validation.data.password,
      );
      await JwtService.setTokenPair(
        response.access_token,
        response.refresh_token,
      );
      signIn();
      router.replace("/");
    } catch (caughtError) {
      if (axios.isAxiosError<{ message?: string }>(caughtError)) {
        setError(
          caughtError.response?.data?.message ??
            "Non è stato possibile effettuare l’accesso.",
        );
      } else {
        setError("Non è stato possibile effettuare l’accesso.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [email, password, router, signIn]);

  const handleForgotPassword = useCallback(() => {
    // Password recovery navigation will be connected here.
  }, []);

  const handleRegister = useCallback(() => {
    router.push("/account/register");
  }, [router]);

  return (
    <LoginView
      email={email}
      error={error}
      fieldErrors={fieldErrors}
      isPasswordVisible={isPasswordVisible}
      isSubmitting={isSubmitting}
      onChangeEmail={(value) => {
        setEmail(value);
        setError(null);
        setFieldErrors((current) => ({ ...current, email: undefined }));
      }}
      onChangePassword={(value) => {
        setPassword(value);
        setError(null);
        setFieldErrors((current) => ({ ...current, password: undefined }));
      }}
      onForgotPassword={handleForgotPassword}
      onLogin={handleLogin}
      onRegister={handleRegister}
      onTogglePasswordVisibility={togglePasswordVisibility}
      password={password}
    />
  );
}
