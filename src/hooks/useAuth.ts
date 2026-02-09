"use client";

import { useState, useEffect } from "react";

/**
 * Simple hook to check if user is authenticated
 * Checks for auth token in localStorage
 */
export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if auth token exists in localStorage
    const checkAuth = () => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("auth_token");
        setIsAuthenticated(!!token);
      }
    };

    checkAuth();

    // Listen for storage changes to update auth state
    window.addEventListener("storage", checkAuth);

    // Also listen for custom auth events
    window.addEventListener("auth-changed", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
      window.removeEventListener("auth-changed", checkAuth);
    };
  }, []);

  return { isAuthenticated };
}
