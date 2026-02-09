"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

interface User {
  id: string;
  phoneNumber: string;
  countryCode: string;
  name?: string;
  email?: string;
  profileImage?: string;
  [key: string]: unknown;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  checkAuth: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Check auth on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("auth_token");
      const storedUser = localStorage.getItem("auth_user");

      if (storedToken && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setToken(storedToken);
          setUser(parsedUser);
          setIsAuthenticated(true);
        } catch (error) {
          // Invalid stored data, clear it
          localStorage.removeItem("auth_token");
          localStorage.removeItem("auth_user");
        }
      }
    }
  }, []);

  const login = useCallback((newToken: string, newUser: User) => {
    if (!newToken || newToken.trim() === "") {
      console.error("Invalid token provided to login function");
      return;
    }

    try {
      localStorage.setItem("auth_token", newToken);
      localStorage.setItem("auth_user", JSON.stringify(newUser));

      // Verify token was stored 
      const storedToken = localStorage.getItem("auth_token");
      if (storedToken !== newToken) {
        console.error("Token storage verification failed");
        return;
      }

      setToken(newToken);
      setUser(newUser);
      setIsAuthenticated(true);

      if (typeof window !== "undefined") {
        setTimeout(() => {
          window.dispatchEvent(new Event("auth-changed"));
        }, 0);
      }
    } catch (error) {
      console.error("Error storing auth token:", error);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);

    // Dispatch custom event for other components
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("auth-changed"));
    }
  }, []);

  const checkAuth = useCallback(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("auth_token");
      return !!storedToken;
    }
    return false;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        token,
        login,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}
