import { useEffect, useState } from 'react';
import {
  listarContatosAtivos,
  listarContatosInativos,
  criarContato,
  alternarStatusContato,
} from '../../api/contatos';
import type { Contato } from '../../types';
import { getHttpErrorMessage } from '../../utils/http';

export default function ContatosPage() {
  // Campos do formulário
  const [nome, setNome] = useState('');
  const [valor, setValor] = useState('');
  const [tipoId, setTipoId] = useState<string>('');
  const [usuarioId, setUsuarioId] = useState<string>('');

  // Listas
  const [ativos, setAtivos] = useState<Contato[]>([]);
  const [inativos, setInativos] = useState<Contato[]>([]);

  // UI
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function carregar() {
    setLoading(true);
    setErr(null);
    try {
      // As funções já tratam 404 como lista vazia (via getWithFallback)
      const [a, i] = await Promise.all([
        listarContatosAtivos(),
        listarContatosInativos(),
      ]);
      setAtivos(a);
      setInativos(i);
    } catch (e: unknown) {
      setErr(getHttpErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void carregar();
  }, []);

  async function toggle(id: number) {
    setErr(null);
    try {
      await alternarStatusContato(id);
      await carregar();
    } catch (e: unknown) {
      setErr(getHttpErrorMessage(e));
    }
  }

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();

    const n = nome.trim();
    const v = valor.trim();
    const t = Number(tipoId);
    const u = Number(usuarioId);

    // Validações simples antes do POST
    if (!n || !v || !t || !u) {
      setErr('Preencha nome, valor, tipo (ID numérico) e usuário (ID numérico).');
      return;
    }

    setErr(null);
    try {
      await criarContato({
        idtipo: t,
        idusuario: u,
        nome: n,
        valor: v,
      });
      // limpa form
      setNome('');
      setValor('');
      setTipoId('');
      setUsuarioId('');
      // recarrega as listas
      await carregar();
    } catch (e: unknown) {
      setErr(getHttpErrorMessage(e));
    }
  }

  return (
    <>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h1 className="h4 mb-0">Contatos</h1>
      </div>

      {loading && <div className="alert alert-info">Carregando…</div>}
      {err && <div className="alert alert-danger">{err}</div>}

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
                onChange={(e) => setNome(e.target.value)}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Valor</label>
              <input
                className="form-control"
                placeholder="Ex.: +55 11 90000-0000"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Tipo (ID)</label>
              <input
                className="form-control"
                placeholder="Informe o ID de um tipo existente."
                value={tipoId}
                onChange={(e) => setTipoId(e.target.value)}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Usuário (ID)</label>
              <input
                className="form-control"
                placeholder="Informe o ID de um usuário existente."
                value={usuarioId}
                onChange={(e) => setUsuarioId(e.target.value)}
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
              {ativos.length === 0 && (
                <li className="list-group-item text-muted">Nenhum ativo.</li>
              )}
              {ativos.map((c) => (
                <li
                  key={c.id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <div>
                    {/* Mostra nome e valor do contato; se sua API retornar outros campos, ajuste aqui */}
                    <div className="fw-medium">{c.nome}</div>
                    <small className="text-muted">Valor: {c.valor}</small>
                  </div>
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => void toggle(c.id)}
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
              {inativos.length === 0 && (
                <li className="list-group-item text-muted">Nenhum inativo.</li>
              )}
              {inativos.map((c) => (
                <li
                  key={c.id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <div className="fw-medium">{c.nome}</div>
                  <button
                    className="btn btn-outline-success btn-sm"
                    onClick={() => void toggle(c.id)}
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
