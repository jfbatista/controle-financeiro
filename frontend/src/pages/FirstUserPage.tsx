import { useState } from 'react';
import { httpPost } from '../services/http';

interface FirstUserResponse {
  id: number;
  name: string;
  email: string;
  company: {
    id: number;
    name: string;
  };
}

export function FirstUserPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await httpPost<FirstUserResponse, any>('/users/first', {
        name,
        email,
        password,
        companyName,
      });
      alert('Usuário inicial criado com sucesso. Agora você já pode fazer login.');
    } catch (error: any) {
      alert(
        `Erro ao criar usuário inicial: ${
          error?.message || 'verifique os dados e tente novamente.'
        }`,
      );
    } finally {
      setLoading(false);
    }
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
          maxWidth: '480px',
        }}
      >
        <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1.5rem' }}>
          Primeiro acesso
        </h2>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <label style={{ fontSize: '0.85rem' }}>
              Seu nome
              <input
                required
                style={{ width: '100%', marginTop: 4, padding: '0.5rem' }}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
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
            <label style={{ fontSize: '0.85rem' }}>
              Nome da empresa
              <input
                style={{ width: '100%', marginTop: 4, padding: '0.5rem' }}
                placeholder="Ex.: Online Tecnologia da Informação"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
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
              {loading ? 'Enviando...' : 'Criar usuário inicial'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

