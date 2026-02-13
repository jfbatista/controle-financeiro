import type { FormEvent } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login, loading, clearError } = useAuthStore();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    clearError();
    await login(email, password);
    const currentError = useAuthStore.getState().error;
    if (currentError) {
      alert(`Erro ao fazer login: ${currentError}`);
      return;
    }
    navigate('/dashboard');
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        backgroundColor: '#f3f4f6',
      }}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          padding: '2rem',
          borderRadius: '0.75rem',
          boxShadow: '0 10px 25px rgba(15,23,42,0.1)',
          width: '100%',
          maxWidth: '420px',
        }}
      >
        <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1.5rem' }}>
          Entrar no Controle Financeiro
        </h2>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <label style={{ fontSize: '0.85rem' }}>
              E-mail
              <input
                required
                type="email"
                style={{ width: '100%', marginTop: 4, padding: '0.5rem' }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <label style={{ fontSize: '0.85rem' }}>
              Senha
              <input
                required
                type="password"
                style={{ width: '100%', marginTop: 4, padding: '0.5rem' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: '0.75rem',
                width: '100%',
                padding: '0.6rem',
                backgroundColor: '#6d28d9',
                color: 'white',
                borderRadius: '0.5rem',
                border: 'none',
                cursor: loading ? 'default' : 'pointer',
                opacity: loading ? 0.7 : 1,
                fontWeight: 600,
              }}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
            <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>
              Primeiro uso?{' '}
              <a
                href="/first-access"
                style={{ color: '#6d28d9', textDecoration: 'underline' }}
              >
                Criar usuário inicial
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

