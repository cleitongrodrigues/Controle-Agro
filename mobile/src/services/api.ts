// ══════════════════════════════════════════════════════════
// API SERVICE - CLIENTE HTTP
// ══════════════════════════════════════════════════════════

import { storageService } from './storage';

const AUTH_KEY = '@agrovendas:auth';

// Troque pelo IP da sua máquina na rede local durante testes,
// ou pela URL do servidor em produção.
export const API_BASE_URL = 'http://192.168.100.180:3000';

async function getToken(): Promise<string | null> {
  const sessao = await storageService.getItem<{ token: string }>(AUTH_KEY);
  return sessao?.token ?? null;
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  autenticado = true
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (autenticado) {
    const token = await getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.mensagem ?? `Erro ${response.status}`);
  }

  return data;
}

export const api = {
  get: <T>(path: string) =>
    request<T>(path, { method: 'GET' }),

  post: <T>(path: string, body: unknown, autenticado = true) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body) }, autenticado),

  put: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'PUT', body: JSON.stringify(body) }),

  delete: <T>(path: string) =>
    request<T>(path, { method: 'DELETE' }),
};
