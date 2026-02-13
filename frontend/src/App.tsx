import { Navigate, Route, Routes, Link } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { FirstUserPage } from './pages/FirstUserPage';
import { DashboardPage } from './pages/DashboardPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { PaymentMethodsPage } from './pages/PaymentMethodsPage';
import { TransactionsPage } from './pages/TransactionsPage';
import { MainLayout } from './components/layout/MainLayout';
import { useAuthStore } from './store/auth';

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const accessToken = useAuthStore((s) => s.accessToken);
  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/first-access" element={<FirstUserPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <MainLayout>
              <NavTabs />
              <DashboardPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/categories"
        element={
          <ProtectedRoute>
            <MainLayout>
              <NavTabs />
              <CategoriesPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/payment-methods"
        element={
          <ProtectedRoute>
            <MainLayout>
              <NavTabs />
              <PaymentMethodsPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/transactions"
        element={
          <ProtectedRoute>
            <MainLayout>
              <NavTabs />
              <TransactionsPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

function NavTabs() {
  const style: React.CSSProperties = {
    display: 'flex',
    gap: '0.75rem',
    marginBottom: '1rem',
    fontSize: '0.85rem',
  };
  const linkStyle: React.CSSProperties = {
    padding: '0.35rem 0.7rem',
    borderRadius: 999,
    border: '1px solid #e5e7eb',
    textDecoration: 'none',
    color: '#374151',
  };
  return (
    <nav style={style}>
      <Link to="/dashboard" style={linkStyle}>
        Dashboard
      </Link>
      <Link to="/transactions" style={linkStyle}>
        Lançamentos
      </Link>
      <Link to="/categories" style={linkStyle}>
        Categorias
      </Link>
      <Link to="/payment-methods" style={linkStyle}>
        Formas de pag.
      </Link>
    </nav>
  );
}

export default App;

