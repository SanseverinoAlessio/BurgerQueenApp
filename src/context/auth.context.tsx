import AuthService from "@/services/api/AuthService";
import { setSessionExpiredHandler } from "@/services/AuthSessionEvents";
import JwtService from "@/services/JwtService";
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useEffect,
  useState,
} from "react";

type AuthContextValue = {
  isLoggedIn: boolean;
  loading: boolean;
  signIn: () => void;
  signOut: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue>({
  isLoggedIn: false,
  loading: false,
  signIn: () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: PropsWithChildren) {
  const [isLoggedIn, setIsLogged] = useState(false);
  const [loading, setLoading] = useState(true);

  const signOut = useCallback(async () => {
    try {
      await AuthService.logout();
    } finally {
      setIsLogged(false);
      await JwtService.removeTokens();
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const getTokens = async () => {
      try {
        const accessToken = await JwtService.getAccessToken();

        if (isMounted) {
          setIsLogged(accessToken !== null);
        }
      } catch {
        if (isMounted) {
          setIsLogged(false);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void getTokens();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(
    () => setSessionExpiredHandler(() => setIsLogged(false)),
    [],
  );

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: isLoggedIn,
        loading,
        signIn: () => {
          setIsLogged(true);
        },
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
