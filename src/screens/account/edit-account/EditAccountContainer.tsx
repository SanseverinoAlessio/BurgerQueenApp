import axios from "axios";
import { useRouter } from "expo-router";
import { useCallback, useContext, useEffect, useState } from "react";

import { AuthContext } from "@/context/auth.context";
import AuthService from "@/services/api/AuthService";

import { EditAccountView, type EditAccountTab } from "./EditAccountView";

type ApiError = { errors?: Record<string, string[]>; message?: string };

function getErrorMessage(error: unknown): string {
  if (!axios.isAxiosError<ApiError>(error)) return "Non è stato possibile salvare le modifiche.";
  return Object.values(error.response?.data.errors ?? {})[0]?.[0] ?? error.response?.data.message ?? "Non è stato possibile salvare le modifiche.";
}

export default function EditAccountContainer() {
  const router = useRouter();
  const { setProfile, user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState<EditAccountTab>("account");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setFirstName(user.first_name);
      setLastName(user.last_name);
      setPhone(user.phone);
    }
  }, [user]);

  const handleBack = useCallback(() => {
    if (router.canGoBack()) router.back();
    else router.replace("/account");
  }, [router]);

  const selectTab = useCallback((tab: EditAccountTab) => {
    setActiveTab(tab);
    setError(null);
    setSuccess(null);
  }, []);

  const handleSave = useCallback(async () => {
    setError(null);
    setSuccess(null);
    if (activeTab === "account" && (!firstName.trim() || !lastName.trim() || !phone.trim())) {
      setError("Compila tutti i campi del profilo.");
      return;
    }
    if (activeTab === "password") {
      if (!currentPassword || !newPassword || !repeatPassword) {
        setError("Compila tutti i campi password.");
        return;
      }
      if (newPassword !== repeatPassword) {
        setError("Le nuove password non coincidono.");
        return;
      }
      if (newPassword.length < 8) {
        setError("La nuova password deve contenere almeno 8 caratteri.");
        return;
      }
    }

    setIsSaving(true);
    try {
      if (activeTab === "account") {
        const profile = await AuthService.updateProfile({ first_name: firstName.trim(), last_name: lastName.trim(), phone: phone.trim() });
        setProfile(profile);
        setSuccess("Profilo aggiornato con successo.");
      } else {
        await AuthService.updatePassword({ current_password: currentPassword, password: newPassword, password_confirmation: repeatPassword });
        setCurrentPassword("");
        setNewPassword("");
        setRepeatPassword("");
        setSuccess("Password aggiornata con successo.");
      }
    } catch (caughtError) {
      setError(getErrorMessage(caughtError));
    } finally {
      setIsSaving(false);
    }
  }, [activeTab, currentPassword, firstName, lastName, newPassword, phone, repeatPassword, setProfile]);

  return (
    <EditAccountView
      activeTab={activeTab}
      currentPassword={currentPassword}
      displayName={`${firstName} ${lastName}`.trim() || "Utente"}
      error={error}
      firstName={firstName}
      isSaving={isSaving}
      lastName={lastName}
      newPassword={newPassword}
      onAccountTabPress={() => selectTab("account")}
      onBack={handleBack}
      onChangeCurrentPassword={setCurrentPassword}
      onChangeFirstName={setFirstName}
      onChangeLastName={setLastName}
      onChangeNewPassword={setNewPassword}
      onChangePhone={setPhone}
      onChangeRepeatPassword={setRepeatPassword}
      onPasswordTabPress={() => selectTab("password")}
      onSave={() => void handleSave()}
      phone={phone}
      repeatPassword={repeatPassword}
      success={success}
    />
  );
}
