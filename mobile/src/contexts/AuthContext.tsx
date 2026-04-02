// ══════════════════════════════════════════════════════════
// AUTH CONTEXT - AUTENTICAÇÃO
// ══════════════════════════════════════════════════════════

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { storageService } from '../services/storage';
import { api } from '../services/api';

const AUTH_KEY = '@agrovendas:auth';

export interface AuthUsuario {
  id: string;
  nome: string;
  email: string;
  nivel: 'admin' | 'supervisor' | 'vendedor';
  cargo?: string;
}

interface AuthContextData {
  usuario: AuthUsuario | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [usuario, setUsuario] = useState<AuthUsuario | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    carregarSessao();
  }, []);

  async function carregarSessao() {
    try {
      const sessao = await storageService.getItem<{ usuario: AuthUsuario; token: string }>(AUTH_KEY);
      if (sessao?.token) {
        // Valida o token no servidor antes de aceitar a sessão
        const data = await api.get<{ dados: AuthUsuario }>('/auth/me');
        setUsuario(data.dados);
        setToken(sessao.token);
      }
    } catch {
      // Token inválido ou expirado — limpa a sessão
      await storageService.removeItem(AUTH_KEY);
    } finally {
      setIsLoading(false);
    }
  }

  async function login(email: string, senha: string) {
    if (!email || !senha) throw new Error('Preencha todos os campos');

    const data = await api.post<{ token: string; usuario: AuthUsuario }>(
      '/auth/login',
      { email, senha },
      false
    );

    await storageService.setItem(AUTH_KEY, { usuario: data.usuario, token: data.token });
    setUsuario(data.usuario);
    setToken(data.token);
  }

  async function logout() {
    await storageService.removeItem(AUTH_KEY);
    setUsuario(null);
    setToken(null);
  }

  return (
    <AuthContext.Provider
      value={{
        usuario,
        token,
        isAuthenticated: !!token,
        isLoading,
        login,
        logout,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  return useContext(AuthContext);
}
