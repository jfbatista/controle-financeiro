import { useEffect, useState } from 'react';
import { useAuthApi } from '../services/authFetch';

export function DashboardPage() {
  const api = useAuthApi();
  const [loading, setLoading] = useState(false);
  const [totalIncomes, setTotalIncomes] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [netResult, setNetResult] = useState(0);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await api.get<{
          totalIncomes: number;
          totalExpenses: number;
          netResult: number;
        }>('/reports/dashboard');
        setTotalIncomes(Number(data.totalIncomes || 0));
        setTotalExpenses(Number(data.totalExpenses || 0));
        setNetResult(Number(data.netResult || 0));
      } catch (e: any) {
        alert(`Erro ao carregar dashboard: ${e?.message || ''}`);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const netColor = netResult >= 0 ? '#15803d' : '#b91c1c';

  return (
    <div>
      <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>
        Dashboard
      </h2>
      <p style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '0.75rem' }}>
        Visão geral simples do fluxo de caixa.
      </p>

      {loading ? (
        <p style={{ fontSize: '0.8rem' }}>Carregando...</p>
      ) : (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.75rem',
            marginBottom: '1rem',
          }}
        >
          <div
            style={{
              padding: '0.75rem 1rem',
              backgroundColor: '#ecfdf3',
              borderRadius: 8,
              minWidth: 160,
            }}
          >
            <div style={{ fontSize: '0.75rem', color: '#166534' }}>Entradas</div>
            <div style={{ fontWeight: 600 }}>
              {totalIncomes.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}
            </div>
          </div>
          <div
            style={{
              padding: '0.75rem 1rem',
              backgroundColor: '#fef2f2',
              borderRadius: 8,
              minWidth: 160,
            }}
          >
            <div style={{ fontSize: '0.75rem', color: '#b91c1c' }}>Saídas</div>
            <div style={{ fontWeight: 600 }}>
              {totalExpenses.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}
            </div>
          </div>
          <div
            style={{
              padding: '0.75rem 1rem',
              backgroundColor: '#eef2ff',
              borderRadius: 8,
              minWidth: 160,
            }}
          >
            <div style={{ fontSize: '0.75rem', color: '#312e81' }}>Resultado</div>
            <div style={{ fontWeight: 600, color: netColor }}>
              {netResult.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

