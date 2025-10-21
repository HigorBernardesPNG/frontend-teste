import { api } from './api';

type LoginPayload = { username: string; password: string };
type LoginResponse = { access: string; refresh?: string };

export async function login(payload: LoginPayload) {
  const form = new URLSearchParams();
  form.append('username', payload.username);
  form.append('password', payload.password);

  const candidates = [
    '/token/', '/token',
    '/auth/token/', '/auth/token',
    '/api/token/', '/api/token',
  ];

  let lastError: unknown;

  for (const path of candidates) {
    try {
      const { data } = await api.post<LoginResponse>(path, form, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
      return data;
    } catch (err: any) {
      // se não for 404, propaga já (401/422/etc)
      if (err?.response?.status !== 404) throw err;
      lastError = err;
    }
  }

  throw lastError ?? new Error('Nenhuma rota de token encontrada (404).');
}
