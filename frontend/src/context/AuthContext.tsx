import React, { createContext, useContext, useEffect, useState } from "react";
import type { User, UserLoginPayload, UserRegisterPayload } from "../domain/auth";
import { authApi } from "../api/auth";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (payload: UserLoginPayload) => Promise<void>;
  register: (payload: UserRegisterPayload) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("access_token"));
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadUser() {
      const storedToken = localStorage.getItem("access_token");
      if (!storedToken) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const currentUser = await authApi.getMe();
        setUser(currentUser);
        setToken(storedToken);
      } catch {
        localStorage.removeItem("access_token");
        setUser(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    }

    void loadUser();
  }, []);

  async function login(payload: UserLoginPayload) {
    const res = await authApi.login(payload);
    localStorage.setItem("access_token", res.access_token);
    setToken(res.access_token);
    setUser(res.user);
  }

  async function register(payload: UserRegisterPayload) {
    const res = await authApi.register(payload);
    localStorage.setItem("access_token", res.access_token);
    setToken(res.access_token);
    setUser(res.user);
  }

  function logout() {
    localStorage.removeItem("access_token");
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
