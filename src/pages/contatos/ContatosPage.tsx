import { useState, useEffect, useRef } from 'react';
import { useContatos } from './useContatos';
import { useAlert } from '../../context/AlertContext';

export default function ContatosPage() {
  // hook da página
  const { ativos, inativos, loading, err, create, toggle, setErr } = useContatos();

  // alerts globais
  const { success, danger } = useAlert();

  // dedupe de erro (evita duplicar em StrictMode e repetições do mesmo texto)
  const lastErrRef = useRef<string | null>(null);
  useEffect(() => {
    if (err && lastErrRef.current !== err) {
      danger(err);
      lastErrRef.current = err;
    }
  }, [err, danger]);

  // estado do formulário
  const [nome, setNome] = useState('');
  const [valor, setValor] = useState('');
  const [tipoId, setTipoId] = useState<string>('');       // string
  const [usuarioId, setUsuarioId] = useState<string>(''); // string

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    const ok = await create({
      nome: nome.trim(),
      valor: valor.trim(),
      idtipo: Number(tipoId),
      idusuario: Number(usuarioId),
    });
    if (ok) {
      setNome(''); setValor(''); setTipoId(''); setUsuarioId('');
      success('Contato criado com sucesso.', { title: 'Tudo certo!', autoDismiss: 3000 });
    }
  }

  return (
    <>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h1 className="h4 mb-0">Contatos</h1>
      </div>

      {loading && <div className="alert alert-info">Carregando…</div>}
      {/* removido o erro inline: o erro agora aparece apenas no alerta global */}

      {/* Novo contato */}
      <div className="card mb-4">
        <div className="card-header">Novo contato</div>
        <div className="card-body">
          <form className="row g-3" onSubmit={onCreate}>
            <div className="col-md-6">
              <label className="form-label">Nome</label>
              <input
                className="form-control"
                placeholder="Ex.: WhatsApp"
                value={nome}
                onChange={(e) => { setErr(null); setNome(e.target.value); }}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Valor</label>
              <input
                className="form-control"
                placeholder="Ex.: +55 11 90000-0000"
                value={valor}
                onChange={(e) => { setErr(null); setValor(e.target.value); }}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Tipo (ID)</label>
              <input
                className="form-control"
                placeholder="Informe o ID de um tipo existente."
                value={tipoId}
                onChange={(e) => { setErr(null); setTipoId(e.target.value); }}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Usuário (ID)</label>
              <input
                className="form-control"
                placeholder="Informe o ID de um usuário existente."
                value={usuarioId}
                onChange={(e) => { setErr(null); setUsuarioId(e.target.value); }}
              />
            </div>
            <div className="col-12 d-flex justify-content-end">
              <button className="btn btn-primary">
                <i className="bi bi-person-plus me-2" />
                Criar
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Listas */}
      <div className="row g-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <span>Ativos</span>
              <span className="badge text-bg-success">{ativos.length}</span>
            </div>
            <ul className="list-group list-group-flush">
              {!ativos.length && <li className="list-group-item text-muted">Nenhum ativo.</li>}
              {ativos.map((c) => (
                <li key={c.id} className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <div className="fw-medium">{c.nome} <small className="text-muted"># {c.id}</small></div>
                    <small className="text-muted">Valor: {c.valor}</small>
                  </div>
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={async () => { await toggle(c.id); success('Status atualizado.', { autoDismiss: 2500 }); }}
                  >
                    Desativar
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <span>Inativos</span>
              <span className="badge text-bg-secondary">{inativos.length}</span>
            </div>
            <ul className="list-group list-group-flush">
              {!inativos.length && <li className="list-group-item text-muted">Nenhum inativo.</li>}
              {inativos.map((c) => (
                <li key={c.id} className="list-group-item d-flex justify-content-between align-items-center">
                  <div className="fw-medium">{c.nome} <small className="text-muted"># {c.id}</small></div>
                  <button
                    className="btn btn-outline-success btn-sm"
                    onClick={async () => { await toggle(c.id); success('Status atualizado.', { autoDismiss: 2500 }); }}
                  >
                    Ativar
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
