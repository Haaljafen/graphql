import { createContext, useContext, useMemo, useState } from "react";
import { clearToken, getToken, setToken } from "../utils/token";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(getToken());

  const value = useMemo(() => {
    return {
      token,
      isAuthed: !!token,
      login: (jwt) => {
        setToken(jwt);
        setTokenState(jwt);
      },
      logout: () => {
        clearToken();
        setTokenState(null);
      },
    };
  }, [token]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
