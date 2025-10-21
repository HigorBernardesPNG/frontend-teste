import { api } from './api';
import type { Tipo } from '../types';

export async function listarTiposAtivos() {
  const { data } = await api.get<Tipo[]>('/tipos/ativos/');
  return data;
}
export async function listarTiposInativos() {
  const { data } = await api.get<Tipo[]>('/tipos/inativos/');
  return data;
}
export async function criarTipo(payload: Partial<Tipo>) {
  const { data } = await api.post<Tipo>('/tipo/', payload);
  return data;
}
export async function alternarStatusTipo(id: number) {
  const { data } = await api.put(`/tipo/${id}/status/`);
  return data;
}
