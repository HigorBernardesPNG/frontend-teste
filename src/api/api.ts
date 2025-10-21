import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL as string | undefined;

if (!baseURL) {
  // eslint-disable-next-line no-console
  console.error(
    '[API] VITE_API_URL não definida. Crie .env na raiz com VITE_API_URL=https://entrevista-front-end-xm3k.onrender.com'
  );
}

export const api = axios.create({
  baseURL: baseURL ?? '/',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  const type = localStorage.getItem('auth_token_type') ?? 'Bearer';
  if (token) config.headers.Authorization = `${/bearer/i.test(type) ? 'Bearer' : type} ${token}`;

  // eslint-disable-next-line no-console
  // console.debug
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      // 401 - token inválido/expirado: limpa e envia ao login
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_token_type');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);
