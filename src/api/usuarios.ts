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

export async function criarUsuario(payload: { nome: string; email: string; senha: string }) {
  try {
    const { data } = await api.post<Usuario>('/usuario/', payload);
    return data;
  } catch (err: any) {
    if (err?.response?.status !== 422) throw err;
    const form = new URLSearchParams();
    form.append('nome', payload.nome);
    form.append('email', payload.email);
    form.append('senha', payload.senha);
    const { data } = await api.post<Usuario>('/usuario/', form, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    return data;
  }
}

export async function alternarStatusUsuario(id: number) {
  const { data } = await api.put(`/usuario/${id}/status/`);
  return data;
}
