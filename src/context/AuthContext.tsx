"use client";

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";

const USERS_KEY = "belezanativa_users";
const AUTH_KEY = "belezanativa_auth";

export interface User {
  email: string;
  name: string;
  phone: string;
  company?: string;
  cnpj?: string;
  city?: string;
  state?: string;
  address?: string;
  cep?: string;
}

export interface StoredUser extends User {
  password: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  register: (data: StoredUser) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function getUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function getAuth(): User | null {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setUser(getAuth());
  }, []);

  const login = useCallback((email: string, password: string): boolean => {
    const users = getUsers();
    const found = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!found) return false;
    const { password: _, createdAt: __, ...userData } = found;
    localStorage.setItem(AUTH_KEY, JSON.stringify(userData));
    setUser(userData);
    return true;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_KEY);
    setUser(null);
  }, []);

  const register = useCallback((data: StoredUser): boolean => {
    const users = getUsers();
    if (users.some((u) => u.email.toLowerCase() === data.email.toLowerCase())) {
      return false;
    }
    users.push(data);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    const { password: _, createdAt: __, ...userData } = data;
    localStorage.setItem(AUTH_KEY, JSON.stringify(userData));
    setUser(userData);
    return true;
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
