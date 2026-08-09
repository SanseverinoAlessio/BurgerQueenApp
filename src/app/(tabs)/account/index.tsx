import { AuthContext } from "@/context/auth.context";
import { AccountContainer } from "@/screens/account";
import { LoginContainer } from "@/screens/login";
import { useContext } from "react";

export default function AccountLoginRoute() {
  const context = useContext(AuthContext);

  if (!context.isLoggedIn) return <LoginContainer />;

  return <AccountContainer />;
}
