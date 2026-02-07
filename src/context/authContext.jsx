import { createContext, useContext, useMemo, useState } from "react";
import { clearToken, getToken, setToken } from "../utils/token";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(getToken());
  
  console.log('AuthProvider - token:', token ? 'exists' : 'none');

  const value = useMemo(() => {
    return {
      token,
      isAuthed: !!token,
      login: (jwt) => {
        console.log('AuthProvider - login called');
        setToken(jwt);
        setTokenState(jwt);
      },
      logout: () => {
        console.log('AuthProvider - logout called');
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
