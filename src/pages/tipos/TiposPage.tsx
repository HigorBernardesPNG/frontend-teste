import { useEffect, useState } from 'react';
import { isAxiosError } from 'axios';
import { listarTiposAtivos, listarTiposInativos, alternarStatusTipo, criarTipo } from '../../api/tipos';
import type { Tipo } from '../../types';

export default function TiposPage() {
  const [ativos, setAtivos] = useState<Tipo[]>([]);
  const [inativos, setInativos] = useState<Tipo[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [nome, setNome] = useState('');

  async function carregar() {
    setLoading(true);
    setErr(null);
    try {
      const [a, i] = await Promise.all([listarTiposAtivos(), listarTiposInativos()]);
      setAtivos(a);
      setInativos(i);
    } catch (e: unknown) {
      const msg = isAxiosError(e) ? (e.response?.data as any)?.detail ?? e.message : 'Falha ao carregar tipos.';
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
      await alternarStatusTipo(id);
      await carregar();
    } catch (e: unknown) {
      const msg = isAxiosError(e) ? (e.response?.data as any)?.detail ?? e.message : 'Falha ao alternar status.';
      setErr(msg);
    }
  }

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!nome.trim()) return;
    try {
      await criarTipo({ nome });
      setNome('');
      await carregar();
    } catch (e: unknown) {
      const msg = isAxiosError(e) ? (e.response?.data as any)?.detail ?? e.message : 'Falha ao criar tipo.';
      setErr(msg);
    }
  }

  return (
    <>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h1 className="h4 mb-0">Tipos</h1>
      </div>

      {err && <div className="alert alert-danger">{err}</div>}
      {loading && <div className="alert alert-info">Carregando...</div>}

      <div className="card mb-4">
        <div className="card-body">
          <form className="row g-3" onSubmit={onCreate}>
            <div className="col-md-8">
              <label className="form-label">Nome</label>
              <input className="form-control" value={nome} onChange={(e) => setNome(e.target.value)} />
            </div>
            <div className="col-md-4 d-flex align-items-end">
              <button className="btn btn-primary">
                <i className="bi bi-plus-lg me-2" />
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
              {ativos.map((t) => (
                <li key={t.id} className="list-group-item d-flex justify-content-between align-items-center">
                  <div className="fw-medium">{t.nome}</div>
                  <button className="btn btn-outline-danger btn-sm" onClick={() => toggle(t.id)}>
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
              {inativos.map((t) => (
                <li key={t.id} className="list-group-item d-flex justify-content-between align-items-center">
                  <div className="fw-medium">{t.nome}</div>
                  <button className="btn btn-outline-success btn-sm" onClick={() => toggle(t.id)}>
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
