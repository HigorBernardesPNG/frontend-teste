import { useState, useEffect } from 'react';
import { useUsuarios } from './useUsuarios';
import { useAlert } from '../../context/AlertContext';

export default function UsuariosPage() {
  const { ativos, inativos, loading, err, create, toggle, setErr } = useUsuarios();
  const { success, danger, info } = useAlert();

  // Exibe erros da página via alerta global
  useEffect(() => { if (err) { danger(err); } }, [err, danger]);

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    const ok = await create({ nome: nome.trim(), email: email.trim(), senha: senha.trim() });
    if (ok) { setNome(''); setEmail(''); setSenha('');  success('Usuário criado com sucesso.', { title: 'Tudo certo!', autoDismiss: 3000 }); }
  }

  return (
    <>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h4 className="mb-0">Usuários</h4>
      </div>

      <div className="card">
        <div className="card-body">
          <form onSubmit={onCreate} className="row g-3">
            <div className="col-md-4">
              <label htmlFor="nome" className="form-label">Nome</label>
              <input id="nome" className="form-control" value={nome} onChange={(e) => setNome(e.target.value)} />
            </div>
            <div className="col-md-4">
              <label htmlFor="email" className="form-label">E-mail</label>
              <input id="email" type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="col-md-4">
              <label htmlFor="senha" className="form-label">Senha</label>
              <input id="senha" type="password" className="form-control" value={senha} onChange={(e) => setSenha(e.target.value)} />
            </div>
            <div className="col-12 d-flex justify-content-end">
              <button className="btn btn-primary" type="submit" disabled={loading}>
                <i className="bi bi-person-plus me-2" />
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
              {ativos.map((u) => (
                <li key={u.id} className="list-group-item d-flex justify-content-between align-items-center">
                  <div className="fw-medium">{u.nome} <small className="text-muted"># {u.id}</small></div>
                  <small className="text-muted">E-mail: {u.email}</small>
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={async () => { await toggle(u.id); success('Status atualizado.', { autoDismiss: 2500 }); }}
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
              {inativos.map((u) => (
                <li key={u.id} className="list-group-item d-flex justify-content-between align-items-center">
                  <div className="fw-medium">{u.nome} <small className="text-muted"># {u.id}</small></div>
                  <button
                    className="btn btn-outline-success btn-sm"
                    onClick={async () => { await toggle(u.id); success('Status atualizado.', { autoDismiss: 2500 }); }}
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
