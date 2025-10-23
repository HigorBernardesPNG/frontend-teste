import { createContext, useMemo, useState, type ReactNode } from 'react';
import { login as doLogin } from '../api/auth';

export type AuthContextType = {
  token: string | null;
  login: (u: string, p: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(localStorage.getItem('auth_token'));

  async function login(username: string, password: string) {
    const data = await doLogin({ username, password });

    // Aceitar várias formas de retorno
    const raw = data as any;
    const access: string | undefined =
      raw?.access ??
      raw?.access_token ??
      raw?.token ??
      raw?.jwt;

    const tokenType: string = (raw?.token_type ?? 'Bearer') as string;

    if (!access) {
      throw new Error('Resposta da API não contém token de acesso.');
    }

    // Persistir token e tipo
    localStorage.setItem('auth_token', access);
    localStorage.setItem('auth_token_type', tokenType);

    setToken(access);
    window.location.href = '/usuarios';
  }

  function logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_token_type');
    setToken(null);
    window.location.href = '/login';
  }

  const value = useMemo(
    () => ({
      token,
      login,
      logout,
      isAuthenticated: !!token,
    }),
    [token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
