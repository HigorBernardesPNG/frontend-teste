import { isAxiosError } from 'axios';

type ApiErrorShape = {
  detail?: string | { msg?: string }[];
  message?: string;
  error?: string;
};

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

export function getHttpErrorMessage(e: unknown): string {
  if (isAxiosError(e)) {
    const data = e.response?.data;

    // Caso FastAPI retorne um array
    if (Array.isArray(data)) {
      const msgs = data
        .map((it) => (typeof it?.msg === 'string' ? it.msg : null))
        .filter(Boolean) as string[];
      if (msgs.length) return msgs.join(' • ');
    }

    if (isRecord(data)) {
      const d = data as ApiErrorShape;

      // detail pode ser string / array de objetos com msg
      if (Array.isArray(d.detail)) {
        const msgs = d.detail
          .map((it) => (typeof it?.msg === 'string' ? it.msg : null))
          .filter(Boolean) as string[];
        if (msgs.length) return msgs.join(' • ');
      }

      return d.detail as string ?? d.message ?? d.error ?? e.message;
    }
    return e.message;
  }
  if (e instanceof Error) return e.message;
  return 'Algo deu errado.';
}
