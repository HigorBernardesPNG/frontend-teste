import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import UsuariosPage from '../pages/usuarios/UsuariosPage';
import TiposPage from '../pages/tipos/TiposPage';
import ContatosPage from '../pages/contatos/ContatosPage';
import RelatoriosPage from '../pages/relatorios/RelatoriosPage';
import ProtectedRoute from '../components/ProtectedRoute';
import Shell from '../components/Shell';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Público */}
        <Route path="/login" element={<LoginPage />} />

        {/* Área autenticada com layout */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Shell />
            </ProtectedRoute>
          }
        >
          {/* / -> redireciona para /usuarios */}
          <Route index element={<Navigate to="usuarios" replace />} />

          {/* Rotas internas (relativas) */}
          <Route path="usuarios" element={<UsuariosPage />} />
          <Route path="tipos" element={<TiposPage />} />
          <Route path="contatos" element={<ContatosPage />} />
          <Route path="relatorios" element={<RelatoriosPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
