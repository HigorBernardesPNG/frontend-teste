import { api } from './api';
import type { Usuario } from '../types';

export async function listarUsuariosAtivos() {
  const { data } = await api.get<Usuario[]>('/usuarios/ativos/');
  return data;
}
export async function listarUsuariosInativos() {
  const { data } = await api.get<Usuario[]>('/usuarios/inativos/');
  return data;
}
export async function criarUsuario(payload: Partial<Usuario>) {
  const { data } = await api.post<Usuario>('/usuario/', payload);
  return data;
}
export async function alternarStatusUsuario(id: number) {
  const { data } = await api.put(`/usuario/${id}/status/`);
  return data;
}
