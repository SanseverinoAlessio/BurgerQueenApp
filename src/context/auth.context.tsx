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
import type { UserProfile } from "@/types/auth";

type AuthContextValue = {
  isLoggedIn: boolean;
  loading: boolean;
  refreshProfile: () => Promise<UserProfile>;
  setProfile: (profile: UserProfile) => void;
  signIn: (profile: UserProfile) => void;
  signOut: () => Promise<void>;
  user: UserProfile | null;
};

export const AuthContext = createContext<AuthContextValue>({
  isLoggedIn: false,
  loading: false,
  refreshProfile: async () => {
    throw new Error("AuthProvider is not available.");
  },
  setProfile: () => {},
  signIn: () => {},
  signOut: async () => {},
  user: null,
});

export function AuthProvider({ children }: PropsWithChildren) {
  const [isLoggedIn, setIsLogged] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);

  const refreshProfile = useCallback(async () => {
    const profile = await AuthService.getProfile();
    setUser(profile);
    return profile;
  }, []);

  const signOut = useCallback(async () => {
    try {
      await AuthService.logout();
    } finally {
      setIsLogged(false);
      setUser(null);
      await JwtService.removeTokens();
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const getTokens = async () => {
      try {
        const accessToken = await JwtService.getAccessToken();

        if (isMounted && accessToken !== null) {
          const profile = await AuthService.getProfile();
          if (isMounted) {
            setUser(profile);
            setIsLogged(true);
          }
        } else if (isMounted) {
          setUser(null);
          setIsLogged(false);
        }
      } catch {
        if (isMounted) {
          setUser(null);
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
    () =>
      setSessionExpiredHandler(() => {
        setUser(null);
        setIsLogged(false);
      }),
    [],
  );

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: isLoggedIn,
        loading,
        refreshProfile,
        setProfile: setUser,
        signIn: (profile) => {
          setUser(profile);
          setIsLogged(true);
        },
        signOut,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
