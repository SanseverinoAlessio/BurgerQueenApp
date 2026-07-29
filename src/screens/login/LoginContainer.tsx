import { useCallback, useState } from "react";

import { LoginView } from "./LoginView";

export function LoginContainer() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = useCallback(() => {
    setIsPasswordVisible((isVisible) => !isVisible);
  }, []);

  const handleLogin = useCallback(() => {
    // The authentication service will be connected here.
  }, []);

  const handleForgotPassword = useCallback(() => {
    // Password recovery navigation will be connected here.
  }, []);

  const handleRegister = useCallback(() => {
    // Registration navigation will be connected here.
  }, []);

  return (
    <LoginView
      email={email}
      isPasswordVisible={isPasswordVisible}
      onChangeEmail={setEmail}
      onChangePassword={setPassword}
      onForgotPassword={handleForgotPassword}
      onLogin={handleLogin}
      onRegister={handleRegister}
      onTogglePasswordVisibility={togglePasswordVisibility}
      password={password}
    />
  );
}
