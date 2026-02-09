"use client";

import React from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { CompareProvider } from "@/contexts/CompareContext";
import GoogleMapsProvider from "./GoogleMapsProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <GoogleMapsProvider>
      <AuthProvider>
        <CompareProvider>{children}</CompareProvider>
      </AuthProvider>
    </GoogleMapsProvider>
  );
}
