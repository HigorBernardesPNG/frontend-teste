import { api } from './api';
import type { Tipo } from '../types';

// Modelo que a API realmente devolve para "tipo"
type TipoApi = { id: number; descricao: string };

// Helper de mapeamento para o modelo usado na UI
function toTipo(ui: TipoApi): Tipo {
  return { id: ui.id, nome: ui.descricao };
}

export async function listarTiposAtivos() {
  const { data } = await api.get<TipoApi[]>('/tipos/ativos/');
  return data.map(toTipo); // descricao -> nome
}

export async function listarTiposInativos() {
  const { data } = await api.get<TipoApi[]>('/tipos/inativos/');
  return data.map(toTipo); // descricao -> nome
}

export async function criarTipo(payload: { nome: string }) {
  // A API espera { descricao: string }
  const body = { descricao: payload.nome };
  const { data } = await api.post<TipoApi>('/tipo/', body);
  return toTipo(data); // normaliza para { id, nome }
}

export async function alternarStatusTipo(id: number) {
  // A tela dá reload depois, então só disparamos a ação
  const { data } = await api.put(`/tipo/${id}/status/`);
  return data;
}
