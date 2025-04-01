"use client";

import { createContext, useContext, useEffect, useState } from "react";
import jwt from "jsonwebtoken";

interface AuthContextType {
  user: { id: string; email: string } | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        const decoded: any = jwt.decode(token);
        if (decoded) setUser({ id: decoded.userId, email: decoded.email });
      } catch (error) {
        console.error("Invalid token", error);
        localStorage.removeItem("authToken");
      }
    }
  }, []);

  const login = (token: string) => {
    localStorage.setItem("authToken", token);
    const decoded: any = jwt.decode(token);
    if (decoded) setUser({ id: decoded.userId, email: decoded.email });
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
      throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
  }
