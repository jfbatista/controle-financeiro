import { useEffect, useState } from 'react';
import { useAuthApi } from '../services/authFetch';

type TransactionType = 'INCOME' | 'EXPENSE';

interface Category {
  id: number;
  name: string;
  type: TransactionType;
}

interface PaymentMethod {
  id: number;
  name: string;
}

interface Transaction {
  id: number;
  type: TransactionType;
  date: string;
  amount: number;
  description?: string | null;
  category: Category;
  paymentMethod: PaymentMethod;
}

export function TransactionsPage() {
  const api = useAuthApi();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [methods, setMethods] = useState<PaymentMethod[]>([]);

  const [type, setType] = useState<TransactionType>('INCOME');
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [paymentMethodId, setPaymentMethodId] = useState('');
  const [description, setDescription] = useState('');

  const [filterFrom, setFilterFrom] = useState('');
  const [filterTo, setFilterTo] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | TransactionType>('ALL');

  async function loadLookups() {
    try {
      const [cats, pms] = await Promise.all([
        api.get<Category[]>('/categories'),
        api.get<PaymentMethod[]>('/payment-methods'),
      ]);
      setCategories(cats);
      setMethods(pms);
    } catch (e: any) {
      alert(`Erro ao carregar categorias/formas de pagamento: ${e?.message || ''}`);
    }
  }

  async function loadTransactions() {
    try {
      const params = new URLSearchParams();
      if (filterFrom) params.append('from', filterFrom);
      if (filterTo) params.append('to', filterTo);
      if (filterType !== 'ALL') params.append('type', filterType);
      const qs = params.toString();
      const data = await api.get<Transaction[]>(
        `/transactions${qs ? `?${qs}` : ''}`,
      );
      setTransactions(data);
    } catch (e: any) {
      alert(`Erro ao carregar lançamentos: ${e?.message || ''}`);
    }
  }

  useEffect(() => {
    loadLookups();
    loadTransactions();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    try {
      await api.post<Transaction, any>('/transactions', {
        type,
        date,
        amount: Number(amount),
        categoryId: Number(categoryId),
        paymentMethodId: Number(paymentMethodId),
        description: description || undefined,
      });
      setAmount('');
      setDescription('');
      await loadTransactions();
    } catch (e: any) {
      alert(`Erro ao criar lançamento: ${e?.message || ''}`);
    }
  }

  const incomeCategories = categories.filter((c) => c.type === 'INCOME');
  const expenseCategories = categories.filter((c) => c.type === 'EXPENSE');
  const visibleCategories =
    type === 'INCOME' ? incomeCategories : expenseCategories;

  return (
    <div>
      <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem' }}>
        Lançamentos
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
        <select
          value={type}
          onChange={(e) => setType(e.target.value as TransactionType)}
          style={{ padding: '0.4rem' }}
        >
          <option value="INCOME">Entrada</option>
          <option value="EXPENSE">Saída</option>
        </select>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={{ padding: '0.4rem' }}
        />
        <input
          required
          type="number"
          min="0"
          step="0.01"
          placeholder="Valor"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={{ padding: '0.4rem', width: 100 }}
        />
        <select
          required
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          style={{ padding: '0.4rem', minWidth: 160 }}
        >
          <option value="">Categoria</option>
          {visibleCategories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <select
          required
          value={paymentMethodId}
          onChange={(e) => setPaymentMethodId(e.target.value)}
          style={{ padding: '0.4rem', minWidth: 160 }}
        >
          <option value="">Forma de pag.</option>
          {methods.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>
        <input
          placeholder="Descrição"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ padding: '0.4rem', minWidth: 160, flex: 1 }}
        />
        <button
          type="submit"
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

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.5rem',
          marginBottom: '0.75rem',
          fontSize: '0.8rem',
        }}
      >
        <span>Filtros:</span>
        <input
          type="date"
          value={filterFrom}
          onChange={(e) => setFilterFrom(e.target.value)}
        />
        <input
          type="date"
          value={filterTo}
          onChange={(e) => setFilterTo(e.target.value)}
        />
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as any)}
        >
          <option value="ALL">Todos</option>
          <option value="INCOME">Entradas</option>
          <option value="EXPENSE">Saídas</option>
        </select>
        <button
          type="button"
          onClick={loadTransactions}
          style={{
            padding: '0.3rem 0.7rem',
            borderRadius: 4,
            border: '1px solid #d1d5db',
            backgroundColor: '#f9fafb',
            cursor: 'pointer',
          }}
        >
          Aplicar
        </button>
      </div>

      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '0.8rem',
        }}
      >
        <thead>
          <tr>
            <th style={{ textAlign: 'left', padding: 6, borderBottom: '1px solid #e5e7eb' }}>
              Data
            </th>
            <th style={{ textAlign: 'left', padding: 6, borderBottom: '1px solid #e5e7eb' }}>
              Tipo
            </th>
            <th style={{ textAlign: 'left', padding: 6, borderBottom: '1px solid #e5e7eb' }}>
              Categoria
            </th>
            <th style={{ textAlign: 'left', padding: 6, borderBottom: '1px solid #e5e7eb' }}>
              Forma de pag.
            </th>
            <th style={{ textAlign: 'right', padding: 6, borderBottom: '1px solid #e5e7eb' }}>
              Valor
            </th>
            <th style={{ textAlign: 'left', padding: 6, borderBottom: '1px solid #e5e7eb' }}>
              Descrição
            </th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <tr key={t.id}>
              <td style={{ padding: 6, borderBottom: '1px solid #f3f4f6' }}>
                {new Date(t.date).toLocaleDateString('pt-BR')}
              </td>
              <td style={{ padding: 6, borderBottom: '1px solid #f3f4f6' }}>
                {t.type === 'INCOME' ? 'Entrada' : 'Saída'}
              </td>
              <td style={{ padding: 6, borderBottom: '1px solid #f3f4f6' }}>
                {t.category?.name}
              </td>
              <td style={{ padding: 6, borderBottom: '1px solid #f3f4f6' }}>
                {t.paymentMethod?.name}
              </td>
              <td
                style={{
                  padding: 6,
                  borderBottom: '1px solid #f3f4f6',
                  textAlign: 'right',
                  color: t.type === 'INCOME' ? '#15803d' : '#b91c1c',
                }}
              >
                {t.amount.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })}
              </td>
              <td style={{ padding: 6, borderBottom: '1px solid #f3f4f6' }}>
                {t.description}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

