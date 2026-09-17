"use client";

import React, { useContext, useState, useEffect, createContext, useMemo, useCallback } from "react";
import type { AuthContextType, User } from "../../user/types/auth";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");
      if (storedUser) setUser(JSON.parse(storedUser));
      if (storedToken) setToken(storedToken);
    } catch {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await fetch("/api/v1/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const res = await response.json();

      if (!response.ok) {
        return { success: false, error: res?.message || res?.Message || "Invalid credentials" };
      }

      localStorage.setItem("token", res.token);
      setToken(res.token);
      localStorage.setItem("user", JSON.stringify(res.user));
      setUser(res.user);
      return { success: true };
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Network error";
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  }, []);

  const signup = useCallback(async (email: string, password: string, username: string, name?: string) => {
    setLoading(true);
    try {
      const response = await fetch("/api/v1/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, username, name: name || username }),
      });

      const res = await response.json();

      if (!response.ok) {
        return { success: false, error: res?.message || res?.Message || "Signup failed" };
      }

      localStorage.setItem("user", JSON.stringify(res.user));
      setUser(res.user);
      localStorage.setItem("token", res.token);
      setToken(res.token);
      return { success: true };
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Network error";
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
  }, []);

  const value: AuthContextType = useMemo(
    () => ({ user, login, logout, loading, token, signup }),
    [user, login, logout, loading, token, signup]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}