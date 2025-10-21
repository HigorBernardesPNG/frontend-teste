import { useState } from 'react';
import type { FormEvent } from 'react';
import { isAxiosError } from 'axios';
import { useAuth } from '../auth/useAuth';

export default function LoginPage() {
  const { login } = useAuth();
  const [username, setU] = useState('ia@email.com');
  const [password, setP] = useState('eldIa2025');
  const [loading, setLoading] = useState(false);
  const [error, setErr] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    try {
      await login(username, password);
    } catch (e: unknown) {
      const msg = isAxiosError(e)
        ? (e.response?.data as any)?.detail ?? e.message
        : 'Falha ao autenticar.';
      setErr(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-sm-8 col-md-6 col-lg-4">
          <div className="text-center mb-3">
            <i className="bi bi-ui-checks-grid fs-1 text-primary" />
            <h1 className="h4 mt-2">Acessar painel</h1>
            <p className="text-muted small mb-0">Use as credenciais fornecidas no teste.</p>
          </div>

          <div className="card shadow-sm">
            <div className="card-body">
              {error && <div className="alert alert-danger">{error}</div>}

              <form onSubmit={onSubmit} className="vstack gap-3">
                <div>
                  <label className="form-label">Usuário</label>
                  <input
                    className="form-control"
                    value={username}
                    onChange={(e) => setU(e.target.value)}
                    autoFocus
                  />
                </div>

                <div>
                  <label className="form-label">Senha</label>
                  <input
                    type="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setP(e.target.value)}
                  />
                </div>

                <button className="btn btn-primary w-100" disabled={loading}>
                  {loading ? 'Entrando…' : 'Entrar'}
                </button>
              </form>
            </div>
          </div>

          <p className="text-muted small mt-3 text-center">
            O token é salvo com segurança no <code>localStorage</code>.
          </p>
        </div>
      </div>
    </div>
  );
}
