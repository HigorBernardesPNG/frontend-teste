import { useEffect, useState } from 'react';
import { isAxiosError } from 'axios';
import { listarContatosAtivos, listarContatosInativos, alternarStatusContato, criarContato } from '../../api/contatos';
import type { Contato } from '../../types';

export default function ContatosPage() {
  const [ativos, setAtivos] = useState<Contato[]>([]);
  const [inativos, setInativos] = useState<Contato[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [nome, setNome] = useState('');
  const [tipoId, setTipoId] = useState<number | ''>('');

  async function carregar() {
    setLoading(true);
    setErr(null);
    try {
      const [a, i] = await Promise.all([listarContatosAtivos(), listarContatosInativos()]);
      setAtivos(a);
      setInativos(i);
    } catch (e: unknown) {
      const msg = isAxiosError(e) ? (e.response?.data as any)?.detail ?? e.message : 'Falha ao carregar contatos.';
      setErr(msg);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void carregar();
  }, []);

  async function toggle(id: number) {
    try {
      await alternarStatusContato(id);
      await carregar();
    } catch (e: unknown) {
      const msg = isAxiosError(e) ? (e.response?.data as any)?.detail ?? e.message : 'Falha ao alternar status.';
      setErr(msg);
    }
  }

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!nome.trim() || !tipoId) return;
    try {
      await criarContato({ nome, tipo_id: Number(tipoId) });
      setNome('');
      setTipoId('');
      await carregar();
    } catch (e: unknown) {
      const msg = isAxiosError(e) ? (e.response?.data as any)?.detail ?? e.message : 'Falha ao criar contato.';
      setErr(msg);
    }
  }

  return (
    <>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h1 className="h4 mb-0">Contatos</h1>
      </div>

      {err && <div className="alert alert-danger">{err}</div>}
      {loading && <div className="alert alert-info">Carregando...</div>}

      <div className="card mb-4">
        <div className="card-body">
          <form className="row g-3" onSubmit={onCreate}>
            <div className="col-md-5">
              <label className="form-label">Nome</label>
              <input className="form-control" value={nome} onChange={(e) => setNome(e.target.value)} />
            </div>
            <div className="col-md-5">
              <label className="form-label">Tipo (ID)</label>
              <input className="form-control" value={tipoId} onChange={(e) => setTipoId(e.target.value as any)} />
              <small className="text-muted">Informe o ID de um tipo existente.</small>
            </div>
            <div className="col-md-2 d-flex align-items-end">
              <button className="btn btn-primary w-100">
                <i className="bi bi-person-plus me-2" />
                Criar
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">Ativos</div>
            <ul className="list-group list-group-flush">
              {ativos.map((c) => (
                <li key={c.id} className="list-group-item d-flex justify-content-between align-items-center">
                  <div className="fw-medium">{c.nome}</div>
                  <button className="btn btn-outline-danger btn-sm" onClick={() => toggle(c.id)}>
                    Desativar
                  </button>
                </li>
              ))}
              {!ativos.length && <li className="list-group-item text-muted">Nenhum ativo.</li>}
            </ul>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card">
            <div className="card-header">Inativos</div>
            <ul className="list-group list-group-flush">
              {inativos.map((c) => (
                <li key={c.id} className="list-group-item d-flex justify-content-between align-items-center">
                  <div className="fw-medium">{c.nome}</div>
                  <button className="btn btn-outline-success btn-sm" onClick={() => toggle(c.id)}>
                    Ativar
                  </button>
                </li>
              ))}
              {!inativos.length && <li className="list-group-item text-muted">Nenhum inativo.</li>}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
