import { AuthContext } from "@/context/auth.context";
import { useRouter } from "expo-router";
import { useCallback, useContext, useState } from "react";

import { AccountView } from "./AccountView";

export function AccountContainer() {
  const router = useRouter();
  const { signOut, user } = useContext(AuthContext);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleEditProfile = useCallback(() => {
    router.push("/account/edit-account");
  }, [router]);

  const handleLogout = useCallback(async () => {
    setIsLoggingOut(true);

    try {
      await signOut();
    } catch {
      // La sessione locale viene comunque chiusa dal provider.
    }
  }, [signOut]);

  return (
    <AccountView
      displayName={user ? `${user.first_name} ${user.last_name}`.trim() : "Utente"}
      isLoggingOut={isLoggingOut}
      onEditProfile={handleEditProfile}
      onLogout={handleLogout}
    />
  );
}
