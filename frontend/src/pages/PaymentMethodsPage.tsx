import { useEffect, useState } from 'react';
import { useAuthApi } from '../services/authFetch';

interface PaymentMethod {
  id: number;
  name: string;
}

export function PaymentMethodsPage() {
  const api = useAuthApi();
  const [items, setItems] = useState<PaymentMethod[]>([]);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const data = await api.get<PaymentMethod[]>('/payment-methods');
      setItems(data);
    } catch (e: any) {
      alert(`Erro ao carregar formas de pagamento: ${e?.message || ''}`);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    try {
      await api.post<PaymentMethod, any>('/payment-methods', { name });
      setName('');
      await load();
    } catch (e: any) {
      alert(`Erro ao criar forma de pagamento: ${e?.message || ''}`);
    }
  }

  return (
    <div>
      <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem' }}>
        Formas de pagamento
      </h2>
      <form
        onSubmit={handleCreate}
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.5rem',
          marginBottom: '1rem',
        }}
      >
        <input
          required
          placeholder="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ padding: '0.4rem', minWidth: 160 }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '0.4rem 0.8rem',
            backgroundColor: '#6d28d9',
            color: 'white',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
          }}
        >
          Adicionar
        </button>
      </form>

      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '0.85rem',
        }}
      >
        <thead>
          <tr>
            <th style={{ textAlign: 'left', padding: 6, borderBottom: '1px solid #e5e7eb' }}>
              Nome
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((m) => (
            <tr key={m.id}>
              <td style={{ padding: 6, borderBottom: '1px solid #f3f4f6' }}>{m.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

