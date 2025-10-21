import { api } from './api';
import type { Contato } from '../types';

export async function listarContatosAtivos() {
  const { data } = await api.get<Contato[]>('/contatos/ativos/');
  return data;
}
export async function listarContatosInativos() {
  // Corrigido o typo do PDF: "inativos" (não "inaltivos")
  const { data } = await api.get<Contato[]>('/contatos/inativos/');
  return data;
}
export async function criarContato(payload: Partial<Contato>) {
  const { data } = await api.post<Contato>('/contato/', payload);
  return data;
}
export async function alternarStatusContato(id: number) {
  const { data } = await api.put(`/contato/${id}/status/`);
  return data;
}
