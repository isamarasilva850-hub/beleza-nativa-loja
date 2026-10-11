"use client";

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";

// A sessão (quem está logado neste aparelho) fica aqui. A senha nunca fica no navegador:
// login e cadastro são conferidos pelo servidor.
const AUTH_KEY = "belezanativa_auth";

export interface User {
  email: string;
  name: string;
  phone: string;
  type?: 'revendedor' | 'consumidor'; // Tipo de usuário
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

export interface ResultadoConta {
  ok: boolean;
  erro?: string;
  jaExiste?: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<ResultadoConta>;
  logout: () => void;
  register: (data: StoredUser) => Promise<ResultadoConta>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function getAuth(): User | null {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) return null;

    const user = JSON.parse(raw);

    // Auto-migrate old users without 'type' field
    if (!user.type) {
      // If they have company/cnpj info or just assume they're revendedoras
      // (since the site is for resellers)
      user.type = 'revendedor';
      localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    }

    return user;
  } catch {
    return null;
  }
}

function guardarSessao(user: User) {
  try {
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  } catch {
    // Sem armazenamento local, a sessão dura só enquanto a página estiver aberta
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setUser(getAuth());
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<ResultadoConta> => {
    try {
      const resposta = await fetch("/api/conta/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const dados = await resposta.json();
      if (!resposta.ok) return { ok: false, erro: dados.error || "E-mail ou senha incorretos." };

      guardarSessao(dados);
      setUser(dados);
      return { ok: true };
    } catch {
      return { ok: false, erro: "Sem conexão. Tente de novo em instantes." };
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_KEY);
    setUser(null);
  }, []);

  const register = useCallback(async (data: StoredUser): Promise<ResultadoConta> => {
    try {
      const resposta = await fetch("/api/conta/cadastro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const dados = await resposta.json();
      if (!resposta.ok) {
        return { ok: false, erro: dados.error || "Não foi possível criar a conta.", jaExiste: resposta.status === 409 };
      }

      guardarSessao(dados);
      setUser(dados);
      return { ok: true };
    } catch {
      return { ok: false, erro: "Sem conexão. Tente de novo em instantes." };
    }
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
