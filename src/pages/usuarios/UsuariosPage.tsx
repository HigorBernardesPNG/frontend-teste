import { useEffect, useState } from 'react';
import { listarUsuariosAtivos, listarUsuariosInativos, alternarStatusUsuario, criarUsuario } from '../../api/usuarios';
import type { Usuario } from '../../types';
import { getHttpErrorMessage } from '../../utils/http';

export default function UsuariosPage() {
  const [ativos, setAtivos] = useState<Usuario[]>([]);
  const [inativos, setInativos] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  async function carregar() {
    setLoading(true); setErr(null);
    try {
      const [a, i] = await Promise.all([listarUsuariosAtivos(), listarUsuariosInativos()]);
      setAtivos(a); setInativos(i);
    } catch (e: unknown) {
      setErr(getHttpErrorMessage(e));
    } finally { setLoading(false); }
  }

  useEffect(() => { void carregar(); }, []);

  async function toggle(id: number) {
    setErr(null);
    try {
      await alternarStatusUsuario(id);
      await carregar();
    } catch (e: unknown) {
      setErr(getHttpErrorMessage(e));
    }
  }

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    const n = nome.trim();
    const m = email.trim();
    const s = senha.trim();
    if (!n || !m || !s) { setErr('Preencha nome, email e senha.'); return; }
    setErr(null);
    try {
      await criarUsuario({ nome: n, email: m, senha: s });
      setNome(''); setEmail(''); setSenha('');
      await carregar();
    } catch (e: unknown) {
      setErr(getHttpErrorMessage(e));
    }
  }

  return (
    <>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h1 className="h4 mb-0">Usuários</h1>
      </div>

      {loading && <div className="alert alert-info">Carregando…</div>}
      {err && <div className="alert alert-danger">{err}</div>}

      <div className="card mb-4">
        <div className="card-body">
          <form className="row g-3 align-items-end" onSubmit={onCreate}>
            <div className="col-md-4">
              <label className="form-label">Nome</label>
              <input className="form-control" value={nome} onChange={(e) => setNome(e.target.value)} />
            </div>
            <div className="col-md-4">
              <label className="form-label">Email</label>
              <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="col-md-3">{/* NOVO */}
              <label className="form-label">Senha</label>
              <input type="password" className="form-control" value={senha} onChange={(e) => setSenha(e.target.value)} />
            </div>
            <div className="col-md-1 d-grid">
              <button className="btn btn-primary">
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
            <div className="card-header d-flex justify-content-between">
              <span>Ativos</span>
              <span className="badge text-bg-success">{ativos.length}</span>
            </div>
            <ul className="list-group list-group-flush">
              {ativos.map((u) => (
                <li key={u.id} className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    {/* Nome + ID visível */}
                    <div className="fw-medium">
                      {u.nome} <small className="text-muted">ID #{u.id}</small>
                    </div>
                    <small className="text-muted">{u.email}</small>
                  </div>
                  <button className="btn btn-outline-danger btn-sm" onClick={() => void toggle(u.id)}>
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
            <div className="card-header d-flex justify-content-between">
              <span>Inativos</span>
              <span className="badge text-bg-secondary">{inativos.length}</span>
            </div>
            <ul className="list-group list-group-flush">
              {inativos.map((u) => (
                <li key={u.id} className="list-group-item d-flex justify-content-between align-items-center">
                  {/* Nome + ID visível */}
                  <div className="fw-medium">
                    {u.nome} <small className="text-muted">ID #{u.id}</small>
                  </div>
                  <button className="btn btn-outline-success btn-sm" onClick={() => void toggle(u.id)}>
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
