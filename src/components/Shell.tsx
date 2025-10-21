import { Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';

export default function Shell() {
  const { logout } = useAuth();

  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      <aside className="bg-light border-end" style={{ width: 260 }}>
        <div className="p-3 border-bottom d-flex align-items-center gap-2">
          <i className="bi bi-ui-checks-grid fs-4 text-primary" />
          <span className="fw-bold">XM3K Painel</span>
        </div>
        <nav className="nav flex-column p-2">
          <NavLink className="nav-link" to="/usuarios"><i className="bi bi-people me-2" />Usuários</NavLink>
          <NavLink className="nav-link" to="/tipos"><i className="bi bi-tags me-2" />Tipos</NavLink>
          <NavLink className="nav-link" to="/contatos"><i className="bi bi-person-lines-fill me-2" />Contatos</NavLink>
          <NavLink className="nav-link" to="/relatorios"><i className="bi bi-graph-up me-2" />Relatórios</NavLink>
        </nav>
      </aside>

      <main className="flex-grow-1">
        <header className="border-bottom bg-white">
          <div className="container d-flex justify-content-between align-items-center py-2">
            <div className="d-flex align-items-center gap-2">
              <i className="bi bi-shield-lock text-secondary" />
              <small className="text-muted">Área autenticada</small>
            </div>
            <button className="btn btn-outline-secondary btn-sm" onClick={logout}>
              <i className="bi bi-box-arrow-right me-1" />
              Sair
            </button>
          </div>
        </header>

        <div className="container py-4">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
