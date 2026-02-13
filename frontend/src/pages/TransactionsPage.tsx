import { useEffect, useState } from 'react';
import { useAuthApi } from '../services/authFetch';
import {
  Box,
  Heading,
  Flex,
  Input,
  Select,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Badge,
  VStack,
  FormControl,
  FormLabel,
  useToast,
} from '@chakra-ui/react';
import { Plus, Filter } from 'lucide-react';

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
  const toast = useToast();
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
      toast({
        title: 'Erro ao carregar dados.',
        description: e?.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
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
      toast({
        title: 'Erro ao carregar lançamentos.',
        description: e?.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
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
      // Keep date and type as is for convenience
      await loadTransactions();
      toast({
        title: 'Lançamento criado!',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } catch (e: any) {
      toast({
        title: 'Erro ao criar lançamento.',
        description: e?.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  }

  const incomeCategories = categories.filter((c) => c.type === 'INCOME');
  const expenseCategories = categories.filter((c) => c.type === 'EXPENSE');
  const visibleCategories =
    type === 'INCOME' ? incomeCategories : expenseCategories;

  return (
    <Box>
      <Heading size="lg" mb="6">Lançamentos</Heading>

      {/* New Transaction Form */}
      <Box bg="white" p="6" borderRadius="xl" shadow="sm" mb="8">
        <Heading size="md" mb="4">Novo Lançamento</Heading>
        <form onSubmit={handleCreate}>
          <VStack spacing={4} align="stretch">
            <Flex gap="4" direction={{ base: 'column', md: 'row' }}>
              <FormControl>
                <FormLabel>Tipo</FormLabel>
                <Select value={type} onChange={(e) => setType(e.target.value as TransactionType)}>
                  <option value="INCOME">Entrada</option>
                  <option value="EXPENSE">Saída</option>
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>Data</FormLabel>
                <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              </FormControl>

              <FormControl>
                <FormLabel>Valor</FormLabel>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0,00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </FormControl>
            </Flex>

            <Flex gap="4" direction={{ base: 'column', md: 'row' }}>
              <FormControl>
                <FormLabel>Categoria</FormLabel>
                <Select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  placeholder="Selecione"
                  required
                >
                  {visibleCategories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>Forma de Pagamento</FormLabel>
                <Select
                  value={paymentMethodId}
                  onChange={(e) => setPaymentMethodId(e.target.value)}
                  placeholder="Selecione"
                  required
                >
                  {methods.map((m) => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </Select>
              </FormControl>

              <FormControl flex={2}>
                <FormLabel>Descrição</FormLabel>
                <Input
                  placeholder="Descrição opcional"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </FormControl>
            </Flex>

            <Button type="submit" leftIcon={<Plus size={18} />} colorScheme="brand" alignSelf="flex-end">
              Adicionar
            </Button>
          </VStack>
        </form>
      </Box>

      {/* Filters */}
      <Box mb="6" bg="gray.50" p="4" borderRadius="lg">
        <Flex gap="4" align="flex-end" wrap="wrap">
          <Box>
            <FormLabel fontSize="sm">De</FormLabel>
            <Input
              type="date"
              bg="white"
              size="sm"
              value={filterFrom}
              onChange={(e) => setFilterFrom(e.target.value)}
            />
          </Box>
          <Box>
            <FormLabel fontSize="sm">Até</FormLabel>
            <Input
              type="date"
              bg="white"
              size="sm"
              value={filterTo}
              onChange={(e) => setFilterTo(e.target.value)}
            />
          </Box>
          <Box minW="150px">
            <FormLabel fontSize="sm">Tipo</FormLabel>
            <Select
              bg="white"
              size="sm"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
            >
              <option value="ALL">Todos</option>
              <option value="INCOME">Entradas</option>
              <option value="EXPENSE">Saídas</option>
            </Select>
          </Box>
          <Button size="sm" onClick={loadTransactions} leftIcon={<Filter size={14} />}>
            Filtrar
          </Button>
        </Flex>
      </Box>

      {/* Transactions Table */}
      <Box bg="white" borderRadius="xl" shadow="sm" overflow="hidden">
        <TableContainer>
          <Table variant="simple">
            <Thead bg="gray.50">
              <Tr>
                <Th>Data</Th>
                <Th>Tipo</Th>
                <Th>Categoria</Th>
                <Th>Forma Pag.</Th>
                <Th isNumeric>Valor</Th>
                <Th>Descrição</Th>
              </Tr>
            </Thead>
            <Tbody>
              {transactions.map((t) => (
                <Tr key={t.id} _hover={{ bg: 'gray.50' }}>
                  <Td>{new Date(t.date).toLocaleDateString('pt-BR')}</Td>
                  <Td>
                    <Badge colorScheme={t.type === 'INCOME' ? 'green' : 'red'}>
                      {t.type === 'INCOME' ? 'Entrada' : 'Saída'}
                    </Badge>
                  </Td>
                  <Td>{t.category?.name}</Td>
                  <Td>{t.paymentMethod?.name}</Td>
                  <Td isNumeric fontWeight="bold" color={t.type === 'INCOME' ? 'green.600' : 'red.600'}>
                    {t.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </Td>
                  <Td color="gray.600" fontSize="sm">{t.description}</Td>
                </Tr>
              ))}
              {transactions.length === 0 && (
                <Tr>
                  <Td colSpan={6} textAlign="center" py="8" color="gray.500">
                    Nenhum lançamento encontrado.
                  </Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}
