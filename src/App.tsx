import AppRouter from './router/AppRouter';
import { AuthProvider } from './auth/AuthContext';
import './chart/theme';

// ALERT: imports adicionados para mensageria global
import { AlertProvider } from './context/AlertContext';
import { AlertHost } from './components/AlertHost';

export default function App() {
  return (

    <AlertProvider>
      <AuthProvider>
        <AppRouter />
        <AlertHost />
      </AuthProvider>
    </AlertProvider>
  );
}
