import axios from "axios";
import { useRouter } from "expo-router";
import { useCallback, useContext, useState } from "react";

import { AuthContext } from "@/context/auth.context";
import type { RegistrationFieldErrors } from "@/schemas/auth.schemas";
import {
  createRegistrationSchema,
  registrationFieldsSchema,
} from "@/schemas/auth.schemas";
import AuthService from "@/services/api/AuthService";
import JwtService from "@/services/JwtService";

import { RegistrationView } from "./RegistrationView";

const registrationSchema = createRegistrationSchema(
  AuthService.isEmailAvailable,
);

export function RegistrationContainer() {
  const router = useRouter();
  const { signIn } = useContext(AuthContext);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isPasswordConfirmationVisible, setIsPasswordConfirmationVisible] =
    useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<RegistrationFieldErrors>({});

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  const handleRegister = useCallback(async () => {
    const fieldsValidation = registrationFieldsSchema.safeParse({
      first_name: firstName,
      last_name: lastName,
      email,
      phone,
      password,
      password_confirmation: passwordConfirmation,
    });

    if (!fieldsValidation.success) {
      const errors = fieldsValidation.error.flatten().fieldErrors;
      setFieldErrors({
        first_name: errors.first_name?.[0],
        last_name: errors.last_name?.[0],
        email: errors.email?.[0],
        phone: errors.phone?.[0],
        password: errors.password?.[0],
        password_confirmation: errors.password_confirmation?.[0],
      });
      setError(null);
      return;
    }

    setFieldErrors({});
    setError(null);
    setIsSubmitting(true);

    try {
      const validation = await registrationSchema.safeParseAsync(
        fieldsValidation.data,
      );

      if (!validation.success) {
        const errors = validation.error.flatten().fieldErrors;
        setFieldErrors({
          email: errors.email?.[0],
        });
        return;
      }

      const response = await AuthService.register(validation.data);
      await JwtService.setTokenPair(
        response.access_token,
        response.refresh_token,
      );
      signIn(response.profile);
      router.replace("/");
    } catch (caughtError) {
      if (axios.isAxiosError<{ message?: string }>(caughtError)) {
        setError(
          caughtError.response?.data?.message ??
            "Non è stato possibile completare la registrazione.",
        );
      } else {
        setError("Non è stato possibile completare la registrazione.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [
    email,
    firstName,
    lastName,
    password,
    passwordConfirmation,
    phone,
    router,
    signIn,
  ]);

  return (
    <RegistrationView
      email={email}
      error={error}
      fieldErrors={fieldErrors}
      firstName={firstName}
      isPasswordConfirmationVisible={isPasswordConfirmationVisible}
      isPasswordVisible={isPasswordVisible}
      isSubmitting={isSubmitting}
      lastName={lastName}
      onBack={handleBack}
      onChangeEmail={(value) => {
        setEmail(value);
        setError(null);
        setFieldErrors((current) => ({ ...current, email: undefined }));
      }}
      onChangeFirstName={(value) => {
        setFirstName(value);
        setError(null);
        setFieldErrors((current) => ({ ...current, first_name: undefined }));
      }}
      onChangeLastName={(value) => {
        setLastName(value);
        setError(null);
        setFieldErrors((current) => ({ ...current, last_name: undefined }));
      }}
      onChangePassword={(value) => {
        setPassword(value);
        setError(null);
        setFieldErrors((current) => ({ ...current, password: undefined }));
      }}
      onChangePasswordConfirmation={(value) => {
        setPasswordConfirmation(value);
        setError(null);
        setFieldErrors((current) => ({
          ...current,
          password_confirmation: undefined,
        }));
      }}
      onChangePhone={(value) => {
        setPhone(value);
        setError(null);
        setFieldErrors((current) => ({ ...current, phone: undefined }));
      }}
      onRegister={handleRegister}
      onTogglePasswordConfirmationVisibility={() =>
        setIsPasswordConfirmationVisible((isVisible) => !isVisible)
      }
      onTogglePasswordVisibility={() =>
        setIsPasswordVisible((isVisible) => !isVisible)
      }
      password={password}
      passwordConfirmation={passwordConfirmation}
      phone={phone}
    />
  );
}
