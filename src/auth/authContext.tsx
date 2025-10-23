import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../api/api";

type AuthContextValue = {
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));

  // mantém localStorage em sincronia
  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }, [token]);

  // login padrão da API do teste. 
  async function login(username: string, password: string) {
    try {
      const r = await api.post("/token/", { username, password });
      setToken(r.data?.access_token || r.data?.token || "");
      return;
    } catch {
      const r2 = await api.post("/token", { username, password });
      setToken(r2.data?.access_token || r2.data?.token || "");
    }
  }

  function logout() {
    setToken(null);
  }

  const value = useMemo<AuthContextValue>(() => ({ token, login, logout }), [token]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext precisa estar dentro de <AuthProvider>.");
  return ctx;
}
