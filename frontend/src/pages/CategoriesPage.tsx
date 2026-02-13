import { useEffect, useState } from 'react';
import { useAuthApi } from '../services/authFetch';

interface Category {
  id: number;
  name: string;
  type: 'INCOME' | 'EXPENSE';
  color?: string | null;
}

export function CategoriesPage() {
  const api = useAuthApi();
  const [items, setItems] = useState<Category[]>([]);
  const [name, setName] = useState('');
  const [type, setType] = useState<'INCOME' | 'EXPENSE'>('INCOME');
  const [color, setColor] = useState('');
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const data = await api.get<Category[]>('/categories');
      setItems(data);
    } catch (e: any) {
      alert(`Erro ao carregar categorias: ${e?.message || ''}`);
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
      await api.post<Category, any>('/categories', {
        name,
        type,
        color: color || undefined,
      });
      setName('');
      setColor('');
      await load();
    } catch (e: any) {
      alert(`Erro ao criar categoria: ${e?.message || ''}`);
    }
  }

  return (
    <div>
      <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem' }}>
        Categorias
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
          style={{ padding: '0.4rem', minWidth: 140 }}
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value as any)}
          style={{ padding: '0.4rem' }}
        >
          <option value="INCOME">Receita</option>
          <option value="EXPENSE">Despesa</option>
        </select>
        <input
          placeholder="Cor (opcional)"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          style={{ padding: '0.4rem', minWidth: 120 }}
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
            <th style={{ textAlign: 'left', padding: 6, borderBottom: '1px solid #e5e7eb' }}>
              Tipo
            </th>
            <th style={{ textAlign: 'left', padding: 6, borderBottom: '1px solid #e5e7eb' }}>
              Cor
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((c) => (
            <tr key={c.id}>
              <td style={{ padding: 6, borderBottom: '1px solid #f3f4f6' }}>{c.name}</td>
              <td style={{ padding: 6, borderBottom: '1px solid #f3f4f6' }}>
                {c.type === 'INCOME' ? 'Receita' : 'Despesa'}
              </td>
              <td style={{ padding: 6, borderBottom: '1px solid #f3f4f6' }}>{c.color}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

