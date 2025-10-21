import { isAxiosError } from 'axios';

type FastApiDetailItem = { loc?: (string | number)[]; msg?: string };
type ApiErrorShape = {
  detail?: string | FastApiDetailItem[];
  message?: string;
  error?: string;
};

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

function joinUnique(parts: (string | null | undefined)[]) {
  return Array.from(new Set(parts.filter(Boolean) as string[])).join(' • ');
}

export function getHttpErrorMessage(e: unknown): string {
  if (isAxiosError(e)) {
    const data = e.response?.data;

    if (Array.isArray(data)) {
      const msgs = data.map((it: any) => {
        const field = Array.isArray(it?.loc) ? String(it.loc.at(-1)) : null;
        return it?.msg && field ? `${it.msg}: "${field}"` : it?.msg ?? null;
      });
      const txt = joinUnique(msgs);
      if (txt) return txt;
    }

    if (isRecord(data)) {
      const d = data as ApiErrorShape;

      if (Array.isArray(d.detail)) {
        const msgs = d.detail.map((it) => {
          const field = Array.isArray(it?.loc) ? String(it.loc.at(-1)) : null;
          return it?.msg && field ? `${it.msg}: "${field}"` : it?.msg ?? null;
        });
        const txt = joinUnique(msgs);
        if (txt) return txt;
      }

      if (typeof d.detail === 'string' && d.detail.trim()) return d.detail;
      if (typeof d.message === 'string' && d.message.trim()) return d.message;
      if (typeof d.error === 'string' && d.error.trim()) return d.error;
    }

    return e.message;
  }

  if (e instanceof Error) return e.message;
  return 'Algo deu errado.';
}
