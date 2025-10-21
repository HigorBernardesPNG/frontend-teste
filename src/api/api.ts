import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL as string | undefined;

if (!baseURL) {
  // Ajuda de debug: isso aparece no console do navegador
  // e explica por que você veria 404 no localhost.
  // eslint-disable-next-line no-console
  console.error(
    '[API] VITE_API_URL não definida. Crie .env na raiz com VITE_API_URL=https://entrevista-front-end-xm3k.onrender.com'
  );
}

export const api = axios.create({
  baseURL: baseURL ?? '/', // evita undefined
});

// Intercepta request para injetar Bearer e logar rota base
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  // eslint-disable-next-line no-console
  console.debug('[API]→', (config.baseURL ?? '') + (config.url ?? ''), config.method?.toUpperCase());

  return config;
});

// Intercepta respostas 401 para deslogar
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);
