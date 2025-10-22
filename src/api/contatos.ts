import { api } from './api';
import type { Contato } from '../types';

async function getWithFallback<T>(primary: string, fallback?: string) {
  try {
    const { data } = await api.get<T>(primary);
    return data;
  } catch (err: any) {
    // Se não houver rota alternativa, ou se não for 404, apenas relança
    if (!fallback || err?.response?.status !== 404) throw err;
    const { data } = await api.get<T>(fallback);
    return data;
  }
}

export async function listarContatosAtivos() {
  // rota correta
  return getWithFallback<Contato[]>('/contatos/ativos/');
}

export async function listarContatosInativos() {
  // rota correta + fallback com o typo da doc ("inaltivos")
  return getWithFallback<Contato[]>(
    '/contatos/inativos/',
    '/contatos/inaltivos/'
  );
}

export async function criarContato(payload: {
  idtipo: number;
  idusuario: number;
  nome: string;
  valor: string;
}) {
  // POST /contato/ — o body precisa ter exatamente esses campos
  const { data } = await api.post<Contato>('/contato/', payload);
  return data;
}

export async function alternarStatusContato(id: number) {
  // PUT /contato/{id}/status/
  const { data } = await api.put(`/contato/${id}/status/`);
  return data;
}
