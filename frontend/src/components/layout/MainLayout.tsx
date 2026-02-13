import type { ReactNode } from 'react';
import { useAuthStore } from '../../store/auth';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { user, logout } = useAuthStore();

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#f3f4f6',
      }}
    >
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '0.75rem 1rem',
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e5e7eb',
        }}
      >
        <h1 style={{ fontSize: '0.95rem', fontWeight: 600 }}>
          Controle Financeiro
        </h1>
        <div style={{ flex: 1 }} />
        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: '#4b5563' }}>
              {user.name}
            </span>
            <button
              type="button"
              onClick={logout}
              style={{
                border: 'none',
                background: 'transparent',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: '#6b21a8',
                cursor: 'pointer',
              }}
            >
              Sair
            </button>
          </div>
        )}
      </header>

      <main
        style={{
          flex: 1,
          padding: '1rem',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <div style={{ width: '100%', maxWidth: '1200px' }}>{children}</div>
      </main>
    </div>
  );
}

