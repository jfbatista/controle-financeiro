import { Navigate, Route, Routes } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { FirstUserPage } from './pages/FirstUserPage';
import { DashboardPage } from './pages/DashboardPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { PaymentMethodsPage } from './pages/PaymentMethodsPage';
import { TransactionsPage } from './pages/TransactionsPage';
import { RecurringBillsPage } from './pages/RecurringBillsPage';
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
              <TransactionsPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/recurring-bills"
        element={
          <ProtectedRoute>
            <MainLayout>
              <RecurringBillsPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;

