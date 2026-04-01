// ══════════════════════════════════════════════════════════
// AUTH CONTEXT - AUTENTICAÇÃO
// ══════════════════════════════════════════════════════════

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { storageService } from '../services/storage';

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
      if (sessao) {
        setUsuario(sessao.usuario);
        setToken(sessao.token);
      }
    } catch {
      // sessão inválida, ignora
    } finally {
      setIsLoading(false);
    }
  }

  async function login(email: string, senha: string) {
    // TODO: substituir pela chamada real ao backend
    // const response = await fetch(`${API_URL}/auth/login`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ email, senha }),
    // });
    // if (!response.ok) throw new Error('Credenciais inválidas');
    // const { token, usuario } = await response.json();

    // Stub temporário até o backend de auth estar pronto
    if (!email || !senha) throw new Error('Preencha todos os campos');

    const usuarioMock: AuthUsuario = {
      id: '1',
      nome: 'Cleiton',
      email,
      nivel: 'admin',
      cargo: 'Administrador',
    };
    const tokenMock = 'token-temporario';

    await storageService.setItem(AUTH_KEY, { usuario: usuarioMock, token: tokenMock });
    setUsuario(usuarioMock);
    setToken(tokenMock);
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
