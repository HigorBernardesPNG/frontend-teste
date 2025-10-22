import { useState, useEffect } from 'react';
import { useTipos } from './UseTipos';
import { useAlert } from '../../context/AlertContext';

export default function TiposPage() {
  const { ativos, inativos, loading, err, create, toggle, setErr } = useTipos();
  const { success, danger, info } = useAlert();

  // Exibe erros da página via alerta global
  useEffect(() => { if (err) { danger(err); } }, [err, danger]);

  const [nome, setNome] = useState('');

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    const ok = await create({ nome: nome.trim() });
    if (ok) { setNome(''); success('Tipo criado com sucesso.', { title: 'Tudo certo!', autoDismiss: 3000 }); }
  }

  return (
    <>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h4 className="mb-0">Tipos</h4>
      </div>

      <div className="card">
        <div className="card-body">
          <form onSubmit={onCreate} className="row g-3">
            <div className="col-md-8">
              <label htmlFor="nome" className="form-label">Nome do tipo</label>
              <input id="nome" className="form-control" value={nome} onChange={(e) => setNome(e.target.value)} />
            </div>
            <div className="col-md-4 d-flex align-items-end justify-content-end">
              <button className="btn btn-primary" type="submit" disabled={loading}>
                <i className="bi bi-tags me-2" />
                Criar
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="row g-4 mt-2">
        <div className="col-lg-6">
          <div className="card h-100">
            <div className="card-header d-flex align-items-center justify-content-between">
              <span className="fw-semibold">Ativos</span>
              {loading && <span className="text-muted small">Carregando…</span>}
            </div>
            <ul className="list-group list-group-flush">
              {ativos.map((t) => (
                <li key={t.id} className="list-group-item d-flex justify-content-between align-items-center">
                  <div className="fw-medium">{t.nome} <small className="text-muted"># {t.id}</small></div>
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={async () => { await toggle(t.id); success('Status atualizado.', { autoDismiss: 2500 }); }}
                  >
                    Desativar
                  </button>
                </li>
              ))}
              {!ativos.length && <li className="list-group-item text-muted">Nenhum ativo.</li>}
            </ul>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card h-100">
            <div className="card-header d-flex align-items-center justify-content-between">
              <span className="fw-semibold">Inativos</span>
              {loading && <span className="text-muted small">Carregando…</span>}
            </div>
            <ul className="list-group list-group-flush">
              {inativos.map((t) => (
                <li key={t.id} className="list-group-item d-flex justify-content-between align-items-center">
                  <div className="fw-medium">{t.nome} <small className="text-muted"># {t.id}</small></div>
                  <button
                    className="btn btn-outline-success btn-sm"
                    onClick={async () => { await toggle(t.id); success('Status atualizado.', { autoDismiss: 2500 }); }}
                  >
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
