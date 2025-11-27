"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from "react";

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  handleSocialLogin: (token: string, user: User) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Safe ID generator with fallback for environments where
// `crypto.randomUUID` is not available in the DOM libs.
const generateId = () => {
  try {
    // Use global crypto.randomUUID when available
    if (typeof crypto !== "undefined" && typeof (crypto as any).randomUUID === "function") {
      return (crypto as any).randomUUID();
    }
  } catch (e) {
    // ignore and fall back
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
};

// Manage a lightweight client-side cookie used by middleware to detect auth.
const setAuthCookie = (value = "1") => {
  try {
    if (typeof document !== "undefined") {
      // 7 days
      document.cookie = `auth=${value}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
    }
  } catch (e) {
    // ignore
  }
};

const clearAuthCookie = () => {
  try {
    if (typeof document !== "undefined") {
      document.cookie = `auth=; path=/; max-age=0; SameSite=Lax`;
    }
  } catch (e) {
    // ignore
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse user from localStorage:", error);
      }
    }
    setIsLoading(false);
  }, []);

  // Sync auth across tabs
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "user") {
        if (e.newValue) {
          try {
            setUser(JSON.parse(e.newValue));
          } catch {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (data.success) {
        const userData: User = {
          id: String(data.userId),
          email: data.email,
          name: data.name,
        };
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("token", data.token);
        setAuthCookie("1");
        return true;
      }
      return false;
    } catch (err) {
      console.error("Login failed:", err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signup = useCallback(async (
    name: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();
      if (data.success) {
        const userData: User = {
          id: String(data.userId),
          email: data.email,
          name: data.name,
        };
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("token", data.token);
        setAuthCookie("1");
        return true;
      }
      return false;
    } catch (err) {
      console.error("Signup failed:", err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSocialLogin = useCallback((token: string, userData: User) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
    setAuthCookie("1");
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("user");
    clearAuthCookie();
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      signup,
      logout,
      handleSocialLogin,
    }),
    [user, isLoading, login, signup, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

