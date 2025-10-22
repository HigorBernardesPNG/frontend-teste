import { useState } from 'react';
import { useTipos } from './UseTipos';

export default function TiposPage() {
  const { ativos, inativos, loading, err, create, toggle, setErr } = useTipos();
  const [nome, setNome] = useState('');

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    const ok = await create({ nome: nome.trim() });
    if (ok) setNome('');
  }

  return (
    <>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h1 className="h4 mb-0">Tipos</h1>
      </div>

      {loading && <div className="alert alert-info">Carregando…</div>}
      {err && <div className="alert alert-danger">{err}</div>}

      <div className="card mb-4">
        <div className="card-body">
          <form className="row g-3" onSubmit={onCreate}>
            <div className="col-md-8">
              <label className="form-label">Nome</label>
              <input
                className="form-control"
                value={nome}
                onChange={(e) => {
                  setErr(null);
                  setNome(e.target.value);
                }}
              />
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
                  <div className="fw-medium">{t.nome} <small className="text-muted"># {t.id}</small></div>
                  <button className="btn btn-outline-danger btn-sm" onClick={() => void toggle(t.id)}>
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
                  <div className="fw-medium">{t.nome} <small className="text-muted"># {t.id}</small></div>
                  <button className="btn btn-outline-success btn-sm" onClick={() => void toggle(t.id)}>
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
