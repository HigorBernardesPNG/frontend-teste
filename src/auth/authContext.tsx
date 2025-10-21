import { createContext, useState, useMemo, ReactNode } from 'react';
import { login as doLogin } from '../api/auth';

export type AuthContextType = {
  token: string | null;
  login: (u: string, p: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(localStorage.getItem('auth_token'));

  async function login(username: string, password: string) {
    const data = await doLogin({ username, password });
    localStorage.setItem('auth_token', data.access);
    setToken(data.access);
    window.location.href = '/usuarios';
  }

  function logout() {
    localStorage.removeItem('auth_token');
    setToken(null);
    window.location.href = '/login';
  }

  const value = useMemo(() => ({
    token,
    login,
    logout,
    isAuthenticated: !!token
  }), [token]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export { AuthContext };
