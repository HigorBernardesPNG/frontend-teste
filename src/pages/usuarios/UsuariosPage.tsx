import { useEffect, useState } from 'react';
import { isAxiosError } from 'axios';
import { listarUsuariosAtivos, listarUsuariosInativos, alternarStatusUsuario, criarUsuario } from '../../api/usuarios';
import type { Usuario } from '../../types';

export default function UsuariosPage() {
  const [ativos, setAtivos] = useState<Usuario[]>([]);
  const [inativos, setInativos] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');

  async function carregar() {
    setLoading(true); setErr(null);
    try {
      const [a, i] = await Promise.all([listarUsuariosAtivos(), listarUsuariosInativos()]);
      setAtivos(a); setInativos(i);
    } catch (e: unknown) {
      const msg = isAxiosError(e) ? (e.response?.data as any)?.detail ?? e.message : 'Falha ao carregar usuários.';
      setErr(msg);
    } finally { setLoading(false); }
  }

  useEffect(() => { void carregar(); }, []);

  async function toggle(id: number) {
    try {
      await alternarStatusUsuario(id);
      await carregar();
    } catch (e: unknown) {
      const msg = isAxiosError(e) ? (e.response?.data as any)?.detail ?? e.message : 'Falha ao alternar status.';
      setErr(msg);
    }
  }

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!nome.trim() || !email.trim()) return;
    try {
      await criarUsuario({ nome, email });
      setNome(''); setEmail('');
      await carregar();
    } catch (e: unknown) {
      const msg = isAxiosError(e) ? (e.response?.data as any)?.detail ?? e.message : 'Falha ao criar usuário.';
      setErr(msg);
    }
  }

  return (
    <>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h1 className="h4 mb-0">Usuários</h1>
      </div>

      {err && <div className="alert alert-danger">{err}</div>}
      {loading && <div className="alert alert-info">Carregando…</div>}

      <div className="card mb-4">
        <div className="card-body">
          <form className="row g-3 align-items-end" onSubmit={onCreate}>
            <div className="col-md-5">
              <label className="form-label">Nome</label>
              <input className="form-control" value={nome} onChange={(e) => setNome(e.target.value)} />
            </div>
            <div className="col-md-5">
              <label className="form-label">Email</label>
              <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="col-md-2">
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
            <div className="card-header d-flex justify-content-between">
              <span>Ativos</span>
              <span className="badge text-bg-success">{ativos.length}</span>
            </div>
            <ul className="list-group list-group-flush">
              {ativos.map((u) => (
                <li key={u.id} className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <div className="fw-medium">{u.nome}</div>
                    <small className="text-muted">{u.email}</small>
                  </div>
                  <button className="btn btn-outline-danger btn-sm" onClick={() => toggle(u.id)}>
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
                  <div className="fw-medium">{u.nome}</div>
                  <button className="btn btn-outline-success btn-sm" onClick={() => toggle(u.id)}>
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
